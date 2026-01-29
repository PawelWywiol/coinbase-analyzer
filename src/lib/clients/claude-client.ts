import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { TechnicalMetrics } from '../analysis';
import { ClaudeExecutionError, ClaudeParseError } from '../errors';
import { type ClaudeAnalysisResult, claudeAnalysisSchema } from '../schemas';
import type { Analysis, Crypto, NewsItem, Timeframe } from '../types';
import { executeSSHCommand, getSSHConfig } from './ssh-client';

type MetricsPerTimeframe = Record<Timeframe, TechnicalMetrics>;

const generateHeredocDelimiter = (): string => `EOF_${randomBytes(8).toString('hex')}`;

const loadPrompt = (): string => {
  const path = join(process.cwd(), 'prompts', 'analysis.md');
  return readFileSync(path, 'utf-8');
};

const formatTimeframeMetrics = (timeframe: Timeframe, metrics: TechnicalMetrics): string => {
  const maString = Object.entries(metrics.movingAverages)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k.toUpperCase()}: $${v?.toFixed(2)}`)
    .join(', ');

  return `### ${timeframe}
- Price: $${metrics.currentPrice.toFixed(2)} (${metrics.priceChangePercent >= 0 ? '+' : ''}${metrics.priceChangePercent.toFixed(2)}%)
- Volatility: ${metrics.volatility.toFixed(2)}%
- MAs: ${maString || 'N/A'}
- Support: ${metrics.supportLevels.map((s) => `$${s.toFixed(2)}`).join(', ') || 'N/A'}
- Resistance: ${metrics.resistanceLevels.map((r) => `$${r.toFixed(2)}`).join(', ') || 'N/A'}
- Volume: ${metrics.volume24h.toFixed(2)} (avg: ${metrics.avgVolume.toFixed(2)})`;
};

const formatNewsData = (news: NewsItem[]): string => {
  if (news.length === 0) return 'No recent news available.';
  return news.map((n, i) => `${i + 1}. ${n.title} (${n.source}, ${n.pubDate})`).join('\n');
};

const formatPrompt = (
  template: string,
  crypto: Crypto,
  metricsPerTimeframe: MetricsPerTimeframe,
  news: NewsItem[],
  weeklyProfitGoal: number,
): string => {
  const timeframeOrder: Timeframe[] = ['1d', '7d', '1m', '3m', '6m', '1y', '5y'];
  const timeframeData = timeframeOrder
    .map((tf) => formatTimeframeMetrics(tf, metricsPerTimeframe[tf]))
    .join('\n\n');

  return template
    .replace('{{crypto}}', crypto)
    .replace('{{weeklyProfitGoal}}', weeklyProfitGoal.toString())
    .replace('{{timeframeData}}', timeframeData)
    .replace('{{newsData}}', formatNewsData(news));
};

const validateClaudePath = (path: string): void => {
  if (!/^[a-zA-Z0-9/_.-]+$/.test(path)) {
    throw new ClaudeExecutionError('Invalid Claude CLI path');
  }
};

const runClaudeSSH = async (prompt: string): Promise<string> => {
  const config = getSSHConfig();
  validateClaudePath(config.claudePath);

  const delimiter = generateHeredocDelimiter();
  const command = `cat <<'${delimiter}' | ${config.claudePath} --output-format json
${prompt}
${delimiter}`;

  return executeSSHCommand(command, config);
};

const parseClaudeResponse = (response: string): ClaudeAnalysisResult => {
  let cliOutput: { result?: string; is_error?: boolean };
  try {
    cliOutput = JSON.parse(response);
  } catch {
    throw new ClaudeParseError('Failed to parse Claude CLI output');
  }

  if (cliOutput.is_error || !cliOutput.result) {
    throw new ClaudeExecutionError(cliOutput.result || 'Claude returned an error');
  }

  const resultText = cliOutput.result;

  // Find balanced JSON object by tracking braces
  let parsed: unknown;
  const startIdx = resultText.indexOf('{');
  if (startIdx === -1) {
    throw new ClaudeParseError('No JSON found in Claude response');
  }

  let depth = 0;
  let endIdx = -1;
  let inString = false;
  let isEscaped = false;

  for (let i = startIdx; i < resultText.length; i++) {
    const char = resultText[i];
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    if (char === '\\' && inString) {
      isEscaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (char === '{') depth++;
    if (char === '}') {
      depth--;
      if (depth === 0) {
        endIdx = i;
        break;
      }
    }
  }

  if (endIdx === -1) {
    throw new ClaudeParseError('Malformed JSON in Claude response');
  }

  try {
    parsed = JSON.parse(resultText.slice(startIdx, endIdx + 1));
  } catch {
    throw new ClaudeParseError('Failed to parse JSON from Claude response');
  }

  const result = claudeAnalysisSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    console.error('Claude response validation failed:', JSON.stringify(parsed, null, 2));
    console.error('Validation errors:', issues);
    throw new ClaudeParseError(`Invalid response structure: ${issues}`);
  }

  return result.data;
};

export const analyzeWithClaude = async (
  crypto: Crypto,
  metricsPerTimeframe: MetricsPerTimeframe,
  news: NewsItem[],
  weeklyProfitGoal: number,
): Promise<Analysis> => {
  const template = loadPrompt();
  const prompt = formatPrompt(template, crypto, metricsPerTimeframe, news, weeklyProfitGoal);

  const response = await runClaudeSSH(prompt);
  const validated = parseClaudeResponse(response);

  // Use 1d metrics for backward compat fields
  const dayMetrics = metricsPerTimeframe['1d'];

  return {
    ...validated,
    supportLevels: dayMetrics.supportLevels,
    resistanceLevels: dayMetrics.resistanceLevels,
    movingAverages: dayMetrics.movingAverages,
    volatility: dayMetrics.volatility,
  };
};

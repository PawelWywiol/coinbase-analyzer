import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { TechnicalMetrics } from '../analysis';
import { ClaudeExecutionError, ClaudeParseError } from '../errors';
import { type ClaudeAnalysisResult, claudeAnalysisSchema } from '../schemas';
import type { Analysis, Crypto, Timeframe } from '../types';
import { executeSSHCommand, getSSHConfig } from './ssh-client';

const generateHeredocDelimiter = (): string => `EOF_${randomBytes(8).toString('hex')}`;

const loadPrompt = (): string => {
  const path = join(process.cwd(), 'prompts', 'analysis.md');
  return readFileSync(path, 'utf-8');
};

const formatPrompt = (
  template: string,
  crypto: Crypto,
  timeframe: Timeframe,
  metrics: TechnicalMetrics,
): string => {
  const maString = Object.entries(metrics.movingAverages)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `- ${k.toUpperCase()}: $${v?.toFixed(2)}`)
    .join('\n');

  return template
    .replace('{{crypto}}', crypto)
    .replace('{{timeframe}}', timeframe)
    .replace('{{currentPrice}}', metrics.currentPrice.toFixed(2))
    .replace('{{priceChangePercent}}', metrics.priceChangePercent.toFixed(2))
    .replace('{{volatility}}', metrics.volatility.toFixed(2))
    .replace('{{movingAverages}}', maString)
    .replace(
      '{{supportLevels}}',
      metrics.supportLevels.map((s) => `$${s.toFixed(2)}`).join(', ') || 'N/A',
    )
    .replace(
      '{{resistanceLevels}}',
      metrics.resistanceLevels.map((r) => `$${r.toFixed(2)}`).join(', ') || 'N/A',
    )
    .replace('{{volume24h}}', metrics.volume24h.toFixed(2))
    .replace('{{avgVolume}}', metrics.avgVolume.toFixed(2));
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
    throw new ClaudeParseError(`Invalid response structure: ${result.error.issues[0]?.message}`);
  }

  return result.data;
};

export const analyzeWithClaude = async (
  crypto: Crypto,
  timeframe: Timeframe,
  metrics: TechnicalMetrics,
): Promise<Analysis> => {
  const template = loadPrompt();
  const prompt = formatPrompt(template, crypto, timeframe, metrics);

  const response = await runClaudeSSH(prompt);
  const validated = parseClaudeResponse(response);

  return {
    ...validated,
    supportLevels: metrics.supportLevels,
    resistanceLevels: metrics.resistanceLevels,
    movingAverages: metrics.movingAverages,
    volatility: metrics.volatility,
  };
};

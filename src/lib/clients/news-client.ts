import type { Crypto, NewsItem } from '../types';

const NEWS_CACHE_TTL = 300; // 5 minutes
const MAX_NEWS_ITEMS = 10;

const newsCache = new Map<string, { data: NewsItem[]; timestamp: number }>();

const CRYPTO_SEARCH_TERMS: Record<Crypto, string> = {
  BTC: 'bitcoin cryptocurrency',
  ETH: 'ethereum cryptocurrency',
  LINK: 'chainlink cryptocurrency',
  LTC: 'litecoin cryptocurrency',
  DOT: 'polkadot cryptocurrency',
};

const parseRssItem = (itemXml: string): NewsItem | null => {
  const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/s);
  const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
  const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
  const sourceMatch = itemXml.match(/<source[^>]*>(.*?)<\/source>/);

  if (!titleMatch || !linkMatch) return null;

  return {
    title: titleMatch[1].trim(),
    link: linkMatch[1].trim(),
    pubDate: pubDateMatch?.[1] ?? '',
    source: sourceMatch?.[1] ?? 'Google News',
  };
};

const parseRssFeed = (xml: string): NewsItem[] => {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const matches = xml.matchAll(itemRegex);

  for (const match of matches) {
    if (items.length >= MAX_NEWS_ITEMS) break;
    const item = parseRssItem(match[1]);
    if (item) items.push(item);
  }

  return items;
};

export const fetchCryptoNews = async (crypto: Crypto): Promise<NewsItem[]> => {
  const cached = newsCache.get(crypto);
  if (cached) {
    const age = (Date.now() - cached.timestamp) / 1000;
    if (age <= NEWS_CACHE_TTL) return cached.data;
  }

  const searchTerm = encodeURIComponent(CRYPTO_SEARCH_TERMS[crypto]);
  const url = `https://news.google.com/rss/search?q=${searchTerm}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CryptoAnalyzer/1.0)' },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error(`News fetch failed: ${response.status}`);
      return cached?.data ?? [];
    }

    const xml = await response.text();
    const items = parseRssFeed(xml);

    newsCache.set(crypto, { data: items, timestamp: Date.now() });
    return items;
  } catch (error) {
    console.error('News fetch error:', error);
    return cached?.data ?? [];
  }
};

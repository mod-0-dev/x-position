const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "if", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "as", "is", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
  "i", "you", "he", "she", "it", "we", "they", "this", "that", "these", "those",
  "my", "your", "his", "her", "its", "our", "their", "me", "him", "us", "them",
]);

export function tokenize(text: string): Set<string> {
  const tokens = new Set<string>();
  for (const raw of text.toLowerCase().split(/[^a-z0-9']+/)) {
    const word = raw.replace(/^'+|'+$/g, "");
    if (word.length < 3) continue;
    if (STOPWORDS.has(word)) continue;
    tokens.add(word);
  }
  return tokens;
}

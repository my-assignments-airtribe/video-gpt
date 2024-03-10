// src/utils/extractKeywords.ts
import nlp from 'compromise';

export const extractKeywords = (text: string): string[] => {
  const doc = nlp(text);
  const keywords = doc.topics().out('array');
  return keywords;
};

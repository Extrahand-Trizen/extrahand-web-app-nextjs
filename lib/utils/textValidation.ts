/**
 * Text quality validation - matches backend logic
 * Prevents meaningless, spam-like, or low-quality text submissions
 */

function countVowels(text: string): number {
  return (text.match(/[aeiouy]/gi) || []).length;
}

function countLetters(text: string): number {
  return (text.match(/[A-Za-z]/g) || []).length;
}

function extractWords(text: string): string[] {
  return text.match(/[A-Za-z]+(?:'[A-Za-z]+)*/g) || [];
}

function isLikelyMeaningfulWord(word: string): boolean {
  const normalized = word.toLowerCase();

  if (normalized.length < 3) {
    return false;
  }

  const hasVowel = /[aeiouy]/.test(normalized);
  const hasConsonant = /[bcdfghjklmnpqrstvwxyz]/.test(normalized);
  if (!hasVowel || !hasConsonant) {
    return false;
  }

  // Blocks obvious junk tokens like aaabbb / dndffff / oeeeaa
  if (/(.)\1{2,}/.test(normalized)) {
    return false;
  }

  if (/[aeiouy]{4,}/.test(normalized) || /[bcdfghjklmnpqrstvwxyz]{5,}/.test(normalized)) {
    return false;
  }

  const uniqueChars = new Set(normalized.split(''));
  if (normalized.length >= 5 && uniqueChars.size <= 2) {
    return false;
  }

  return true;
}

export function getMeaningfulTextError(
  value: string | undefined | null,
  fieldName: string,
  minLength: number,
  minWords: number,
  allowSingleWord: boolean = false,
  minSingleWordLength: number = 4,
  minVowelRatio: number = 0.25
): string | null {
  const text = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';

  if (!text) {
    return `${fieldName} is required`;
  }

  if (text.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }

  // Check for repeated characters like 'aaaa' or 'xxxx'
  if (/^(.)\1{3,}$/i.test(text.replace(/\s+/g, ''))) {
    return `${fieldName} looks like repeated characters`;
  }

  const words = extractWords(text);
  if (words.length === 0) {
    return `${fieldName} must contain readable words`;
  }

  const meaningfulWords = words.filter(isLikelyMeaningfulWord);

  if (words.length === 1 && !allowSingleWord) {
    return `${fieldName} must contain at least ${minWords} descriptive words`;
  }

  if (words.length > 1 && words.length < minWords) {
    return `${fieldName} must contain at least ${minWords} descriptive words`;
  }

  if (words.length > 1) {
    const requiredMeaningfulWords = Math.max(2, minWords - 1);
    if (meaningfulWords.length < requiredMeaningfulWords) {
      return `${fieldName} should use clear, meaningful words`;
    }
  }

  const letters = countLetters(text);
  if (!letters) {
    return `${fieldName} must contain letters`;
  }

  const vowelRatio = countVowels(text) / letters;

  // For single words, be stricter
  if (words.length === 1) {
    const [singleWord] = words;
    if (singleWord.length < minSingleWordLength) {
      return `${fieldName} must be more descriptive`;
    }

    if (!isLikelyMeaningfulWord(singleWord)) {
      return `${fieldName} should use clear, meaningful words`;
    }

    // Single words with very few vowels are likely gibberish
    if (vowelRatio < 0.2) {
      return `${fieldName} must be more descriptive`;
    }
  } else if (vowelRatio < minVowelRatio) {
    // Multi-word text with too few vowels is suspicious
    return `${fieldName} must be more descriptive`;
  }

  // Check for repetitive word patterns
  const compactWords = words
    .map((w) => w.toLowerCase())
    .filter((w) => w.length >= 2);

  if (compactWords.length >= 3) {
    const uniqueWords = new Set(compactWords);
    if (uniqueWords.size === 1) {
      return `${fieldName} must not repeat the same word`;
    }
  }

  return null;
}

/**
 * Array random selection and shuffle utilities.
 */

/**
 * Returns a random element from an array.
 *
 * @example
 * sample([1, 2, 3]) // 2 (random)
 */
export function sample<T>(array: T[]): T | undefined {
  if (!array.length) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Returns multiple random elements from an array (without duplicates).
 *
 * @example
 * sampleSize([1, 2, 3, 4, 5], 3) // [5, 1, 3] (random)
 */
export function sampleSize<T>(array: T[], count: number): T[] {
  if (count >= array.length) return [...array];
  const shuffled = shuffle([...array]);
  return shuffled.slice(0, count);
}

/**
 * Shuffles an array using Fisher-Yates algorithm (returns new array).
 *
 * @example
 * shuffle([1, 2, 3, 4, 5]) // [3, 1, 5, 2, 4] (random order)
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Creates a seeded random shuffle (deterministic order).
 *
 * @example
 * seededShuffle([1, 2, 3, 4], 42) // Same result every time with seed 42
 */
export function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

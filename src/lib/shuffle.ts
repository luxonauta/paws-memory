/**
 * Returns a shuffled shallow copy of the given array.
 */
export const shuffleArray = <T>(source: T[]): T[] => {
  const arr = [...source];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i];

    arr[i] = arr[j];
    arr[j] = t;
  }

  return arr;
};

/**
 * Assigns contiguous positions [0..n-1] to items using provided mapper.
 */
export const assignPositions = <T>(items: T[], setPosition: (item: T, index: number) => T): T[] => {
  return items.map((item, index) => setPosition(item, index));
};

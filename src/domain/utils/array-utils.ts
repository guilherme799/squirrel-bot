declare global {
  interface Array<T> {
    any(predicate?: (item: T) => boolean): boolean;
    firstOrDefault(predicate?: (item: T) => boolean): T | null | undefined;
  }
}

Array.prototype.any = function <T>(
  this: Array<T>,
  predicate?: (item: T) => boolean
): boolean {
  if (!predicate) {
    return this.length > 0;
  }

  return this.filter((item) => predicate(item)).length > 0;
};

Array.prototype.firstOrDefault = function <T>(
  this: Array<T>,
  predicate: (item: T) => boolean
): T | null | undefined {
  if (!predicate) return this[0];

  return this.filter((item) => predicate(item))[0];
};

export {};

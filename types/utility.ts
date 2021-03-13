export type NotEmptyArray<T> = [T] & T[]

export function isArrayNotEmpty<T> (arr: T[]): arr is NotEmptyArray<T> {
  return arr.length > 0
}

export type MutatePayload<T extends { id: keyof any }, K extends keyof T = keyof T> = {
  id: T['id'];
  key: K;
  value: T[K];
}

export type ArrayElement<ArrType> = ArrType extends ReadonlyArray<infer ElementType>
  ? ElementType
  : never;

export type ExcludeNull<T> = T extends null ? never : T;

export type ExcludeUndefined<T> = T extends undefined ? never : T;

export type KeysOfObjectOrNull<T> = keyof ExcludeNull<T>;

export type ArrayElement<ArrayType extends Array<unknown>> =
    ArrayType extends Array<(infer ElementType)> ? ElementType : never;

export type ExcludeNull<T> = T extends null ? never : T;

export type KeysOfObjectOrNull<T> = keyof ExcludeNull<T>;

export type ExcludeNull<T> = T extends null ? never : T;

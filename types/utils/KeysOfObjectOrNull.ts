export type KeysOfObjectOrNull<T> = T extends null ? never : keyof T;

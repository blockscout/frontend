import type { ExcludeNull } from './ExcludeNull';

export type KeysOfObjectOrNull<T> = keyof ExcludeNull<T>;

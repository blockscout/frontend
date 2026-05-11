import type { TokenInfoApplication } from 'types/api/account';

export type TokenVerifiedInfo = Omit<TokenInfoApplication, 'id' | 'status'>;

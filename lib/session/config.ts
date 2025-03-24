import type { SessionOptions } from 'iron-session';

import { getEnvValue } from 'configs/app/utils';

const ttl = getEnvValue('NEXT_PUBLIC_SESSION_TTL');

export const sessionOptions: SessionOptions = {
  cookieName: `${ getEnvValue('NEXT_PUBLIC_NETWORK_SHORT_NAME')!.split(' ').join('-') }-session-token`,
  password: getEnvValue('NEXT_PUBLIC_SESSION_PASSWORD')!,
  cookieOptions: {
    secure: getEnvValue('NEXT_PUBLIC_APP_ENV') === 'production',
  },
  ttl: ttl ? Number(ttl) : undefined,
};

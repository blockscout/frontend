import type { SessionOptions } from 'iron-session';

import { getEnvValue } from 'configs/app/utils';

const ttl = getEnvValue('SESSION_TTL');

export const sessionOptions: SessionOptions = {
  cookieName: `${ getEnvValue('NEXT_PUBLIC_NETWORK_SHORT_NAME') }-session-token`,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  password: getEnvValue('SESSION_PASSWORD')!,
  cookieOptions: {
    secure: getEnvValue('NEXT_PUBLIC_APP_ENV') === 'production',
  },
  ttl: ttl ? Number(ttl) : undefined,
};

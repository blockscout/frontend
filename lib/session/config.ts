import { getEnvValue } from 'configs/app/utils';

export const sessionOptions = {
  cookieName: 'mechian-session-token',
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  password: getEnvValue('SESSION_PASSWORD')!,
  cookieOptions: {
    secure: getEnvValue('NEXT_PUBLIC_APP_ENV') === 'production',
  },
};

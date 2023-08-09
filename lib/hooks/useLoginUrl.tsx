import { useRouter } from 'next/router';
import { route } from 'nextjs-routes';

import config from 'configs/app';

export default function useLoginUrl() {
  const router = useRouter();
  return config.features.account.authUrl + route({ pathname: '/auth/auth0', query: { path: router.asPath } });
}

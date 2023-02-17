import { useRouter } from 'next/router';
import { route } from 'nextjs-routes';

import appConfig from 'configs/app/config';

export default function useLoginUrl() {
  const router = useRouter();
  return appConfig.authUrl + route({ pathname: '/auth/auth0', query: { path: router.asPath } });
}

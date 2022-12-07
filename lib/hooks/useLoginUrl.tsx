import { useRouter } from 'next/router';

import link from 'lib/link/link';

export default function useLoginUrl() {
  const router = useRouter();
  return link('auth', {}, { path: router.asPath });
}

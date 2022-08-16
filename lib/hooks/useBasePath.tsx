import { useRouter } from 'next/router';

export default function useBasePath() {
  const router = useRouter();
  return `/${ router.query.network_type }/${ router.query.network_sub_type }`;
}

import { useRouter } from 'next/router';

export default function useBasePath() {
  const router = useRouter();
  return `/${ router.query.network_name }/${ router.query.network_type }`;
}

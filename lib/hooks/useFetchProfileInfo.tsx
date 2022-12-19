import useApiQuery from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';

export default function useFetchProfileInfo() {
  return useApiQuery('user_info', {
    queryOptions: {
      refetchOnMount: false,
      enabled: Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
    },
  });
}

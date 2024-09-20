import useApiQuery from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';

// TODO @tom2drum move to auth
export default function useFetchProfileInfo() {
  return useApiQuery('user_info', {
    queryOptions: {
      refetchOnMount: false,
      enabled: Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
    },
  });
}

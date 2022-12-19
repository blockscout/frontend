import useApi from 'lib/api/useApi';
import * as cookies from 'lib/cookies';

export default function useFetchProfileInfo() {
  return useApi('user_info', {
    refetchOnMount: false,
    enabled: Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
  });
}

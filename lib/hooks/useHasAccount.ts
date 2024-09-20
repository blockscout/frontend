import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';

import useFetchProfileInfo from './useFetchProfileInfo';

// TODO @tom2drum move to auth
export default function useHasAccount() {
  const appProps = useAppContext();
  const profileQuery = useFetchProfileInfo();

  if (!config.features.account.isEnabled) {
    return false;
  }

  const cookiesString = appProps.cookies;
  const hasAuth = Boolean(cookies.get(cookies.NAMES.API_TOKEN, cookiesString) || profileQuery.data);
  return hasAuth;
}

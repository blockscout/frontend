import appConfig from 'configs/app/config';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';

export default function useHasAccount() {
  const appProps = useAppContext();

  if (!appConfig.isAccountSupported) {
    return false;
  }

  const cookiesString = appProps.cookies;
  const hasAuth = Boolean(cookies.get(cookies.NAMES.API_TOKEN, cookiesString));
  return hasAuth;
}

import appConfig from 'configs/app/config';
import { useAppContext } from 'lib/appContext';
import * as cookies from 'lib/cookies';

export default function useHasAccount() {
  const appProps = useAppContext();
  const cookiesString = appProps.cookies;
  const hasAuth = Boolean(cookies.get(cookies.NAMES.API_TOKEN, cookiesString));
  return hasAuth && appConfig.isAccountSupported;
}

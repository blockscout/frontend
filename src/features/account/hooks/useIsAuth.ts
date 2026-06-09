// SPDX-License-Identifier: LicenseRef-Blockscout

import { useAppContext } from 'src/shell/app/context';

import config from 'src/config';
import * as cookies from 'src/shared/storage/cookies';

import useProfileQuery from './useProfileQuery';

export default function useAuth() {
  const appProps = useAppContext();
  const profileQuery = useProfileQuery();

  if (!config.features.account.isEnabled) {
    return false;
  }

  const cookiesString = appProps.cookies;
  const hasAuth = Boolean(cookies.get(cookies.NAMES.API_TOKEN, cookiesString) || profileQuery.data);
  return hasAuth;
}

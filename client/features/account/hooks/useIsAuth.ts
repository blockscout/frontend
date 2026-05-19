// SPDX-License-Identifier: LicenseRef-Blockscout

import * as cookies from 'client/shared/storage/cookies';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';

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

// SPDX-License-Identifier: LicenseRef-Blockscout

import getPageType, { PAGE_TYPE_DICT } from './get-page-type';
import logEvent from './log-event';
import reset from './reset';
import useLogPageView from './useLogPageView';
import useInit from './useMixpanelInit';
import * as userProfile from './user-profile';
export * from './utils';

export {
  useInit,
  useLogPageView,
  logEvent,
  getPageType,
  userProfile,
  reset,
  PAGE_TYPE_DICT,
};

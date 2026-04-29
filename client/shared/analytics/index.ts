import getPageType, { PAGE_TYPE_DICT } from './get-page-type';
import logEvent from './log-event';
import reset from './reset';
import useInit from './useInit';
import useLogPageView from './useLogPageView';
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

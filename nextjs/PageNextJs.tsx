// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { Route } from 'nextjs-routes';
import type { Props as PageProps } from 'nextjs/getServerSideProps/handlers';

import useGetCsrfToken from 'client/features/account/hooks/useGetCsrfToken';

import * as mixpanel from 'client/shared/analytics/mixpanel';
import useIsMounted from 'client/shared/hooks/useIsMounted';

import useAdblockDetect from 'lib/hooks/useAdblockDetect';
import useNotifyOnNavigation from 'lib/hooks/useNotifyOnNavigation';

interface Props<Pathname extends Route['pathname']> {
  pathname: Pathname;
  children: React.ReactNode;
  query?: PageProps<Pathname>['query'];
  apiData?: PageProps<Pathname>['apiData'];
}

const PageNextJs = <Pathname extends Route['pathname']>(props: Props<Pathname>) => {
  const isMounted = useIsMounted();

  useGetCsrfToken();
  useAdblockDetect();
  useNotifyOnNavigation();

  const isMixPanelInitialized = mixpanel.useInit();
  mixpanel.useLogPageView(isMixPanelInitialized);

  return isMounted ? props.children : null;
};

export default React.memo(PageNextJs);

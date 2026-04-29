import React from 'react';

import type { Route } from 'nextjs-routes';
import type { Props as PageProps } from 'nextjs/getServerSideProps/handlers';

import useAdblockDetect from 'lib/hooks/useAdblockDetect';
import useGetCsrfToken from 'lib/hooks/useGetCsrfToken';
import useIsMounted from 'client/shared/hooks/useIsMounted';
import useNotifyOnNavigation from 'lib/hooks/useNotifyOnNavigation';
import * as mixpanel from 'client/shared/analytics';

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

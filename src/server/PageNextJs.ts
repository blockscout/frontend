// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Route } from 'nextjs-routes';
import React from 'react';

import type { Props as PageProps } from 'src/server/getServerSideProps/handlers';

import useGetCsrfToken from 'src/features/account/hooks/useGetCsrfToken';
import useAdblockDetect from 'src/features/ads/common/hooks/useAdblockDetect';
import useNotifyOnNavigation from 'src/features/metasuites/hooks/useNotifyOnNavigation';

import * as mixpanel from 'src/services/mixpanel';
import useUpdateUsercentricsConsent from 'src/services/usercentrics/useUpdateUsercentricsConsent';
import useIsMounted from 'src/shared/hooks/useIsMounted';

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
  useUpdateUsercentricsConsent();

  const isMixPanelInitialized = mixpanel.useInit();
  mixpanel.useLogPageView(isMixPanelInitialized);

  return isMounted ? props.children : null;
};

export default React.memo(PageNextJs);

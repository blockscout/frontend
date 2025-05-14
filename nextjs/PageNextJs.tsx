import React from 'react';

import type { Route } from 'nextjs-routes';
import type { Props as PageProps } from 'nextjs/getServerSideProps';
import PageMetadata from 'nextjs/PageMetadata';

import useAdblockDetect from 'lib/hooks/useAdblockDetect';
import useGetCsrfToken from 'lib/hooks/useGetCsrfToken';
import useIsMounted from 'lib/hooks/useIsMounted';
import useNotifyOnNavigation from 'lib/hooks/useNotifyOnNavigation';
import * as mixpanel from 'lib/mixpanel';

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

  const isMixpanelInited = mixpanel.useInit();
  mixpanel.useLogPageView(isMixpanelInited);

  return (
    <>
      <PageMetadata pathname={ props.pathname } query={ props.query } apiData={ props.apiData }/>
      { isMounted ? props.children : null }
    </>
  );
};

export default React.memo(PageNextJs);

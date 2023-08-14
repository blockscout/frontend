import React from 'react';

import useAdblockDetect from 'lib/hooks/useAdblockDetect';
import useGetCsrfToken from 'lib/hooks/useGetCsrfToken';
import * as mixpanel from 'lib/mixpanel';

interface Props {
  children: React.ReactNode;
}

const Page = ({ children }: Props) => {

  useGetCsrfToken();

  useAdblockDetect();

  const isMixpanelInited = mixpanel.useInit();
  mixpanel.useLogPageView(isMixpanelInited);

  return <div>{ children }</div>;
};

export default Page;

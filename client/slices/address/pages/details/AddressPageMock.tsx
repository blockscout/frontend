// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

const MockAddressPage = ({ children }: { children: React.JSX.Element }): React.JSX.Element => {
  const router = useRouter();

  const { data } = useApiQuery('general:address', {
    pathParams: { hash: router.query.hash?.toString() },
    queryOptions: { enabled: Boolean(router.query.hash) },
  });

  if (!data) {
    return <div/>;
  }

  return children;
};

export default MockAddressPage;

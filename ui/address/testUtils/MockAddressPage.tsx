import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';

const MockAddressPage = ({ children }: { children: JSX.Element }): JSX.Element => {
  const router = useRouter();

  const { data } = useApiQuery('address', {
    pathParams: { id: router.query.id?.toString() },
    queryOptions: { enabled: Boolean(router.query.id) },
  });

  if (!data) {
    return <div/>;
  }

  return children;
};

export default MockAddressPage;

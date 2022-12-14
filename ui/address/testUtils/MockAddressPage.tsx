import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import { QueryKeys } from 'types/client/queries';

import useFetch from 'lib/hooks/useFetch';

const MockAddressPage = ({ children }: { children: JSX.Element }): JSX.Element => {
  const router = useRouter();
  const fetch = useFetch();

  const { data } = useQuery(
    [ QueryKeys.address, router.query.id ],
    async() => await fetch(`/node-api/addresses/${ router.query.id }`),
    {
      enabled: Boolean(router.query.id),
    },
  );

  if (!data) {
    return <div/>;
  }

  return children;
};

export default MockAddressPage;

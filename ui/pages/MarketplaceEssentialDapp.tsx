import { useRouter } from 'next/router';
import React from 'react';

import getQueryParamString from 'lib/router/getQueryParamString';
import Swap from 'ui/marketplace/essentialDapps/swap/Swap';
import PageTitle from 'ui/shared/Page/PageTitle';

const EssentialDapp = () => {
  const router = useRouter();
  const id = getQueryParamString(router.query.id);

  let title = null;
  let content = null;

  switch (id) {
    case 'swap':
      title = 'Swap';
      content = <Swap/>;
      break;
  }

  if (!title || !content) {
    return <div>Not found</div>;
  }

  return (
    <>
      <PageTitle title={ title }/>
      { content }
    </>
  );
};

export default EssentialDapp;

import { useRouter } from 'next/router';
import React from 'react';

import getQueryParamString from 'lib/router/getQueryParamString';
import Multisend from 'ui/marketplace/essentialDapps/multisend/Multisend';
import Revoke from 'ui/marketplace/essentialDapps/revoke/Revoke';
import Swap from 'ui/marketplace/essentialDapps/swap/Swap';
import PageTitle from 'ui/shared/Page/PageTitle';

const EssentialDapp = () => {
  const router = useRouter();
  const id = getQueryParamString(router.query.id);

  let title = null;
  let content = null;
  let isCentered = false;

  switch (id) {
    case 'swap':
      title = 'Swap';
      content = <Swap/>;
      isCentered = true;
      break;
    case 'revoke':
      title = 'Revoke';
      content = <Revoke/>;
      break;
    case 'multisend':
      title = 'Multisend';
      content = <Multisend/>;
      isCentered = true;
      break;
  }

  if (!title || !content) {
    return <div>Not found</div>;
  }

  return (
    <>
      <PageTitle title={ title } alignItems={ isCentered ? 'center' : undefined }/>
      { content }
    </>
  );
};

export default EssentialDapp;

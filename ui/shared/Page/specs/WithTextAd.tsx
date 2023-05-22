import React from 'react';

import Tag from 'ui/shared/chakra/Tag';

import PageTitle from '../PageTitle';

const WithTextAd = () => {
  const backLink = {
    label: 'Back to Home',
    url: 'https://localhost:3000',
  };

  return (
    <PageTitle
      title="Block"
      backLink={ backLink }
      contentAfter={ <Tag key="custom" colorScheme="orange" variant="solid">Awesome</Tag> }
      withTextAd
    />
  );
};

export default WithTextAd;

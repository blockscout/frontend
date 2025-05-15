import React from 'react';

import { Badge } from 'toolkit/chakra/badge';

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
      contentAfter={ <Badge key="custom" colorPalette="orange" variant="solid">Awesome</Badge> }
      withTextAd
    />
  );
};

export default WithTextAd;

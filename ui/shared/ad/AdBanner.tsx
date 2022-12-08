import { chakra } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import isSelfHosted from 'lib/isSelfHosted';

import AdbutlerBanner from './AdbutlerBanner';
import CoinzillaBanner from './CoinzillaBanner';

const AdBanner = ({ className }: { className?: string }) => {
  if (!isSelfHosted()) {
    return null;
  }

  if (appConfig.ad.adButlerOn) {
    return <AdbutlerBanner className={ className }/>;
  }

  return <CoinzillaBanner className={ className }/>;
};

export default chakra(AdBanner);

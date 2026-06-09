// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import { useAppContext } from 'src/shell/app/context';

import config from 'src/config';
import * as cookies from 'src/shared/storage/cookies';

import SevioTextAd from './SevioTextAd';

const TextAd = ({ className }: { className?: string }) => {
  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED, useAppContext().cookies);

  if (!config.features.adsText.isEnabled || hasAdblockCookie === 'true') {
    return null;
  }

  return <SevioTextAd className={ className }/>;
};

export default chakra(TextAd);

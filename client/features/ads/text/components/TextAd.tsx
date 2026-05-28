// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import { useAppContext } from 'client/shell/app/context';

import config from 'client/config';
import * as cookies from 'client/shared/storage/cookies';

import SevioTextAd from './SevioTextAd';

const TextAd = ({ className }: { className?: string }) => {
  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED, useAppContext().cookies);

  if (!config.features.adsText.isEnabled || hasAdblockCookie === 'true') {
    return null;
  }

  return <SevioTextAd className={ className }/>;
};

export default chakra(TextAd);

// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import config from 'src/config';
import * as analytics from 'src/shared/analytics';

import AddressMultichainButton from './AddressMultichainButton';

const feature = config.features.multichainButton;

interface Props {
  addressHash: string;
}

const AddressMultichainButtons = ({ addressHash }: Props) => {
  const handleClick = React.useCallback(() => {
    analytics.logEvent(analytics.EventTypes.BUTTON_CLICK, { Content: 'Multichain', Source: 'address' });
  }, []);

  if (!feature.isEnabled || feature.providers.length === 0) {
    return null;
  }

  return (
    <HStack gap={ 1 } flexWrap="wrap">
      { feature.providers.map((item) => (
        <AddressMultichainButton
          key={ item.name }
          item={ item }
          addressHash={ addressHash }
          onClick={ handleClick }
        />
      )) }
    </HStack>
  );
};

export default React.memo(AddressMultichainButtons);

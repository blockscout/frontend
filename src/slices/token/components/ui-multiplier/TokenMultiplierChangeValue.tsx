// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import { formatUiMultiplier, parseUiMultiplier } from 'src/slices/token/utils/ui-multiplier';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Truncate } from 'src/toolkit/components/truncation/Truncate';

interface Props {
  oldMultiplier: string;
  newMultiplier: string;
  isLoading?: boolean;
}

const TokenMultiplierChangeValue = ({ oldMultiplier, newMultiplier, isLoading }: Props) => {
  return (
    <HStack>
      <Truncate
        value={ formatUiMultiplier(parseUiMultiplier(oldMultiplier)) }
        type="end"
        loading={ isLoading }
        color="text.secondary"
        maxW="calc(50% - 18px)"
      />
      <SpriteIcon
        name="arrows/east"
        isLoading={ isLoading }
        boxSize={ 5 }
        flexShrink={ 0 }
        color="icon.primary"
      />
      <Truncate
        value={ formatUiMultiplier(parseUiMultiplier(newMultiplier)) }
        type="end"
        loading={ isLoading }
        color="text.secondary"
        maxW="calc(50% - 18px)"
      />
    </HStack>
  );
};

export default React.memo(TokenMultiplierChangeValue);

// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import { formatUiMultiplier, parseUiMultiplier } from 'src/slices/token/utils/ui-multiplier';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  oldMultiplier: string;
  newMultiplier: string;
  isLoading?: boolean;
}

const TokenMultiplierChangeValue = ({ oldMultiplier, newMultiplier, isLoading }: Props) => {
  return (
    <HStack>
      <Skeleton loading={ isLoading } color="text.secondary">{ formatUiMultiplier(parseUiMultiplier(oldMultiplier)) }</Skeleton>
      <SpriteIcon
        name="arrows/east"
        isLoading={ isLoading }
        boxSize={ 5 }
        flexShrink={ 0 }
        color="icon.primary"
      />
      <Skeleton loading={ isLoading }>{ formatUiMultiplier(parseUiMultiplier(newMultiplier)) }</Skeleton>
    </HStack>
  );
};

export default React.memo(TokenMultiplierChangeValue);

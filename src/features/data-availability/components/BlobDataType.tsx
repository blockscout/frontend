// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import guessDataType from 'src/features/data-availability/utils/guess-data-type';

import type { IconName } from 'src/sprite/SpriteIcon';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
interface Props {
  data: string;
  isLoading?: boolean;
}

const TYPES: Record<string, { iconName: IconName; label: string }> = {
  image: { iconName: 'blobs/image', label: 'Image' },
  text: { iconName: 'blobs/text', label: 'Text' },
  raw: { iconName: 'blobs/raw', label: 'Raw' },
};

const BlobDataType = ({ data, isLoading }: Props) => {
  const guessedType = React.useMemo(() => {
    if (isLoading) {
      return;
    }
    return guessDataType(data);
  }, [ data, isLoading ]);

  const { iconName, label } = (() => {
    if (guessedType?.mime?.startsWith('image/')) {
      return TYPES.image;
    }

    if (
      guessedType?.mime?.startsWith('text/') ||
      [
        'application/json',
        'application/xml',
        'application/javascript',
      ].includes(guessedType?.mime || '')
    ) {
      return TYPES.text;
    }

    return TYPES.raw;
  })();

  return (
    <Flex alignItems="center" columnGap={ 2 }>
      <SpriteIcon name={ iconName } boxSize={ 5 } color="icon.primary" isLoading={ isLoading }/>
      <Skeleton loading={ isLoading }>{ label }</Skeleton>
    </Flex>
  );
};

export default React.memo(BlobDataType);

import { Flex, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import * as blobUtils from 'lib/blob';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

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
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const guessedType = React.useMemo(() => {
    if (isLoading) {
      return;
    }
    return blobUtils.guessDataType(data);
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
      <IconSvg name={ iconName } boxSize={ 5 } color={ iconColor } isLoading={ isLoading }/>
      <Skeleton isLoaded={ !isLoading }>{ label }</Skeleton>
    </Flex>
  );
};

export default React.memo(BlobDataType);

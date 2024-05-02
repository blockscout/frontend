import { Button, Image, Text, useColorModeValue, chakra } from '@chakra-ui/react';
import React from 'react';

import type { AddressMetadataTagFormatted } from 'types/client/addressMetadata';

import { route } from 'nextjs-routes';

import config from 'configs/app';

import LinkExternal from '../LinkExternal';

type Props = {
  data?: AddressMetadataTagFormatted['meta'];
  className?: string;
  txHash?: string;
}

const ActionButton = ({ data, className, txHash }: Props) => {
  const defaultTextColor = useColorModeValue('blue.600', 'blue.300');
  const defaultBg = useColorModeValue('gray.100', 'gray.700');

  if (!data) {
    return null;
  }

  const { appID, textColor, bgColor, text, logoURL } = data;

  const actionURL = data.actionURL?.replace('{chainId}', config.chain.id || '').replace('{txHash}', txHash || '');

  const content = (
    <>
      <Image
        src={ logoURL }
        alt={ `${ text } button` }
        boxSize={ 5 }
        borderRadius="sm"
        mr={ 2 }
      />
      <Text fontSize="sm" fontWeight="500" color="currentColor">
        { text }
      </Text>
    </>
  );

  return appID ? (
    <Button
      className={ className }
      as="a"
      href={ route({ pathname: '/apps/[id]', query: { id: appID, action: 'connect', ...(actionURL ? { url: actionURL } : {}) } }) }
      display="flex"
      size="sm"
      px={ 2 }
      color={ textColor || defaultTextColor }
      bg={ bgColor || defaultBg }
      _hover={{ bg: bgColor, opacity: 0.9 }}
      _active={{ bg: bgColor, opacity: 0.9 }}
    >
      { content }
    </Button>
  ) : (
    <LinkExternal
      className={ className }
      href={ actionURL }
      variant="subtle"
      display="flex"
      px={ 2 }
      color={ textColor }
      bg={ bgColor }
      _hover={{ color: textColor }}
      _active={{ color: textColor }}
    >
      { content }
    </LinkExternal>
  );
};

export default chakra(ActionButton);

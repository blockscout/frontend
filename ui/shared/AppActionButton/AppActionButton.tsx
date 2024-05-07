import { Button, Image, Text, useColorModeValue, chakra } from '@chakra-ui/react';
import React from 'react';

import type { AddressMetadataTagFormatted } from 'types/client/addressMetadata';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import * as mixpanel from 'lib/mixpanel/index';

import LinkExternal from '../LinkExternal';

type Props = {
  data: NonNullable<AddressMetadataTagFormatted['meta']>;
  className?: string;
  txHash?: string;
  source: 'Txn' | 'NFT collection' | 'NFT item';
}

const AppActionButton = ({ data, className, txHash, source }: Props) => {
  const defaultTextColor = useColorModeValue('blue.600', 'blue.300');
  const defaultBg = useColorModeValue('gray.100', 'gray.700');

  const { appID, textColor, bgColor, text, logoURL } = data;

  const actionURL = data.actionURL?.replace('{chainId}', config.chain.id || '').replace('{txHash}', txHash || '');

  const handleClick = React.useCallback(() => {
    const info = appID || actionURL;
    if (info) {
      mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Action button', Info: info, Source: source });
    }
  }, [ source, appID, actionURL ]);

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
      onClick={ handleClick }
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
      onClick={ handleClick }
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

export default chakra(AppActionButton);

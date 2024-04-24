import { Button, Image, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import LinkExternal from './LinkExternal';

type Props = {
  data?: {
    appId?: string;
    actionUrl: string;
    textColor: string;
    bgColor: string;
    text: string;
    logoUrl: string;
  };
}

const mockData = {
  appId: '1',
  actionUrl: 'https://github.com/',
  textColor: '#E2E8F0',
  bgColor: '#9747FF',
  text: 'Mint NFT',
  logoUrl: 'https://i.ibb.co/PGZ0y9r/tg-image-883021928.jpg',
};

const ActionButton = ({ data = mockData }: Props) => {
  const { appId, actionUrl, textColor, bgColor, text, logoUrl } = data;

  const defaultTextColor = useColorModeValue('blue.600', 'blue.300');
  const defaultBg = useColorModeValue('gray.100', 'gray.700');

  const content = (
    <>
      <Image
        src={ logoUrl }
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

  return appId ? (
    <Button
      as="a"
      href={ actionUrl }
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
      href={ actionUrl }
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

export default ActionButton;

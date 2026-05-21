// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text, Center } from '@chakra-ui/react';
import React from 'react';

import { Button } from 'toolkit/chakra/button';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Heading } from 'toolkit/chakra/heading';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';

const ProApi = () => {

  const imageSrc = useColorModeValue('/static/api-docs/pro_api_light.svg', '/static/api-docs/pro_api_dark.svg');

  return (
    <Center py={{ base: 12, lg: '100px' }} flexDirection="column" alignItems="center" textAlign="center">
      <Image src={ imageSrc } alt="Pro API" width={{ base: '100%', lg: '586px' }}/>
      <Heading level="2" mt={{ base: 6, lg: 12 }}>More chain coverage<br/>lower API Costs</Heading>
      <Text mt={ 6 } textStyle={{ base: 'sm', lg: 'md' }}>
        Blockscout's Multichain API delivers unified access to 120+ EVM chains with a single key.<br/>
        Get rich decoded data, scalability and speed at a fraction of the price.
      </Text>
      <Button mt={ 6 } asChild>
        <Link variant="plain" href="https://dev.blockscout.com?utm_source=blockscout&utm_medium=api-docs" external iconColor="inherit">
          Discover PRO API
        </Link>
      </Button>
    </Center>
  );
};

export default React.memo(ProApi);

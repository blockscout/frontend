import { Heading, HStack } from '@chakra-ui/react';
import React from 'react';

import { Button } from 'chakra/components/button';
import { useColorMode } from 'chakra/components/color-mode';
import { Switch } from 'chakra/components/switch';
import PageTitle from 'ui/shared/Page/PageTitle';

const ChakraShowcases = () => {
  const colorMode = useColorMode();

  return (
    <>
      <PageTitle title="Chakra UI Showcase"/>
      <Switch onCheckedChange={ colorMode.toggleColorMode } checked={ colorMode.colorMode === 'dark' } mb={ 4 }>
        Color mode: { colorMode.colorMode }
      </Switch>
      <Heading textStyle="heading.md" mb={ 4 }>Buttons</Heading>
      <HStack gap={ 4 }>
        <Button>Solid</Button>
        <Button visual="outline">Outline</Button>
        <Button visual="anchor">Anchor</Button>
        <Button visual="anchor" selected>Anchor selected</Button>
      </HStack>
    </>
  );
};

export default React.memo(ChakraShowcases);

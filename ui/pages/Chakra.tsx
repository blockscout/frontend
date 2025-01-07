import { Heading, HStack, Link, VStack } from '@chakra-ui/react';
import React from 'react';

import { Button } from 'toolkit/chakra/button';
import { useColorMode } from 'toolkit/chakra/color-mode';
import { Switch } from 'toolkit/chakra/switch';
import PageTitle from 'ui/shared/Page/PageTitle';

const ChakraShowcases = () => {
  const colorMode = useColorMode();

  return (
    <>
      <PageTitle title="Chakra UI Showcase"/>
      <Switch onCheckedChange={ colorMode.toggleColorMode } checked={ colorMode.colorMode === 'dark' } mb={ 4 }>
        Color mode: { colorMode.colorMode }
      </Switch>

      <VStack align="flex-start" gap={ 6 }>
        <section>
          <Heading textStyle="heading.md" mb={ 2 }>Buttons</Heading>
          <HStack gap={ 4 }>
            <Button>Solid</Button>
            <Button visual="outline">Outline</Button>
            <Button visual="dropdown">Dropdown</Button>
            <Button visual="dropdown" selected>Dropdown selected</Button>
          </HStack>
        </section>

        <section>
          <Heading textStyle="heading.md" mb={ 2 }>Links</Heading>
          <HStack gap={ 4 }>
            <Link>Primary</Link>
            <Link visual="secondary">Secondary</Link>
            <Link visual="subtle">Subtle</Link>
          </HStack>
        </section>
      </VStack>
    </>
  );
};

export default React.memo(ChakraShowcases);

import { Heading, HStack } from '@chakra-ui/react';
import React from 'react';

import { Button } from 'chakra/components/button';
import PageTitle from 'ui/shared/Page/PageTitle';

const ChakraShowcases = () => {
  return (
    <>
      <PageTitle title="Chakra UI Showcase"/>
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

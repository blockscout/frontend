import type { FlexProps } from '@chakra-ui/react';
import { Text, Flex } from '@chakra-ui/react';
import React from 'react';

import { Heading } from 'toolkit/chakra/heading';
import { Image } from 'toolkit/chakra/image';

interface Props extends FlexProps {}

const ComingSoon = (props: Props) => {
  return (
    <Flex flexDir="column" alignItems="center" justifyContent="center" my={ 6 } { ...props }>
      <Image
        src="/static/coming-soon.svg"
        alt="Coming soon"
        w={{ base: '160px', lg: '260px' }}
        h="auto"
      />
      <Heading textStyle="heading.md" mt={{ base: 4, lg: 6 }}>Coming soon</Heading>
      <Text textStyle={{ base: 'sm', lg: 'mg' }} mt={ 2 }>The information will be available soon. Stay tuned!</Text>
    </Flex>
  );
};

export default React.memo(ComingSoon);

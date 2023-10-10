import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import UI from 'configs/app/ui';

const DevForumHero = () => {
  return (
    <Flex
      borderRadius={ 16 }
      paddingX={ 6 }
      paddingY={ 4 }
      mb={ 10 }
      background={ UI.homepage.plate.background }
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex grow={ 1 } alignItems="center" justify="space-between">
        <Text color={ UI.homepage.plate.textColor } as="span" lineHeight={ 1.25 } fontSize={ 32 }>
&nbsp;
        </Text>
      </Flex>
    </Flex>
  );
};

export default DevForumHero;

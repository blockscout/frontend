import { Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

type Props = {
  icon: React.FC<React.SVGAttributes<SVGElement>>;
  title: string;
  value: string;
}

const StatsItem = ({ icon, title, value }: Props) => {
  return (
    <Flex
      backgroundColor={ useColorModeValue('blue.50', 'blue.800') }
      padding={ 3 }
      borderRadius="md"
      flexDirection={{ base: 'row', lg: 'column', xl: 'row' }}
      alignItems="center"
      columnGap={ 3 }
      rowGap={ 2 }
    >
      <Icon as={ icon } boxSize={ 7 }/>
      <Flex flexDirection="column" alignItems={{ base: 'start', lg: 'center', xl: 'start' }}>
        <Text variant="secondary" fontSize="xs" lineHeight="16px">{ title }</Text>
        <Text fontWeight={ 500 } fontSize="md">{ value }</Text>
      </Flex>
    </Flex>
  );
};

export default StatsItem;

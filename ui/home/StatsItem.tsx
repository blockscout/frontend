import { Flex, Icon, Text, useColorModeValue, chakra } from '@chakra-ui/react';
import React from 'react';

type Props = {
  icon: React.FC<React.SVGAttributes<SVGElement>>;
  title: string;
  value: string;
  className?: string;
}

const StatsItem = ({ icon, title, value, className }: Props) => {
  return (
    <Flex
      backgroundColor={ useColorModeValue('blue.50', 'blue.800') }
      padding={ 3 }
      borderRadius="md"
      flexDirection={{ base: 'row', lg: 'column', xl: 'row' }}
      alignItems="center"
      columnGap={ 3 }
      rowGap={ 2 }
      className={ className }
      color={ useColorModeValue('black', 'white') }
    >
      <Icon as={ icon } boxSize={ 7 }/>
      <Flex flexDirection="column" alignItems={{ base: 'start', lg: 'center', xl: 'start' }}>
        <Text variant="secondary" fontSize="xs" lineHeight="16px">{ title }</Text>
        <Text fontWeight={ 500 } fontSize="md" color={ useColorModeValue('black', 'white') }>{ value }</Text>
      </Flex>
    </Flex>
  );
};

export default chakra(StatsItem);

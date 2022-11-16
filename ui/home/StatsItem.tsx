import { Flex, Icon, Center, Text, LightMode } from '@chakra-ui/react';
import React from 'react';

type Props = {
  icon: React.FC<React.SVGAttributes<SVGElement>>;
  title: string;
  value: string;
}

const StatsItem = ({ icon, title, value }: Props) => {
  return (
    <LightMode>
      <Flex
        backgroundColor="blue.50"
        padding={ 5 }
        borderRadius="16px"
        flexDirection={{ base: 'row', lg: 'column', xl: 'row' }}
        alignItems="center"
      >
        <Center
          backgroundColor="green.100"
          borderRadius="12px"
          w={ 10 }
          h={ 10 }
          mr={{ base: 4, lg: 0, xl: 4 }}
          mb={{ base: 0, lg: 2, xl: 0 }}
        >
          <Icon as={ icon } boxSize={ 7 } color="black"/>
        </Center>
        <Flex flexDirection="column" alignItems={{ base: 'start', lg: 'center', xl: 'start' }}>
          <Text variant="secondary" fontSize="xs" lineHeight="16px">{ title }</Text>
          <Text fontWeight={ 500 } fontSize="md">{ value }</Text>
        </Flex>
      </Flex>
    </LightMode>
  );
};

export default StatsItem;

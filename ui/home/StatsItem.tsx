import { Box, Flex, Icon, Center, Text, LightMode } from '@chakra-ui/react';
import React from 'react';

type Props = {
  icon: React.FC<React.SVGAttributes<SVGElement>>;
  title: string;
  value: string;
}

const StatsItem = ({ icon, title, value }: Props) => {
  return (
    <LightMode>
      <Flex background="blue.50" padding={ 5 } borderRadius="16px">
        <Center backgroundColor="green.100" borderRadius="12px" w={ 10 } h={ 10 } marginRight={ 4 }>
          <Icon as={ icon } boxSize={ 7 } color="black"/>
        </Center>
        <Box>
          <Text variant="secondary" fontSize="xs" lineHeight="16px">{ title }</Text>
          <Text fontWeight={ 500 } fontSize="md">{ value }</Text>
        </Box>
      </Flex>
    </LightMode>
  );
};

export default StatsItem;

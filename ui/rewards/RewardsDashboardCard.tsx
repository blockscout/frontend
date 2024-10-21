import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import AvailableSoonLabel from './AvailableSoonLabel';

type Props = {
  title?: string;
  description: string | React.ReactNode;
  availableSoon?: boolean;
  contentAfter?: React.ReactNode;
  direction?: 'column' | 'column-reverse' | 'row';
  reverse?: boolean;
  children?: React.ReactNode;
};

const RewardsDashboardCard = ({ title, description, availableSoon, contentAfter, direction = 'column', children }: Props) => {
  return (
    <Flex
      flexDirection={ direction }
      justifyContent={ direction === 'column-reverse' ? 'flex-end' : 'flex-start' }
      p={ 2 }
      border="1px solid"
      borderColor={ useColorModeValue('gray.200', 'whiteAlpha.200') }
      borderRadius="lg"
      gap={ direction === 'row' ? 10 : 1 }
      w={ direction === 'row' ? 'full' : 'auto' }
    >
      <Flex flexDirection="column" gap={ 2 } p={ 3 } w={ direction === 'row' ? '340px' : 'full' }>
        { title && (
          <Flex alignItems="center" gap={ 2 }>
            <Text fontSize="lg" fontWeight="500">{ title }</Text>
            { availableSoon && <AvailableSoonLabel/> }
          </Flex>
        ) }
        <Text fontSize="sm">
          { description }
        </Text>
        { contentAfter }
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="space-around"
        borderRadius="8px"
        backgroundColor={ useColorModeValue('gray.50', 'whiteAlpha.50') }
        h="128px"
        filter="auto"
        blur={ availableSoon ? '4px' : '0' }
        flex={ direction === 'row' ? 1 : '0 1 auto' }
      >
        { children }
      </Flex>
    </Flex>
  );
};

export default RewardsDashboardCard;

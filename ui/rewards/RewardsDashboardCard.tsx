import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

import AvailableSoonLabel from './AvailableSoonLabel';

type Value = {
  label: string;
  value: number;
  type?: 'percentages';
}

type Props = {
  title?: string;
  description: string;
  values: Array<Value>;
  availableSoon?: boolean;
  contentAfter?: React.ReactNode;
};

const RewardsDashboardCard = ({ title, description, values, availableSoon, contentAfter }: Props) => {
  return (
    <Flex
      flexDirection="column"
      p={ 2 }
      border="1px solid"
      borderColor={ useColorModeValue('gray.200', 'whiteAlpha.200') }
      borderRadius="lg"
      gap={ 1 }
    >
      <Flex
        alignItems="center"
        justifyContent="space-around"
        borderRadius="8px"
        backgroundColor={ useColorModeValue('gray.50', 'whiteAlpha.50') }
        h="128px"
        filter="auto"
        blur={ availableSoon ? '4px' : '0' }
      >
        { values.map(({ label, value, type }) => (
          <Flex key={ label } flexDirection="column" alignItems="center" gap={ 2 }>
            <Flex alignItems="center" gap={ 1 }>
              <IconSvg name="info" boxSize={ 5 } color="gray.500"/>
              <Text fontSize="xs" fontWeight="500" variant="secondary">
                { label }
              </Text>
            </Flex>
            <Flex alignItems="center">
              { !type && <IconSvg name="merits_colored" boxSize={ 12 }/> }
              <Text fontSize="32px" fontWeight="500">
                { type === 'percentages' ? `${ value }%` : value }
              </Text>
            </Flex>
          </Flex>
        )) }
      </Flex>
      <Flex flexDirection="column" gap={ 2 } p={ 3 }>
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
    </Flex>
  );
};

export default RewardsDashboardCard;

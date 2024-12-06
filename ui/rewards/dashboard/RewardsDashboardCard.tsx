import { Flex, Text, useColorModeValue, Tag } from '@chakra-ui/react';
import React from 'react';

type Props = {
  title?: string;
  description: string | React.ReactNode;
  availableSoon?: boolean;
  blurFilter?: boolean;
  contentAfter?: React.ReactNode;
  direction?: 'column' | 'column-reverse' | 'row';
  reverse?: boolean;
  children?: React.ReactNode;
};

const RewardsDashboardCard = ({
  title, description, availableSoon, contentAfter,
  direction = 'column', children, blurFilter,
}: Props) => {
  return (
    <Flex
      flexDirection={{ base: direction === 'row' ? 'column' : direction, md: direction }}
      justifyContent={ direction === 'column-reverse' ? 'flex-end' : 'flex-start' }
      p={{ base: 1.5, md: 2 }}
      border="1px solid"
      borderColor={ useColorModeValue('gray.200', 'whiteAlpha.200') }
      borderRadius="lg"
      gap={{ base: 1, md: direction === 'row' ? 10 : 1 }}
      w={ direction === 'row' ? 'full' : 'auto' }
      flex={ direction !== 'row' ? 1 : '0 1 auto' }
    >
      <Flex
        flexDirection="column"
        gap={ 2 }
        p={{ base: 1.5, md: 3 }}
        w={{ base: 'full', md: direction === 'row' ? '340px' : 'full' }}
      >
        { title && (
          <Flex alignItems="center" gap={ 2 }>
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="500">{ title }</Text>
            { availableSoon && <Tag colorScheme="blue">Available soon</Tag> }
          </Flex>
        ) }
        <Text as="div" fontSize="sm">
          { description }
        </Text>
        { contentAfter }
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="space-around"
        borderRadius={{ base: 'lg', md: '8px' }}
        backgroundColor={ useColorModeValue('gray.50', 'whiteAlpha.50') }
        h={{ base: '80px', md: direction === 'row' ? 'auto' : '128px' }}
        filter="auto"
        blur={ blurFilter ? '4px' : '0' }
        flex={ direction === 'row' ? 1 : '0 1 auto' }
      >
        { children }
      </Flex>
    </Flex>
  );
};

export default RewardsDashboardCard;

import { Flex, Text, chakra } from '@chakra-ui/react';
import type { ChakraStyledOptions } from '@chakra-ui/react';
import React from 'react';

import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import Hint from 'ui/shared/Hint';

type Props = {
  title: string;
  description: string | React.ReactNode;
  hint?: string | React.ReactNode;
  availableSoon?: boolean;
  blurFilter?: boolean;
  contentAfter?: React.ReactNode;
  direction?: 'column' | 'column-reverse' | 'row';
  reverse?: boolean;
  children?: React.ReactNode;
  label?: string;
  isLoading?: boolean;
  cardValueStyle?: ChakraStyledOptions;
  className?: string;
};

const RewardsDashboardCard = ({
  title, description, availableSoon, contentAfter, cardValueStyle, hint,
  direction = 'column', children, blurFilter, label, isLoading, className,
}: Props) => {
  return (
    <Flex
      flexDirection={{ base: direction === 'row' ? 'column' : direction, md: direction }}
      justifyContent={ direction === 'column-reverse' ? 'flex-end' : 'flex-start' }
      p={{ base: 1.5, md: 2 }}
      border="1px solid"
      borderColor={{ _light: 'gray.200', _dark: 'whiteAlpha.200' }}
      borderRadius="lg"
      gap={{ base: 1, md: direction === 'row' ? 10 : 1 }}
      w={ direction === 'row' ? 'full' : 'auto' }
      flex={ direction !== 'row' ? 1 : '0 1 auto' }
      className={ className }
    >
      <Flex
        flexDirection="column"
        gap={ 2 }
        p={{ base: 1.5, md: 3 }}
        w={{ base: 'full', md: direction === 'row' ? '340px' : 'full' }}
      >
        { label && (
          <Skeleton loading={ isLoading } w="fit-content">
            <Badge>{ label }</Badge>
          </Skeleton>
        ) }
        { title && (
          <Flex alignItems="center" gap={ 2 }>
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="500">{ title }</Text>
            { hint && <Hint label={ hint }/> }
            { availableSoon && <Badge colorPalette="blue">Available soon</Badge> }
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
        backgroundColor={{ _light: 'gray.50', _dark: 'whiteAlpha.50' }}
        minH={{ base: '80px', md: '128px' }}
        mt={ direction === 'column' ? 'auto' : 0 }
        filter="auto"
        blur={ blurFilter ? '4px' : '0' }
        flex={ direction === 'row' ? 1 : '0 1 auto' }
        { ...cardValueStyle }
      >
        { children }
      </Flex>
    </Flex>
  );
};

export default chakra(RewardsDashboardCard);

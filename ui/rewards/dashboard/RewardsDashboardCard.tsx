import { Flex, Text, useColorModeValue, Tag, chakra } from '@chakra-ui/react';
import type { ChakraStyledOptions } from '@chakra-ui/react';
import React from 'react';

import Skeleton from 'ui/shared/chakra/Skeleton';
import HintPopover from 'ui/shared/HintPopover';

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
      borderColor={ useColorModeValue('gray.200', 'whiteAlpha.200') }
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
          <Skeleton isLoaded={ !isLoading } w="fit-content">
            <Tag>{ label }</Tag>
          </Skeleton>
        ) }
        { title && (
          <Flex alignItems="center" gap={ 2 }>
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="500">{ title }</Text>
            { hint && (
              <HintPopover
                label={ hint }
                popoverContentProps={{
                  maxW: { base: 'calc(100vw - 8px)', lg: '210px' },
                }}
                popoverBodyProps={{ textAlign: 'center' }}
              />
            ) }
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

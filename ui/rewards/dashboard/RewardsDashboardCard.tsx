import { Flex, Text, chakra } from '@chakra-ui/react';
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
  reverse?: boolean;
  children?: React.ReactNode;
  label?: string;
  isLoading?: boolean;
  cardValueStyle?: object;
  className?: string;
};

const RewardsDashboardCard = ({
  title, description, availableSoon, contentAfter, cardValueStyle, hint,
  children, blurFilter, label, isLoading, className,
}: Props) => {
  return (
    <Flex
      flexDirection="column"
      justifyContent="flex-start"
      p={{ base: 1.5, md: 2 }}
      border="1px solid"
      borderColor={{ _light: 'gray.200', _dark: 'whiteAlpha.200' }}
      borderRadius="lg"
      gap={ 1 }
      flex={ 1 }
      className={ className }
    >
      <Flex
        flexDirection="column"
        gap={ 2 }
        p={{ base: 1.5, md: 3 }}
        w="full"
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
        mt="auto"
        filter="auto"
        blur={ blurFilter ? '4px' : '0' }
        flex="0 1 auto"
        { ...cardValueStyle }
      >
        { children }
      </Flex>
    </Flex>
  );
};

export default chakra(RewardsDashboardCard);

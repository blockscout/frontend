import { Box, Flex, Text, Skeleton, useColorModeValue, chakra } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { Route } from 'nextjs-routes';

import Hint from 'ui/shared/Hint';
import TruncatedValue from 'ui/shared/TruncatedValue';

type Props = {
  label: string;
  value: string;
  valuePrefix?: string;
  valuePostfix?: string;
  hint?: string;
  isLoading?: boolean;
  diff?: string | number;
  diffFormatted?: string;
  diffPeriod?: '24h';
  period?: '1h' | '24h';
  href?: Route;
}

const Container = ({ href, children }: { href?: Route; children: JSX.Element }) => {
  if (href) {
    return (
      <NextLink href={ href } passHref legacyBehavior>
        { children }
      </NextLink>
    );
  }

  return children;
};

const StatsWidget = ({ label, value, valuePrefix, valuePostfix, isLoading, hint, diff, diffPeriod = '24h', diffFormatted, period, href }: Props) => {
  const bgColor = useColorModeValue('blue.50', 'whiteAlpha.100');
  const skeletonBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const hintColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Container href={ !isLoading ? href : undefined }>
      <Flex
        alignItems="flex-start"
        bgColor={ isLoading ? skeletonBgColor : bgColor }
        px={ 3 }
        py={{ base: 2, lg: 3 }}
        borderRadius="md"
        justifyContent="space-between"
        columnGap={ 3 }
        { ...(href && !isLoading ? {
          as: 'a',
          href,
        } : {}) }
      >
        <Box w="100%">
          <Skeleton
            isLoaded={ !isLoading }
            color="text_secondary"
            fontSize="xs"
            w="fit-content"
          >
            <span>{ label }</span>
          </Skeleton>
          <Skeleton
            isLoaded={ !isLoading }
            display="flex"
            alignItems="baseline"
            mt={ 1 }
          >
            { valuePrefix && <chakra.span fontWeight={ 500 } fontSize="lg" lineHeight={ 6 } whiteSpace="pre">{ valuePrefix }</chakra.span> }
            <TruncatedValue isLoading={ isLoading } fontWeight={ 500 } fontSize="lg" lineHeight={ 6 } value={ value }/>
            { valuePostfix && <chakra.span fontWeight={ 500 } fontSize="lg" lineHeight={ 6 } whiteSpace="pre">{ valuePostfix }</chakra.span> }
            { diff && Number(diff) > 0 && (
              <>
                <Text fontWeight={ 500 } ml={ 2 } mr={ 1 } fontSize="lg" lineHeight={ 6 } color="green.500">
                  +{ diffFormatted || Number(diff).toLocaleString() }
                </Text>
                <Text variant="secondary" fontSize="sm">({ diffPeriod })</Text>
              </>
            ) }
            { period && <Text variant="secondary" fontSize="xs" ml={ 1 }>({ period })</Text> }
          </Skeleton>
        </Box>
        { hint && (
          <Skeleton isLoaded={ !isLoading } alignSelf="center" borderRadius="base">
            <Hint label={ hint } boxSize={ 6 } color={ hintColor }/>
          </Skeleton>
        ) }
      </Flex>
    </Container>
  );
};

export default StatsWidget;

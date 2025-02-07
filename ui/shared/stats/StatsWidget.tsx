import { Box, Flex, Text, chakra } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { Route } from 'nextjs-routes';

import Skeleton from 'ui/shared/chakra/Skeleton';
import Hint from 'ui/shared/Hint';
import IconSvg, { type IconName } from 'ui/shared/IconSvg';
import TruncatedValue from 'ui/shared/TruncatedValue';

export type Props = {
  className?: string;
  label: string;
  value: string | React.ReactNode;
  valuePrefix?: string;
  valuePostfix?: string;
  hint?: string | React.ReactNode;
  isLoading?: boolean;
  diff?: string | number;
  diffFormatted?: string;
  diffPeriod?: '24h';
  period?: '1h' | '24h';
  href?: Route;
  icon?: IconName;
};

const Container = ({ href, children }: { href?: Route; children: React.JSX.Element }) => {
  if (href) {
    return (
      <NextLink href={ href } passHref legacyBehavior>
        { children }
      </NextLink>
    );
  }

  return children;
};

const StatsWidget = ({
  className,
  icon,
  label,
  value,
  valuePrefix,
  valuePostfix,
  isLoading,
  hint,
  diff,
  diffPeriod = '24h',
  diffFormatted,
  period,
  href,
}: Props) => {
  const bgColor = 'grey.10';
  const skeletonBgColor = 'blackAlpha.50';
  const hintColor = 'white';

  return (
    <Container href={ !isLoading ? href : undefined }>
      <Flex
        className={ className }
        alignItems="center"
        bgColor={ isLoading ? skeletonBgColor : bgColor }
        border="1px solid transparent"
        backdropFilter="blur(30px)"
        p={ 3 }
        _hover={ href ? { bg: 'grey.20', border: '1px solid rgba(255, 255, 255, 0.3)' } : undefined }
        borderRadius="12px"
        justifyContent="space-between"
        columnGap={ 2 }
        { ...(href && !isLoading ? {
          as: 'a',
          href,
        } : {}) }
      >
        { icon && (
          <Box w={{ base: '36px', lg: '36px' }} borderRadius="10px" bg="black" p="6px">
            <IconSvg
              name={ icon }
              boxSize="24px"
              isLoading={ isLoading }
              borderRadius="base"
              color="rgba(255, 255, 255, 0.5)"
              display={{ base: 'none', lg: 'block' }}
              flexShrink={ 0 }
            />
          </Box>
        ) }
        <Box w={{ base: '100%', lg: icon ? 'calc(100% - 48px)' : '100%' }}>
          <Skeleton
            isLoaded={ !isLoading }
            color="text_secondary"
            fontSize="xs"
            mb={ 1 }
            lineHeight="16px"
            w="fit-content"
          >
            <h2>{ label }</h2>
          </Skeleton>
          <Skeleton
            isLoaded={ !isLoading }
            display="flex"
            alignItems="baseline"
            fontWeight={ 500 }
            fontSize="lg"
            lineHeight={ 6 }
          >
            { valuePrefix && <chakra.span whiteSpace="pre">{ valuePrefix }</chakra.span> }
            { typeof value === 'string' ? (
              <TruncatedValue isLoading={ isLoading } value={ value }/>
            ) : (
              value
            ) }
            { valuePostfix && <chakra.span whiteSpace="pre">{ valuePostfix }</chakra.span> }
            { diff && Number(diff) > 0 && (
              <>
                <Text ml={ 2 } mr={ 1 } color="green.500">
                  +{ diffFormatted || Number(diff).toLocaleString() }
                </Text>
                <Text variant="secondary" fontSize="sm">({ diffPeriod })</Text>
              </>
            ) }
            { period && <Text variant="secondary" fontSize="xs" fontWeight={ 400 } ml={ 1 }>({ period })</Text> }
          </Skeleton>
        </Box>
        { typeof hint === 'string' ? (
          <Skeleton isLoaded={ !isLoading } alignSelf="center" borderRadius="base">
            <Hint label={ hint } boxSize={ 6 } color={ hintColor }/>
          </Skeleton>
        ) : hint }
      </Flex>
    </Container>
  );
};

export default chakra(StatsWidget);

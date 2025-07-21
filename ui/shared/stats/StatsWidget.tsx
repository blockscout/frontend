import { Box, Flex, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import type { Route } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Hint } from 'toolkit/components/Hint/Hint';
import IconSvg, { type IconName } from 'ui/shared/IconSvg';
import TruncatedValue from 'ui/shared/TruncatedValue';

import { KDATokens } from '../../../toolkit/theme/theme';

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
  period?: '1h' | '24h' | '30min';
  href?: Route;
  icon?: IconName;
};

const Container = ({ href, children, className }: { href?: Route; children: React.JSX.Element; className?: string }) => {
  if (href) {
    return (
      <Link href={ route(href) } variant="plain" className={ className }>
        { children }
      </Link>
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
  return (
    <Container href={ !isLoading ? href : undefined } className={ href ? className : undefined }>
      <Flex
        className={ href ? undefined : className }
        alignItems="center"
        bgColor={ isLoading ? {
          _light: 'blackAlpha.50',
          _dark: 'whiteAlpha.50',
        } : {
          _light: KDATokens.light.kda.explorer.widget.stats.background.default,
          _dark: KDATokens.dark.kda.explorer.widget.stats.background.default,
        } }
        p={ 3 }
        borderRadius="base"
        justifyContent="space-between"
        columnGap={ 2 }
        w="100%"
        h="100%"
      >
        { icon && (
          <IconSvg
            name={ icon }
            p={ 2 }
            boxSize="40px"
            isLoading={ isLoading }
            borderRadius="base"
            display={{ base: 'none', lg: 'block' }}
            color="var(--kda-explorer-widget-stats-surface-icon-color)"
            flexShrink={ 0 }
          />
        ) }
        <Box w={{ base: '100%', lg: icon ? 'calc(100% - 48px)' : '100%' }}>
          <Skeleton
            loading={ isLoading }
            color="var(--kda-explorer-widget-stats-surface-text-subtle)"
            textStyle="xs"
            w="fit-content"
          >
            <h2>{ label }</h2>
          </Skeleton>
          <Skeleton
            loading={ isLoading }
            display="flex"
            alignItems="baseline"
            textStyle="heading.md"
            color="var(--kda-explorer-widget-stats-surface-text)"
            fontFamily="var(--kda-typography-family-monospace-font)"
            fontWeight={ 600 }
          >
            { valuePrefix && <chakra.span whiteSpace="pre">{ valuePrefix }</chakra.span> }
            { typeof value === 'string' ? (
              <TruncatedValue color="var(--kda-explorer-widget-stats-surface-text)" isLoading={ isLoading } value={ value }/>
            ) : (
              value
            ) }
            { valuePostfix && <chakra.span whiteSpace="pre">{ valuePostfix }</chakra.span> }
            { diff && Number(diff) > 0 && (
              <>
                <Text ml={ 2 } mr={ 1 } color="var(--kda-explorer-widget-stats-surface-text)">
                  +{ diffFormatted || Number(diff).toLocaleString() }
                </Text>
                <Text color="var(--kda-explorer-widget-stats-surface-text-subtle)" textStyle="sm">({ diffPeriod })</Text>
              </>
            ) }
            { period && <Text color="var(--kda-explorer-widget-stats-surface-text-subtle)" textStyle="xs" fontWeight={ 400 } ml={ 1 }>({ period })</Text> }
          </Skeleton>
        </Box>
        { typeof hint === 'string' ? (
          <Skeleton loading={ isLoading } alignSelf="center" borderRadius="base">
            <Hint label={ hint } boxSize={ 6 } color="var(--kda-explorer-widget-stats-surface-text-subtle)"/>
          </Skeleton>
        ) : hint }
      </Flex>
    </Container>
  );
};

export default chakra(StatsWidget);

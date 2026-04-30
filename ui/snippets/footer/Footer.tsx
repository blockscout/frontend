import type { GridProps, HTMLChakraProps } from '@chakra-ui/react';
import { Box, Grid, Flex, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import useFetch from 'lib/hooks/useFetch';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import IconSvg from 'ui/shared/IconSvg';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';

import FooterLinkItem from './FooterLinkItem';
import IntTxsIndexingStatus from './IntTxsIndexingStatus';

// The upstream Blockscout release this fork is based on.
const BLOCKSCOUT_UPSTREAM_VERSION = 'v5.3.1';
const BLOCKSCOUT_UPSTREAM_URL = `https://github.com/blockscout/blockscout/tree/${ BLOCKSCOUT_UPSTREAM_VERSION }`;

const MAX_LINKS_COLUMNS = 4;

const Footer = () => {

  const { data: backendVersionData } = useApiQuery('general:config_backend_version', {
    queryOptions: {
      staleTime: Infinity,
      enabled: !config.features.opSuperchain.isEnabled,
    },
  });
  const BLOCKSCOUT_LINKS = [
    {
      icon: 'social/git' as const,
      iconSize: '18px',
      text: 'GitHub',
      url: 'https://github.com/VinuChain',
    },
    {
      icon: 'social/twitter' as const,
      iconSize: '18px',
      text: 'X (ex-Twitter)',
      url: 'https://twitter.com/vinuchain',
    },
    {
      icon: 'social/discord' as const,
      iconSize: '24px',
      text: 'Discord',
      url: 'https://discord.gg/vinu',
    },
    {
      icon: 'social/telegram_filled' as const,
      iconSize: '18px',
      text: 'Telegram',
      url: 'https://t.me/vitainu',
    },
    {
      icon: 'social/medium_filled' as const,
      iconSize: '20px',
      text: 'Medium',
      url: 'https://medium.com/vinuchain',
    },
  ];

  const frontendSha = config.UI.footer.frontendCommit || null;
  const backendSha = backendVersionData?.backend_version || null;

  const fetch = useFetch();

  const { isPlaceholderData, data: linksData } = useQuery<unknown, ResourceError<unknown>, Array<CustomLinksGroup>>({
    queryKey: [ 'footer-links' ],
    queryFn: async() => fetch(config.UI.footer.links || '', undefined, { resource: 'footer-links' }),
    enabled: Boolean(config.UI.footer.links),
    staleTime: Infinity,
    placeholderData: [],
  });

  const colNum = isPlaceholderData ? 1 : Math.min(linksData?.length || Infinity, MAX_LINKS_COLUMNS) + 1;

  const renderNetworkInfo = React.useCallback((gridArea?: GridProps['gridArea']) => {
    return (
      <Flex
        alignItems="center"
        gridArea={ gridArea }
        flexWrap="wrap"
        justifyContent="flex-start"
        columnGap={ 3 }
        rowGap={ 2 }
        mb={{ base: 5, lg: 10 }}
        _empty={{ display: 'none' }}
      >
        { !config.UI.indexingAlert.intTxs.isHidden && <IntTxsIndexingStatus/> }
        { !config.features.opSuperchain.isEnabled && <NetworkAddToWallet source="Footer"/> }
      </Flex>
    );
  }, []);

  const renderProjectInfo = React.useCallback((gridArea?: GridProps['gridArea']) => {
    const logoColor = { base: 'blue.600', _dark: 'white' };

    return (
      <Box gridArea={ gridArea }>
        <Flex columnGap={ 2 } textStyle="xs" alignItems="center">
          <span>Made with</span>
          <Link href="https://www.blockscout.com" external noIcon display="inline-flex" color={ logoColor } _hover={{ color: logoColor }}>
            <IconSvg
              name="networks/logo-placeholder"
              width="80px"
              height={ 4 }
            />
          </Link>
        </Flex>
        <Text mt={ 3 } fontSize="xs">
          VinuExplorer is the official scanner for VinuChain, the world’s first determinably feeless, EVM L1.
        </Text>
        <Box mt={ 6 } alignItems="start" textStyle="xs">
          <Text>
            Blockscout: <Link href={ BLOCKSCOUT_UPSTREAM_URL } external noIcon>{ BLOCKSCOUT_UPSTREAM_VERSION }</Link>
          </Text>
          { frontendSha && (
            <Text>
              Frontend: { frontendSha }
            </Text>
          ) }
          { backendSha && (
            <Text>
              Backend: { backendSha }
            </Text>
          ) }
        </Box>
      </Box>
    );
  }, [ backendSha, frontendSha ]);

  const containerProps: HTMLChakraProps<'div'> = {
    as: 'footer',
    borderTopWidth: '1px',
    borderTopColor: 'border.divider',
  };

  const contentProps: GridProps = {
    px: { base: 4, lg: config.UI.navigation.layout === 'horizontal' ? 6 : 12, '2xl': 6 },
    py: { base: 4, lg: 8 },
    gridTemplateColumns: { base: '1fr', lg: 'minmax(auto, 470px) 1fr' },
    columnGap: { lg: '32px', xl: '100px' },
    maxW: `${ CONTENT_MAX_WIDTH }px`,
    m: '0 auto',
  };

  const renderRecaptcha = (gridArea?: GridProps['gridArea']) => {
    if (!config.services.reCaptchaV2.siteKey) {
      return <Box gridArea={ gridArea }/>;
    }

    return (
      <Box gridArea={ gridArea } textStyle="xs" mt={ 6 }>
        <span>This site is protected by reCAPTCHA and the Google </span>
        <Link href="https://policies.google.com/privacy" external noIcon>Privacy Policy</Link>
        <span> and </span>
        <Link href="https://policies.google.com/terms" external noIcon>Terms of Service</Link>
        <span> apply.</span>
      </Box>
    );
  };

  if (config.UI.footer.links) {
    return (
      <Box { ...containerProps }>
        <Grid { ...contentProps }>
          <div>
            { renderNetworkInfo() }
            { renderProjectInfo() }
            { renderRecaptcha() }
          </div>

          <Grid
            gap={{ base: 6, lg: colNum === MAX_LINKS_COLUMNS + 1 ? 2 : 8, xl: 12 }}
            gridTemplateColumns={{
              base: 'repeat(auto-fill, 160px)',
              lg: `repeat(${ colNum }, 135px)`,
              xl: `repeat(${ colNum }, 160px)`,
            }}
            justifyContent={{ lg: 'flex-end' }}
            mt={{ base: 8, lg: 0 }}
          >
            {
              ([
                { title: 'Blockscout', links: BLOCKSCOUT_LINKS },
                ...(linksData || []),
              ])
                .slice(0, colNum)
                .map(linkGroup => (
                  <Box key={ linkGroup.title }>
                    <Skeleton fontWeight={ 500 } mb={ 3 } display="inline-block" loading={ isPlaceholderData }>{ linkGroup.title }</Skeleton>
                    <VStack gap={ 1 } alignItems="start">
                      { linkGroup.links.map(link => <FooterLinkItem { ...link } key={ link.text } isLoading={ isPlaceholderData }/>) }
                    </VStack>
                  </Box>
                ))
            }
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box { ...containerProps }>
      <Grid
        { ...contentProps }
        gridTemplateAreas={{
          lg: `
          "network links-top"
          "info links-bottom"
          "recaptcha links-bottom"
        `,
        }}
      >

        { renderNetworkInfo({ lg: 'network' }) }
        { renderProjectInfo({ lg: 'info' }) }
        { renderRecaptcha({ lg: 'recaptcha' }) }

        <Grid
          gridArea={{ lg: 'links-bottom' }}
          gap={ 1 }
          gridTemplateColumns={{
            base: 'repeat(auto-fill, 160px)',
            lg: 'repeat(2, 160px)',
            xl: 'repeat(3, 160px)',
          }}
          gridTemplateRows={{
            base: 'auto',
            lg: 'repeat(3, auto)',
            xl: 'repeat(2, auto)',
          }}
          gridAutoFlow={{ base: 'row', lg: 'column' }}
          alignContent="start"
          justifyContent={{ lg: 'flex-end' }}
          mt={{ base: 8, lg: 0 }}
        >
          { BLOCKSCOUT_LINKS.map(link => <FooterLinkItem { ...link } key={ link.text }/>) }
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(Footer);

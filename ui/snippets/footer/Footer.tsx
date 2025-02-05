import type { GridProps, HTMLChakraProps } from '@chakra-ui/react';
import {
  Box,
  Grid,
  Flex,
  Text,
  Link,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useFetch from 'lib/hooks/useFetch';
import { copy } from 'lib/html-entities';
import Skeleton from 'ui/shared/chakra/Skeleton';
import IconSvg from 'ui/shared/IconSvg';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';

import FooterLinkItem from './FooterLinkItem';
import IntTxsIndexingStatus from './IntTxsIndexingStatus';

const MAX_LINKS_COLUMNS = 4;

const Footer = () => {
  const logoColor = useColorModeValue('blue.600', 'white');

  const BLOCKSCOUT_LINKS = [
    {
      icon: 'social/twitter' as const,
      iconSize: '18px',
      text: 'X (ex-Twitter)',
      url: 'https://www.twitter.com/blockscoutcom',
    },
    {
      icon: 'donate' as const,
      iconSize: '20px',
      text: 'Donate',
      url: 'https://github.com/sponsors/blockscout',
    },
  ];

  const fetch = useFetch();

  const { isPlaceholderData, data: linksData } = useQuery<
    unknown,
    ResourceError<unknown>,
    Array<CustomLinksGroup>
  >({
    queryKey: [ 'footer-links' ],
    queryFn: async() =>
      fetch(config.UI.footer.links || '', undefined, {
        resource: 'footer-links',
      }),
    enabled: Boolean(config.UI.footer.links),
    staleTime: Infinity,
    placeholderData: [],
  });

  const colNum = isPlaceholderData ?
    1 :
    Math.min(linksData?.length || Infinity, MAX_LINKS_COLUMNS) + 1;

  const renderNetworkInfo = React.useCallback(
    (gridArea?: GridProps['gridArea']) => {
      return (
        <Flex
          gridArea={ gridArea }
          flexWrap="wrap"
          columnGap={ 8 }
          rowGap={ 6 }
          mb={{ base: 5, lg: 10 }}
          _empty={{ display: 'none' }}
        >
          { !config.UI.indexingAlert.intTxs.isHidden && <IntTxsIndexingStatus/> }
          <NetworkAddToWallet/>
        </Flex>
      );
    },
    [],
  );

  const renderProjectInfo = React.useCallback(
    (gridArea?: GridProps['gridArea']) => {
      return (
        <Box gridArea={ gridArea }>
          <Flex
            columnGap={ 2 }
            fontSize="xs"
            lineHeight={ 5 }
            alignItems="center"
            color="text"
          >
            <span>Made with</span>
            <Link
              href="https://www.blockscout.com"
              isExternal
              display="inline-flex"
              color={ logoColor }
              _hover={{ color: logoColor }}
            >
              <IconSvg
                name="networks/logo-placeholder"
                width="80px"
                height={ 4 }
              />
            </Link>
          </Flex>
          <Text mt={ 3 } fontSize="xs">
            Asset Chain Advanced Explorer is a Block Explorer and Analytics
            Platform for Asset Chain.
          </Text>
          <Box mt="16" alignItems="start" fontSize="xs" lineHeight={ 5 }>
            <Text>
              Site URL:{ ' ' }
              <Link href={ config.api.host } target="_blank">
                { config.api.host }
              </Link>
            </Text>
            <Text>
              Copyright { copy } 2023-{ new Date().getFullYear() }
            </Text>
          </Box>
        </Box>
      );
    },
    [ logoColor ],
  );

  const containerProps: HTMLChakraProps<'div'> = {
    as: 'footer',
    borderTopWidth: '1px',
    borderTopColor: 'solid',
  };

  const contentProps: GridProps = {
    px: {
      base: 4,
      lg: config.UI.navigation.layout === 'horizontal' ? 6 : 12,
      '2xl': 6,
    },
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
      <Box gridArea={ gridArea } fontSize="xs" lineHeight={ 5 } mt={ 6 } color="text">
        <span>This site is protected by reCAPTCHA and the Google </span>
        <Link href="https://policies.google.com/privacy" isExternal>
          Privacy Policy
        </Link>
        <span> and </span>
        <Link href="https://policies.google.com/terms" isExternal>
          Terms of Service
        </Link>
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
            gap={{
              base: 6,
              lg: colNum === MAX_LINKS_COLUMNS + 1 ? 2 : 8,
              xl: 12,
            }}
            gridTemplateColumns={{
              base: 'repeat(auto-fill, 160px)',
              lg: `repeat(${ colNum }, 135px)`,
              xl: `repeat(${ colNum }, 160px)`,
            }}
            justifyContent={{ lg: 'flex-end' }}
            mt={{ base: 8, lg: 0 }}
          >
            { [
              { title: 'Blockscout', links: BLOCKSCOUT_LINKS },
              ...(linksData || []),
            ]
              .slice(0, colNum)
              .map((linkGroup) => (
                <Box key={ linkGroup.title }>
                  <Skeleton
                    fontWeight={ 500 }
                    mb={ 3 }
                    display="inline-block"
                    isLoaded={ !isPlaceholderData }
                  >
                    { linkGroup.title }
                  </Skeleton>
                  <VStack spacing={ 1 } alignItems="start">
                    { linkGroup.links.map((link) => (
                      <FooterLinkItem
                        { ...link }
                        key={ link.text }
                        isLoading={ isPlaceholderData }
                      />
                    )) }
                  </VStack>
                </Box>
              )) }
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
          { BLOCKSCOUT_LINKS.map((link) => (
            <FooterLinkItem { ...link } key={ link.text }/>
          )) }
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(Footer);

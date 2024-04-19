/* eslint-disable react-hooks/rules-of-hooks */
// import type { GridProps } from '@chakra-ui/react';
// import { Box, Grid, Flex, Text, Link, VStack, Skeleton, useColorModeValue } from '@chakra-ui/react';
// import { useQuery } from '@tanstack/react-query';
import { Box, Divider, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import useNavItems from 'lib/hooks/useNavItems';

import NavLink from '../navigation/NavLink';
import FooterLinkItem from './FooterLinkItem';

// import type { CustomLinksGroup } from 'types/footerLinks';

// import config from 'configs/app';
// import type { ResourceError } from 'lib/api/resources';
// import useApiQuery from 'lib/api/useApiQuery';
// import useFetch from 'lib/hooks/useFetch';
// import useIssueUrl from 'lib/hooks/useIssueUrl';
// import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';

// import FooterLinkItem from './FooterLinkItem';
// import IntTxsIndexingStatus from './IntTxsIndexingStatus';
// import getApiVersionUrl from './utils/getApiVersionUrl';
// import Image from 'next/image';

// const MAX_LINKS_COLUMNS = 4;

// const FRONT_VERSION_URL = `https://github.com/blockscout/frontend/tree/${ config.UI.footer.frontendVersion }`;
// const FRONT_COMMIT_URL = `https://github.com/blockscout/frontend/commit/${ config.UI.footer.frontendCommit }`;

const Footer = () => {
  const { mainNavItems } = useNavItems();

  const SOCIAL_HANDLE = [
    {
      icon: 'social/git' as const,
      iconSize: '18px',
      url: 'https://twitter.com/satschain',
    },
    {
      icon: 'social/twitter' as const,
      iconSize: '18px',
      url: 'https://twitter.com/satschain',
    },
    {
      icon: 'social/discord' as const,
      iconSize: '24px',
      url: 'https://twitter.com/satschain',
    },
  ];

  // const { data: backendVersionData } = useApiQuery('config_backend_version', {
  //   queryOptions: {
  //     staleTime: Infinity,
  //   },
  // });
  // const apiVersionUrl = getApiVersionUrl(backendVersionData?.backend_version);
  // const issueUrl = useIssueUrl(backendVersionData?.backend_version);
  // const BLOCKSCOUT_LINKS = [
  //   {
  //     icon: 'edit' as const,
  //     iconSize: '16px',
  //     text: 'Submit an issue',
  //     url: issueUrl,
  //   },
  //   {
  //     icon: 'social/canny' as const,
  //     iconSize: '20px',
  //     text: 'Feature request',
  //     url: 'https://blockscout.canny.io/feature-requests',
  //   },
  //   {
  //     icon: 'social/git' as const,
  //     iconSize: '18px',
  //     text: 'Contribute',
  //     url: 'https://github.com/blockscout/blockscout',
  //   },
  //   {
  //     icon: 'social/twitter' as const,
  //     iconSize: '18px',
  //     text: 'X (ex-Twitter)',
  //     url: 'https://www.twitter.com/blockscoutcom',
  //   },
  //   {
  //     icon: 'social/discord' as const,
  //     iconSize: '24px',
  //     text: 'Discord',
  //     url: 'https://discord.gg/blockscout',
  //   },
  //   {
  //     icon: 'discussions' as const,
  //     iconSize: '20px',
  //     text: 'Discussions',
  //     url: 'https://github.com/orgs/blockscout/discussions',
  //   },
  //   {
  //     icon: 'donate' as const,
  //     iconSize: '20px',
  //     text: 'Donate',
  //     url: 'https://github.com/sponsors/blockscout',
  //   },
  // ];

  // const frontendLink = (() => {
  //   if (config.UI.footer.frontendVersion) {
  //     return <Link href={ FRONT_VERSION_URL } target="_blank">{ config.UI.footer.frontendVersion }</Link>;
  //   }

  //   if (config.UI.footer.frontendCommit) {
  //     return <Link href={ FRONT_COMMIT_URL } target="_blank">{ config.UI.footer.frontendCommit }</Link>;
  //   }

  //   return null;
  // })();

  // const fetch = useFetch();

  // const { isPlaceholderData, data: linksData } = useQuery<unknown, ResourceError<unknown>, Array<CustomLinksGroup>>({
  //   queryKey: [ 'footer-links' ],
  //   queryFn: async() => fetch(config.UI.footer.links || '', undefined, { resource: 'footer-links' }),
  //   enabled: Boolean(config.UI.footer.links),
  //   staleTime: Infinity,
  //   placeholderData: [],
  // });

  // const colNum = isPlaceholderData ? 1 : Math.min(linksData?.length || Infinity, MAX_LINKS_COLUMNS) + 1;

  // const renderNetworkInfo = React.useCallback((gridArea?: GridProps['gridArea']) => {
  //   return (
  //     <Flex
  //       gridArea={ gridArea }
  //       flexWrap="wrap"
  //       columnGap={ 8 }
  //       rowGap={ 6 }
  //       mb={{ base: 5, lg: 10 }}
  //       _empty={{ display: 'none' }}
  //     >
  //       { !config.UI.indexingAlert.intTxs.isHidden && <IntTxsIndexingStatus/> }
  //       <NetworkAddToWallet/>
  //     </Flex>
  //   );
  // }, []);

  // const renderProjectInfo = React.useCallback((gridArea?: GridProps['gridArea']) => {
  //   return (
  //     <Box gridArea={ gridArea }>
  //       <Link fontSize="xs" href="https://www.blockscout.com">blockscout.com</Link>
  //       <Text mt={ 3 } fontSize="xs">
  //         Blockscout is a tool for inspecting and analyzing EVM based blockchains. Blockchain explorer for Ethereum Networks.
  //       </Text>
  //       <VStack spacing={ 1 } mt={ 6 } alignItems="start">
  //         { apiVersionUrl && (
  //           <Text fontSize="xs">
  //             Backend: <Link href={ apiVersionUrl } target="_blank">{ backendVersionData?.backend_version }</Link>
  //           </Text>
  //         ) }
  //         { frontendLink && (
  //           <Text fontSize="xs">
  //             Frontend: { frontendLink }
  //           </Text>
  //         ) }
  //       </VStack>
  //     </Box>
  //   );
  // }, [ apiVersionUrl, backendVersionData?.backend_version, frontendLink ]);

  // const containerProps: GridProps = {
  //   as: 'footer',
  //   px: { base: 4, lg: 12 },
  //   py: { base: 4, lg: 9 },
  //   borderTop: '1px solid',
  //   borderColor: 'divider',
  //   gridTemplateColumns: { base: '1fr', lg: 'minmax(auto, 470px) 1fr' },
  //   columnGap: { lg: '32px', xl: '100px' },
  // };

  // if (config.UI.footer.links) {
  //   return (
  //     <Grid { ...containerProps }>
  //       <div>
  //         { renderNetworkInfo() }
  //         { renderProjectInfo() }
  //       </div>

  //       <Grid
  //         gap={{ base: 6, lg: colNum === MAX_LINKS_COLUMNS + 1 ? 2 : 8, xl: 12 }}
  //         gridTemplateColumns={{
  //           base: 'repeat(auto-fill, 160px)',
  //           lg: `repeat(${ colNum }, 135px)`,
  //           xl: `repeat(${ colNum }, 160px)`,
  //         }}
  //         justifyContent={{ lg: 'flex-end' }}
  //         mt={{ base: 8, lg: 0 }}
  //       >
  //         {
  //           ([
  //             { title: 'Blockscout', links: BLOCKSCOUT_LINKS },
  //             ...(linksData || []),
  //           ])
  //             .slice(0, colNum)
  //             .map(linkGroup => (
  //               <Box key={ linkGroup.title }>
  //                 <Skeleton fontWeight={ 500 } mb={ 3 } display="inline-block" isLoaded={ !isPlaceholderData }>{ linkGroup.title }</Skeleton>
  //                 <VStack spacing={ 1 } alignItems="start">
  //                   { linkGroup.links.map(link => <FooterLinkItem { ...link } key={ link.text } isLoading={ isPlaceholderData }/>) }
  //                 </VStack>
  //               </Box>
  //             ))
  //         }
  //       </Grid>
  //     </Grid>
  //   );
  // }

  return (
  // <Grid
  //   { ...containerProps }
  //   gridTemplateAreas={{
  //     lg: `
  //       "network links-top"
  //       "info links-bottom"
  //     `,
  //   }}
  // >

  //   { renderNetworkInfo({ lg: 'network' }) }
  //   { renderProjectInfo({ lg: 'info' }) }

    //   <Grid
    //     gridArea={{ lg: 'links-bottom' }}
    //     gap={ 1 }
    //     gridTemplateColumns={{
    //       base: 'repeat(auto-fill, 160px)',
    //       lg: 'repeat(3, 160px)',
    //       xl: 'repeat(4, 160px)',
    //     }}
    //     gridTemplateRows={{
    //       base: 'auto',
    //       lg: 'repeat(3, auto)',
    //       xl: 'repeat(2, auto)',
    //     }}
    //     gridAutoFlow={{ base: 'row', lg: 'column' }}
    //     alignContent="start"
    //     justifyContent={{ lg: 'flex-end' }}
    //     mt={{ base: 8, lg: 0 }}
    //   >
    //     { BLOCKSCOUT_LINKS.map(link => <FooterLinkItem { ...link } key={ link.text }/>) }
    //   </Grid>
    // </Grid>
    <Box
      bg={ useColorModeValue('gray.1000', 'gray.1500') }
      p={{ base: '16px', lg: '32px' }}
      maxH={ 300 }
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={{
          base: '12px',
          lg: '24px',
        }}
      >
        <Image
          src={ useColorModeValue('/stats-logo.png', '/logo.png') }
          alt="Logo"
          width={ 200 }
          height={ 300 }
        />
        <Flex
          color={ useColorModeValue('black', 'gray.1300') }
          fontSize={{ lg: '16px', base: '12px' }}
          fontWeight="600"
          flexWrap="wrap"
          gap={{ lg: '20px', base: '8px' }}
        >
          { mainNavItems?.map((item) => {
            return (
              <div key={ item.text }>
                <NavLink item={ item } isCollapsed={ false }/>
              </div>
            );
          }) }
        </Flex>
      </Flex>
      <Divider
        bg={ useColorModeValue('rgba(0, 0, 0, 0.5)', 'gray.1300') }
        height="1px"
        mt={ 10 }
        mb={ 4 }
      />
      <Flex
        justifyContent={{ lg: 'space-between', base: 'center' }}
        alignItems="center"
        gap={ 4 }
        flexDirection={{
          base: 'column',
          lg: 'row',
        }}
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          gap={{
            base: '4px',
            lg: '12px',
          }}
          fontWeight={ 500 }
          fontSize={{
            base: '10px',
            lg: '14px',
          }}
          flexWrap="wrap"
          color={ useColorModeValue('rgba(0,0,0,1)', 'gray.1300') }
        >
          <Text>© 2024 SatsChain. All rights reserved.</Text>
          <Link
            href="/"
            style={{ textDecoration: 'underline !important' }}
          >
            Privacy Policy
          </Link>
          <Link
            href="/"
            style={{ textDecoration: 'underline !important' }}
          >
            Terms of Service
          </Link>
        </Flex>
        <Flex>
          { SOCIAL_HANDLE?.map((link, index) => (
            <FooterLinkItem key={ index } { ...link }/>
          )) }
        </Flex>
      </Flex>
    </Box>
  );
};

export default React.memo(Footer);

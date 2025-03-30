import type { GridProps, HTMLChakraProps } from '@chakra-ui/react';
import { Box, Grid, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useFetch from 'lib/hooks/useFetch';
import Skeleton from 'ui/shared/chakra/Skeleton';

import NetworkLogo from '../networkMenu/NetworkLogo';
import FooterLinkItem from './FooterLinkItem';

const MAX_LINKS_COLUMNS = 4;

const BLOCKSCOUT_LINKS = [
  {
    icon: 'social/git' as const,
    iconSize: '20px',
    text: 'GitHub',
    url: 'https://github.com/fluentlabs-xyz',
  },
  {
    icon: 'social/twitter' as const,
    iconSize: '18px',
    text: 'X (ex-Twitter)',
    url: 'https://twitter.com/fluentxyz',
  },
  {
    icon: 'social/discord' as const,
    iconSize: '24px',
    text: 'Discord',
    url: 'https://discord.com/invite/fluentxyz',
  },
];

const Footer = () => {
  const fetch = useFetch();

  const { isPlaceholderData, data: linksData } = useQuery<unknown, ResourceError<unknown>, Array<CustomLinksGroup>>({
    queryKey: [ 'footer-links' ],
    queryFn: async() => fetch(config.UI.footer.links || '', undefined, { resource: 'footer-links' }),
    enabled: Boolean(config.UI.footer.links),
    staleTime: Infinity,
    placeholderData: [],
  });

  const colNum = isPlaceholderData ? 1 : Math.min(linksData?.length || Infinity, MAX_LINKS_COLUMNS) + 1;

  const containerProps: HTMLChakraProps<'div'> = {
    as: 'footer',
    borderTopWidth: '1px',
    borderTopColor: 'solid',
  };

  const contentProps: GridProps = {
    px: { base: 4, lg: config.UI.navigation.layout === 'horizontal' ? 6 : 12, '2xl': 6 },
    py: { base: 4, lg: 8 },
  };

  if (config.UI.footer.links) {
    return (
      <Box { ...containerProps }>
        <Grid { ...contentProps }>
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
                    <Skeleton fontWeight={ 500 } mb={ 3 } display="inline-block" isLoaded={ !isPlaceholderData }>{ linkGroup.title }</Skeleton>
                    <VStack spacing={ 1 } alignItems="start" flexDirection={{ lg: 'row', sm: 'column', xs: 'column' }}>
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
    <Box
      { ...containerProps }
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={ 12 }
      width="100%"
    >
      <NetworkLogo/>
      <Box
        { ...contentProps }
        display="flex"
        justifyContent="flex-end"
      >
        <Grid
          display="flex"
          alignContent="start"
          justifyContent={{ lg: 'flex-end' }}
          gap={ 8 }
          mt={{ base: 8, lg: 0 }}
          flexDirection={{ lg: 'row', sm: 'column', xs: 'column' }}
        >
          { BLOCKSCOUT_LINKS.map(link => <FooterLinkItem { ...link } key={ link.text }/>) }
        </Grid>
      </Box>
    </Box>
  );
};

export default React.memo(Footer);

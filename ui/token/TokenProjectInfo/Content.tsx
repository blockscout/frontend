import { Flex, Text, Grid } from '@chakra-ui/react';
import React from 'react';

import type { TokenVerifiedInfo } from 'types/api/token';

import iconCoinGecko from 'icons/social/coingecko.svg';
import iconCoinMarketCap from 'icons/social/coinmarketcap.svg';
import iconDefiLlama from 'icons/social/defi_llama.svg';
import iconDiscord from 'icons/social/discord_filled.svg';
import iconFacebook from 'icons/social/facebook_filled.svg';
import iconGithub from 'icons/social/github_filled.svg';
import iconLinkedIn from 'icons/social/linkedin_filled.svg';
import iconMedium from 'icons/social/medium_filled.svg';
import iconOpenSea from 'icons/social/opensea_filled.svg';
import iconReddit from 'icons/social/reddit_filled.svg';
import iconSlack from 'icons/social/slack_filled.svg';
import iconTelegram from 'icons/social/telegram_filled.svg';
import iconTwitter from 'icons/social/twitter_filled.svg';

import DocsLink from './DocsLink';
import type { Props as ServiceLinkProps } from './ServiceLink';
import ServiceLink from './ServiceLink';
import SupportLink from './SupportLink';

interface Props {
  data: TokenVerifiedInfo;
}

const SOCIAL_LINKS: Array<Omit<ServiceLinkProps, 'href'>> = [
  { field: 'github', icon: iconGithub, title: 'Github' },
  { field: 'twitter', icon: iconTwitter, title: 'Twitter' },
  { field: 'telegram', icon: iconTelegram, title: 'Telegram' },
  { field: 'openSea', icon: iconOpenSea, title: 'OpenSea' },
  { field: 'linkedin', icon: iconLinkedIn, title: 'LinkedIn' },
  { field: 'facebook', icon: iconFacebook, title: 'Facebook' },
  { field: 'discord', icon: iconDiscord, title: 'Discord' },
  { field: 'medium', icon: iconMedium, title: 'Medium' },
  { field: 'slack', icon: iconSlack, title: 'Slack' },
  { field: 'reddit', icon: iconReddit, title: 'Reddit' },
];

const PRICE_TICKERS: Array<Omit<ServiceLinkProps, 'href'>> = [
  { field: 'coinGeckoTicker', icon: iconCoinGecko, title: 'CoinGecko' },
  { field: 'coinMarketCapTicker', icon: iconCoinMarketCap, title: 'CoinMarketCap' },
  { field: 'defiLlamaTicker', icon: iconDefiLlama, title: 'DefiLlama' },
];

export function hasContent(data: TokenVerifiedInfo): boolean {
  const fields: Array<keyof TokenVerifiedInfo> = [
    'projectDescription',
    'docs',
    'support',
    ...SOCIAL_LINKS.map(({ field }) => field),
    ...PRICE_TICKERS.map(({ field }) => field),
  ];
  return fields.some((field) => data[field]);
}

const Content = ({ data }: Props) => {
  const docs = data.docs ? <DocsLink href={ data.docs }/> : null;
  const support = data.support ? <SupportLink url={ data.support }/> : null;
  const description = data.projectDescription ? <Text fontSize="sm" mt={ 3 }>{ data.projectDescription }</Text> : null;

  const socialLinks = SOCIAL_LINKS
    .map((link) => ({ ...link, href: data[link.field] }))
    .filter(({ href }) => href);

  const priceTickersLinks = PRICE_TICKERS
    .map((link) => ({ ...link, href: data[link.field] }))
    .filter(({ href }) => href);

  return (
    <Flex fontSize="sm" flexDir="column" rowGap={ 5 }>
      { (description || docs || support) && (
        <div>
          <Text variant="secondary" fontSize="xs">Description and support info</Text>
          { description }
          { (docs || support) && (
            <Flex alignItems="center" flexWrap="wrap" columnGap={ 6 } mt={ 3 }>
              { support }
              { docs }
            </Flex>
          ) }
        </div>
      ) }
      { socialLinks.length > 0 && (
        <div>
          <Text variant="secondary" fontSize="xs">Links</Text>
          <Grid templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} columnGap={ 4 } rowGap={ 3 } mt={ 3 }>
            { socialLinks.map((link) => <ServiceLink key={ link.field } { ...link }/>) }
          </Grid>
        </div>
      ) }
      { priceTickersLinks.length > 0 && (
        <div>
          <Text variant="secondary" fontSize="xs">Crypto markets</Text>
          <Grid templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} columnGap={ 4 } rowGap={ 3 } mt={ 3 }>
            { priceTickersLinks.map((link) => <ServiceLink key={ link.field } { ...link }/>) }
          </Grid>
        </div>
      ) }
    </Flex>
  );
};

export default Content;

import { Flex, Link, Icon } from '@chakra-ui/react';
import React from 'react';

import type { TokenVerifiedInfo } from 'types/api/token';

import iconDocs from 'icons/docs.svg';
import iconEmail from 'icons/email.svg';
import iconLink from 'icons/link.svg';
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
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import LinkExternal from 'ui/shared/LinkExternal';
import TextSeparator from 'ui/shared/TextSeparator';

interface Props {
  data: TokenVerifiedInfo;
}

interface TServiceLink {
  field: keyof TokenVerifiedInfo;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  hint: string;
}
const SOCIAL_LINKS: Array<TServiceLink> = [
  { field: 'github', icon: iconGithub, hint: 'Github account' },
  { field: 'twitter', icon: iconTwitter, hint: 'Twitter account' },
  { field: 'telegram', icon: iconTelegram, hint: 'Telegram account' },
  { field: 'openSea', icon: iconOpenSea, hint: 'OpenSea page' },
  { field: 'linkedin', icon: iconLinkedIn, hint: 'LinkedIn page' },
  { field: 'facebook', icon: iconFacebook, hint: 'Facebook account' },
  { field: 'discord', icon: iconDiscord, hint: 'Discord account' },
  { field: 'medium', icon: iconMedium, hint: 'Medium account' },
  { field: 'slack', icon: iconSlack, hint: 'Slack account' },
  { field: 'reddit', icon: iconReddit, hint: 'Reddit account' },
];
const PRICE_TICKERS: Array<TServiceLink> = [
  { field: 'coinGeckoTicker', icon: iconCoinGecko, hint: 'Coin Gecko' },
  { field: 'coinMarketCapTicker', icon: iconCoinMarketCap, hint: 'Coin Market Cap' },
  { field: 'defiLlamaTicker', icon: iconDefiLlama, hint: 'Defi Llama' },
];

const ServiceLink = ({ href, hint, icon }: TServiceLink & { href: string | undefined }) => (
  <Link
    href={ href }
    variant="secondary"
    boxSize={ 5 }
    aria-label={ hint }
    title={ hint }
    target="_blank"
  >
    <Icon as={ icon } boxSize={ 5 }/>
  </Link>
);

const TokenDetailsVerifiedInfo = ({ data }: Props) => {
  const websiteLink = (() => {
    try {
      const url = new URL(data.projectWebsite);
      return (
        <Flex alignItems="center" columnGap={ 1 } color="text_secondary" _hover={{ color: 'link_hovered' }}>
          <Icon as={ iconLink } boxSize={ 6 }/>
          <LinkExternal href={ data.projectWebsite } fontSize="md">{ url.host }</LinkExternal>
        </Flex>
      );
    } catch (error) {
      return null;
    }
  })();

  const docsLink = (() => {
    if (!data.docs) {
      return null;
    }

    return (
      <Flex alignItems="center" columnGap={ 1 } color="text_secondary" _hover={{ color: 'link_hovered' }}>
        <Icon as={ iconDocs } boxSize={ 6 }/>
        <LinkExternal href={ data.docs } fontSize="md">Documentation</LinkExternal>
      </Flex>
    );
  })();

  const supportLink = (() => {
    if (!data.support) {
      return null;
    }

    const isEmail = data.support.includes('@');
    const href = isEmail ? `mailto:${ data.support }` : data.support;
    return (
      <Flex alignItems="center" columnGap={ 1 } color="text_secondary" _hover={{ color: 'link_hovered' }}>
        <Icon as={ iconEmail } boxSize={ 6 }/>
        <Link href={ href } target="_blank">
          { data.support }
        </Link>
      </Flex>
    );
  })();

  const socialLinks = SOCIAL_LINKS
    .map((link) => ({ ...link, href: data[link.field] }))
    .filter(({ href }) => href);

  const priceTickersLinks = PRICE_TICKERS
    .map((link) => ({ ...link, href: data[link.field] }))
    .filter(({ href }) => href);

  return (
    <DetailsInfoItem
      title="Links"
      hint="Links to the project's official website and social media channels."
    >
      <Flex flexDir="column" rowGap={ 5 }>
        <Flex
          flexDir={{ base: 'column', lg: 'row' }}
          alignItems={{ base: 'flex-start', lg: 'center' }}
          columnGap={ 6 }
          rowGap={ 2 }
        >
          { websiteLink }
          { docsLink }
          { supportLink }
        </Flex>
        { (socialLinks.length > 0 || priceTickersLinks.length > 0) && (
          <Flex
            columnGap={ 2 }
            rowGap={ 2 }
            flexWrap="wrap"
          >
            { socialLinks.map((link) => <ServiceLink key={ link.field } { ...link }/>) }
            { priceTickersLinks.length > 0 && (
              <>
                <TextSeparator color="divider"/>
                { priceTickersLinks.map((link) => <ServiceLink key={ link.field } { ...link }/>) }
              </>
            ) }
          </Flex>
        ) }
      </Flex>
    </DetailsInfoItem>
  );
};

export default React.memo(TokenDetailsVerifiedInfo);

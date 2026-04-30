import { Flex } from '@chakra-ui/react';
import type { IconName } from 'public/icons/name';
import React from 'react';

import type { TokenSocials } from 'types/api/token';

import { Link } from 'toolkit/chakra/link';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  socials: TokenSocials | null | undefined;
  fields?: ReadonlyArray<keyof TokenSocials>;
  boxSize?: number;
}

type SocialEntry = {
  key: keyof TokenSocials;
  label: string;
} & (
  | { icon: IconName } |
  { icon: null }
);

const SOCIAL_CONFIG: Array<SocialEntry> = [
  { key: 'website', label: 'Website', icon: 'globe' },
  { key: 'twitter', label: 'X (Twitter)', icon: 'social/twitter_filled' },
  { key: 'telegram', label: 'Telegram', icon: 'social/telegram_filled' },
  { key: 'discord', label: 'Discord', icon: 'social/discord_filled' },
  { key: 'github', label: 'GitHub', icon: 'social/github_filled' },
  { key: 'medium', label: 'Medium', icon: 'social/medium_filled' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'social/linkedin_filled' },
  { key: 'facebook', label: 'Facebook', icon: 'social/facebook_filled' },
  { key: 'reddit', label: 'Reddit', icon: 'social/reddit_filled' },
  { key: 'coinmarketcap', label: 'CoinMarketCap', icon: 'social/coinmarketcap' },
  { key: 'coingecko', label: 'CoinGecko', icon: 'social/coingecko' },
];

const TokenSocialLinks = ({ socials, fields, boxSize = 5 }: Props) => {
  if (!socials) {
    return null;
  }

  const config = fields ? SOCIAL_CONFIG.filter(({ key }) => fields.includes(key)) : SOCIAL_CONFIG;
  const items = config.filter(({ key }) => Boolean(socials[key]));

  if (items.length === 0) {
    return null;
  }

  return (
    <Flex columnGap={ 2 } alignItems="center">
      { items.map(({ key, label, icon }) => {
        const href = socials[key] as string;

        if (icon === null) {
          return (
            <Link key={ key } external href={ href } noIcon textStyle="sm" flexShrink={ 0 }>
              { label }
            </Link>
          );
        }

        return (
          <Tooltip key={ key } content={ label }>
            <Link external href={ href } noIcon display="flex" alignItems="center" flexShrink={ 0 } color="icon.secondary" _hover={{ color: 'link.primary' }}>
              <IconSvg name={ icon } boxSize={ boxSize }/>
            </Link>
          </Tooltip>
        );
      }) }
    </Flex>
  );
};

export default React.memo(TokenSocialLinks);

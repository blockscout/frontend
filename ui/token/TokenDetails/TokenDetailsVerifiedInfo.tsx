import { Flex, Link, Icon } from '@chakra-ui/react';
import React from 'react';

import type { TokenVerifiedInfo } from 'types/api/token';

import githubIcon from 'icons/social/git.svg';
import placeholderIcon from 'icons/social/stats.svg';
import telegramIcon from 'icons/social/telega.svg';
import twitterIcon from 'icons/social/tweet.svg';
import LinkExternal from 'ui/shared/LinkExternal';

interface Props {
  data: TokenVerifiedInfo;
}

interface SocialLink {
  field: keyof TokenVerifiedInfo;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  hint: string;
}
const SOCIAL_LINKS: Array<SocialLink> = [
  { field: 'github', icon: githubIcon, hint: 'Github account' },
  { field: 'twitter', icon: twitterIcon, hint: 'Twitter account' },
  { field: 'telegram', icon: telegramIcon, hint: 'Telegram account' },
  { field: 'openSea', icon: placeholderIcon, hint: 'OpenSea page' },
  { field: 'linkedin', icon: placeholderIcon, hint: 'LinkedIn page' },
  { field: 'facebook', icon: placeholderIcon, hint: 'Facebook account' },
  { field: 'discord', icon: placeholderIcon, hint: 'Discord account' },
  { field: 'medium', icon: placeholderIcon, hint: 'Medium account' },
  { field: 'slack', icon: placeholderIcon, hint: 'Slack account' },
  { field: 'reddit', icon: placeholderIcon, hint: 'Reddit account' },
];

const TokenDetailsVerifiedInfo = ({ data }: Props) => {
  const websiteName = (() => {
    try {
      const url = new URL(data.projectWebsite);
      return url.host;
    } catch (error) { }
  })();

  const socialLinks = SOCIAL_LINKS
    .map((link) => ({ ...link, href: data[link.field] }))
    .filter(({ href }) => href);

  return (
    <Flex alignItems={{ base: 'flex-start', lg: 'center' }} flexDir={{ base: 'column', lg: 'row' }} rowGap={ 2 } columnGap={ 6 }>
      { websiteName && <LinkExternal href={ data.projectWebsite }>{ websiteName }</LinkExternal> }
      { socialLinks.length > 0 && (
        <Flex columnGap={ 2 }>
          { socialLinks.map((link) => (
            <Link href={ link.href } key={ link.field } variant="secondary" boxSize={ 5 } aria-label={ link.hint } title={ link.hint } target="_blank">
              <Icon as={ link.icon } boxSize={ 5 }/>
            </Link>
          )) }
        </Flex>
      ) }
    </Flex>
  );
};

export default React.memo(TokenDetailsVerifiedInfo);

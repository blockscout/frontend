import { Flex, Link, Icon } from '@chakra-ui/react';
import React from 'react';

import type { TokenVerifiedInfo } from 'types/api/token';

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

interface Props {
  data: TokenVerifiedInfo;
}

interface SocialLink {
  field: keyof TokenVerifiedInfo;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  hint: string;
}
const SOCIAL_LINKS: Array<SocialLink> = [
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

const TokenDetailsVerifiedInfo = ({ data }: Props) => {
  const websiteName = (() => {
    try {
      const url = new URL(data.projectWebsite);
      return url.host;
    } catch (error) { }
  })();

  const supportLink = (() => {
    if (!data.support) {
      return null;
    }

    const isEmail = data.support.includes('@');
    const href = isEmail ? `mailto:${ data.support }` : data.support;
    return (
      <DetailsInfoItem
        title="Support"
        hint="Links to the project's official website and social media channels."
      >
        <Link href={ href } target="_blank">
          { data.support }
        </Link>
      </DetailsInfoItem>
    );
  })();

  const socialLinks = SOCIAL_LINKS
    .map((link) => ({ ...link, href: data[link.field] }))
    .filter(({ href }) => href);

  return (
    <>
      <DetailsInfoItem
        title="Links"
        hint="Links to the project's official website and social media channels."
      >
        <Flex alignItems={{ base: 'flex-start', lg: 'center' }} flexDir={{ base: 'column', lg: 'row' }} rowGap={ 2 } columnGap={ 6 }>
          { websiteName && <LinkExternal href={ data.projectWebsite } fontSize="md">{ websiteName }</LinkExternal> }
          { socialLinks.length > 0 && (
            <Flex columnGap={ 2 }>
              { socialLinks.map((link) => (
                <Link
                  key={ link.field }
                  href={ link.href }
                  variant="secondary"
                  boxSize={ 5 }
                  aria-label={ link.hint }
                  title={ link.hint }
                  target="_blank"
                >
                  <Icon as={ link.icon } boxSize={ 5 }/>
                </Link>
              )) }
            </Flex>
          ) }
        </Flex>
      </DetailsInfoItem>
      { supportLink }
    </>
  );
};

export default React.memo(TokenDetailsVerifiedInfo);

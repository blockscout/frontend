import type { FormControlProps } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';

import type { Fields, SocialLinkFields } from '../types';

import FormFieldUrl from 'ui/shared/forms/fields/FormFieldUrl';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

interface Item {
  icon: IconName;
  label: string;
  color: string;
}
const SETTINGS: Record<keyof SocialLinkFields, Item> = {
  github: { label: 'GitHub', icon: 'social/github_filled', color: 'inherit' },
  telegram: { label: 'Telegram', icon: 'social/telegram_filled', color: 'telegram' },
  linkedin: { label: 'LinkedIn', icon: 'social/linkedin_filled', color: 'linkedin' },
  discord: { label: 'Discord', icon: 'social/discord_filled', color: 'discord' },
  slack: { label: 'Slack', icon: 'social/slack_filled', color: 'slack' },
  twitter: { label: 'X (ex-Twitter)', icon: 'social/twitter_filled', color: 'inherit' },
  opensea: { label: 'OpenSea', icon: 'social/opensea_filled', color: 'opensea' },
  facebook: { label: 'Facebook', icon: 'social/facebook_filled', color: 'facebook' },
  medium: { label: 'Medium', icon: 'social/medium_filled', color: 'inherit' },
  reddit: { label: 'Reddit', icon: 'social/reddit_filled', color: 'reddit' },
};

interface Props {
  isReadOnly?: boolean;
  size?: FormControlProps['size'];
  name: keyof SocialLinkFields;
}

const TokenInfoFieldSocialLink = ({ isReadOnly, size, name }: Props) => {

  const rightElement = React.useCallback(({ field }: { field: ControllerRenderProps<Fields, keyof SocialLinkFields> }) => {
    return <IconSvg name={ SETTINGS[name].icon } boxSize={ 6 } color={ field.value ? SETTINGS[name].color : '#718096' }/>;
  }, [ name ]);

  return (
    <FormFieldUrl<Fields, keyof SocialLinkFields>
      name={ name }
      placeholder={ SETTINGS[name].label }
      rightElement={ rightElement }
      isReadOnly={ isReadOnly }
      size={ size }
    />
  );
};

export default React.memo(TokenInfoFieldSocialLink);

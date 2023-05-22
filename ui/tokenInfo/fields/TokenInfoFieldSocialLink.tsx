import { FormControl, Icon, Input, InputRightElement, InputGroup } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Fields, SocialLinkFields } from '../types';

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
import { validator } from 'lib/validations/url';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Item {
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  label: string;
  color: string;
}
const SETTINGS: Record<keyof SocialLinkFields, Item> = {
  github: { label: 'GitHub', icon: iconGithub, color: 'inherit' },
  telegram: { label: 'Telegram', icon: iconTelegram, color: 'telegram' },
  linkedin: { label: 'LinkedIn', icon: iconLinkedIn, color: 'linkedin' },
  discord: { label: 'Discord', icon: iconDiscord, color: 'discord' },
  slack: { label: 'Slack', icon: iconSlack, color: 'slack' },
  twitter: { label: 'Twitter', icon: iconTwitter, color: 'twitter' },
  opensea: { label: 'OpenSea', icon: iconOpenSea, color: 'opensea' },
  facebook: { label: 'Facebook', icon: iconFacebook, color: 'facebook' },
  medium: { label: 'Medium', icon: iconMedium, color: 'inherit' },
  reddit: { label: 'Reddit', icon: iconReddit, color: 'reddit' },
};

interface Props {
  control: Control<Fields>;
  isReadOnly?: boolean;
  name: keyof SocialLinkFields;
}

const TokenInfoFieldSocialLink = ({ control, isReadOnly, name }: Props) => {
  const renderControl: ControllerProps<Fields, typeof name>['render'] = React.useCallback(({ field, fieldState, formState }) => {
    return (
      <FormControl variant="floating" id={ field.name } size={{ base: 'md', lg: 'lg' }} sx={{ '.chakra-input__group input': { pr: '60px' } }}>
        <InputGroup>
          <Input
            { ...field }
            isInvalid={ Boolean(fieldState.error) }
            isDisabled={ formState.isSubmitting || isReadOnly }
            autoComplete="off"
          />
          <InputPlaceholder text={ SETTINGS[name].label } error={ fieldState.error }/>
          <InputRightElement h="100%">
            <Icon as={ SETTINGS[name].icon } boxSize={ 6 } color={ field.value ? SETTINGS[name].color : '#718096' }/>
          </InputRightElement>
        </InputGroup>
      </FormControl>
    );
  }, [ isReadOnly, name ]);

  return (
    <Controller
      name={ name }
      control={ control }
      render={ renderControl }
      rules={{ validate: validator }}
    />
  );
};

export default React.memo(TokenInfoFieldSocialLink);

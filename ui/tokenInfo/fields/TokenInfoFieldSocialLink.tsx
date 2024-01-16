import { FormControl, Input, InputRightElement, InputGroup } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Fields, SocialLinkFields } from '../types';

import { validator } from 'lib/validations/url';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

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
  twitter: { label: 'Twitter', icon: 'social/twitter_filled', color: 'twitter' },
  opensea: { label: 'OpenSea', icon: 'social/opensea_filled', color: 'opensea' },
  facebook: { label: 'Facebook', icon: 'social/facebook_filled', color: 'facebook' },
  medium: { label: 'Medium', icon: 'social/medium_filled', color: 'inherit' },
  reddit: { label: 'Reddit', icon: 'social/reddit_filled', color: 'reddit' },
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
            <IconSvg name={ SETTINGS[name].icon } boxSize={ 6 } color={ field.value ? SETTINGS[name].color : '#718096' }/>
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

import { TagLabel, TagLeftIcon, Tooltip } from '@chakra-ui/react';
import React from 'react';

import errorIcon from 'icons/status/error.svg';
import pendingIcon from 'icons/status/pending.svg';
import successIcon from 'icons/status/success.svg';
import Tag from 'ui/shared/chakra/Tag';

export type StatusTagType = 'ok' | 'error' | 'pending';

export interface Props {
  type: 'ok' | 'error' | 'pending';
  text: string;
  errorText?: string | null;
  isLoading?: boolean;
}

const StatusTag = ({ type, text, errorText, isLoading }: Props) => {
  let icon;
  let colorScheme;

  switch (type) {
    case 'ok':
      icon = successIcon;
      colorScheme = 'green';
      break;
    case 'error':
      icon = errorIcon;
      colorScheme = 'red';
      break;
    case 'pending':
      icon = pendingIcon;
      // FIXME: it's not gray on mockups
      // need to implement new color scheme or redefine colors here
      colorScheme = 'gray';
      break;
  }

  return (
    <Tooltip label={ errorText }>
      <Tag colorScheme={ colorScheme } display="inline-flex" isLoading={ isLoading }>
        <TagLeftIcon boxSize={ 2.5 } as={ icon }/>
        <TagLabel>{ text }</TagLabel>
      </Tag>
    </Tooltip>
  );
};

export default StatusTag;

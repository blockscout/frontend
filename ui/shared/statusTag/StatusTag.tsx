import { TagLabel, Tooltip } from '@chakra-ui/react';
import React from 'react';

import Tag from 'ui/shared/chakra/Tag';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

export type StatusTagType = 'ok' | 'error' | 'pending';

export interface Props {
  type: 'ok' | 'error' | 'pending';
  text: string;
  errorText?: string | null;
  isLoading?: boolean;
}

const StatusTag = ({ type, text, errorText, isLoading }: Props) => {
  let icon: IconName;
  let colorScheme;

  switch (type) {
    case 'ok':
      icon = 'status/success';
      colorScheme = 'green';
      break;
    case 'error':
      icon = 'status/error';
      colorScheme = 'red';
      break;
    case 'pending':
      icon = 'status/pending';
      // FIXME: it's not gray on mockups
      // need to implement new color scheme or redefine colors here
      colorScheme = 'gray';
      break;
  }

  return (
    <Tooltip label={ errorText }>
      <Tag colorScheme={ colorScheme } display="flex" isLoading={ isLoading } >
        <IconSvg boxSize={ 2.5 } name={ icon } mr={ 2 } flexShrink={ 0 }/>
        <TagLabel display="block">{ text }</TagLabel>
      </Tag>
    </Tooltip>
  );
};

export default StatusTag;

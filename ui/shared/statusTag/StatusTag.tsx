import { TagLabel, Tooltip, chakra } from '@chakra-ui/react';
import React from 'react';

import capitalizeFirstLetter from 'lib/capitalizeFirstLetter';
import Tag from 'ui/shared/chakra/Tag';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

export type StatusTagType = 'ok' | 'error' | 'pending';

export interface Props {
  type: 'ok' | 'error' | 'pending';
  text: string;
  errorText?: string | null;
  isLoading?: boolean;
  className?: string;
}

const StatusTag = ({ type, text, errorText, isLoading, className }: Props) => {
  let icon: IconName;
  let colorScheme;

  const capitalizedText = capitalizeFirstLetter(text);

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
      colorScheme = 'gray';
      break;
  }

  return (
    <Tooltip label={ errorText }>
      <Tag colorScheme={ colorScheme } display="flex" isLoading={ isLoading } className={ className }>
        <IconSvg boxSize={ 2.5 } name={ icon } mr={ 1 } flexShrink={ 0 }/>
        <TagLabel display="block">{ capitalizedText }</TagLabel>
      </Tag>
    </Tooltip>
  );
};

export default chakra(StatusTag);

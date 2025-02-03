import { TagLabel, Tooltip, chakra } from '@chakra-ui/react';
import React from 'react';

import capitalizeFirstLetter from 'lib/capitalizeFirstLetter';
import Tag from 'ui/shared/chakra/Tag';

export type StatusTagType = 'ok' | 'error' | 'pending';

export interface Props {
  type: 'ok' | 'error' | 'pending';
  text: string;
  errorText?: string | null;
  isLoading?: boolean;
  className?: string;
}

const StatusTag = ({ type, text, errorText, isLoading, className }: Props) => {
  let colorScheme;

  const capitalizedText = capitalizeFirstLetter(text);

  switch (type) {
    case 'ok':
      colorScheme = 'green';
      break;
    case 'error':
      colorScheme = 'red';
      break;
    case 'pending':
      colorScheme = 'gray';
      break;
  }

  return (
    <Tooltip label={ errorText }>
      <Tag colorScheme={ colorScheme } display="flex" px="8px" isLoading={ isLoading } className={ className }>
        <TagLabel display="block" fontSize="12px">{ capitalizedText }</TagLabel>
      </Tag>
    </Tooltip>
  );
};

export default chakra(StatusTag);

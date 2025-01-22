import { chakra } from '@chakra-ui/react';
import React from 'react';

import capitalizeFirstLetter from 'lib/capitalizeFirstLetter';
import type { BadgeProps } from 'toolkit/chakra/badge';
import { Badge } from 'toolkit/chakra/badge';
import { Tooltip } from 'toolkit/chakra/tooltip';
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
  let colorPalette: BadgeProps['colorPalette'];

  const capitalizedText = capitalizeFirstLetter(text);

  switch (type) {
    case 'ok':
      icon = 'status/success';
      colorPalette = 'green';
      break;
    case 'error':
      icon = 'status/error';
      colorPalette = 'red';
      break;
    case 'pending':
      icon = 'status/pending';
      colorPalette = 'gray';
      break;
  }

  return (
    <Tooltip content={ errorText } disabled={ !errorText }>
      <Badge colorPalette={ colorPalette } loading={ isLoading } className={ className }>
        <IconSvg boxSize={ 2.5 } name={ icon } mr={ 1 } flexShrink={ 0 }/>
        <span>{ capitalizedText }</span>
      </Badge>
    </Tooltip>
  );
};

export default chakra(StatusTag);

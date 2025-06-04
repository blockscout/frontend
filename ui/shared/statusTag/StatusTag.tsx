import React from 'react';

import capitalizeFirstLetter from 'lib/capitalizeFirstLetter';
import type { BadgeProps } from 'toolkit/chakra/badge';
import { Badge } from 'toolkit/chakra/badge';
import { Tooltip } from 'toolkit/chakra/tooltip';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

export type StatusTagType = 'ok' | 'error' | 'pending';

export interface Props extends BadgeProps {
  type: 'ok' | 'error' | 'pending';
  text: string;
  errorText?: string | null;
}

const StatusTag = ({ type, text, errorText, ...rest }: Props) => {
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

  const startElement = <IconSvg name={ icon } boxSize={ 2.5 }/>;

  return (
    <Tooltip content={ errorText } disabled={ !errorText }>
      <Badge colorPalette={ colorPalette } startElement={ startElement } { ...rest }>
        { capitalizedText }
      </Badge>
    </Tooltip>
  );
};

export default StatusTag;

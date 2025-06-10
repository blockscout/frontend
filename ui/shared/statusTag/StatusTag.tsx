/* eslint-disable */

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

  let _prop = { };

  if (colorScheme === 'red') {
    _prop = {
      background: "#FFEBEB",
      color: "var(--status-error, #FF3392)",
    }

  } else if (colorScheme === 'green') {
    _prop = {
      background: " var(--decorative-green-5, #EBFFF2)",
      color: "var(--status-success, #00E649)",
    }
  } else {
    _prop = {
      colorScheme : colorScheme,
    }
  }

  const textStyle = {
    fontSize: '0.75rem',
    fontWeight: 400,
    fontFamily: 'Outfit',
    fontStyle: 'normal',
    lineHeight: 'normal',
  };

  const icon_ok = (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
      <path d="M10.0947 6.65533L7.25 9.5L6.28033 8.53033M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2Z" stroke="#00E649" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );



  const icon_error = (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
      <path d="M9.8 6.2L6.2 9.8M6.2 6.2L9.8 9.8M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z" stroke="#FF3392" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  return (
    <Tooltip label={ errorText }>
      <Tag px='0.5rem' height={"1.437rem"} borderRadius='9999px'  display="flex" isLoading={ isLoading } className={ className } { ..._prop } >
        { type === 'ok' && icon_ok }
        { type === 'error' && icon_error }
        { type === 'pending' && <IconSvg boxSize={ 2.5 } name={ icon } mr={ 1 } flexShrink={ 0 }/> }
        <TagLabel display="block" { ... textStyle } >{ capitalizedText }</TagLabel>
      </Tag>
    </Tooltip>
  );
};

export default chakra(StatusTag);

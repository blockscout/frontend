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

  return (
    <Tooltip label={ errorText }>
      <Tag px='0.5rem' height={"1.437rem"} borderRadius='9999px'  display="flex" isLoading={ isLoading } className={ className } { ..._prop } >
        <IconSvg boxSize={ 2.5 } name={ icon } mr={ 1 } flexShrink={ 0 }/>
        <TagLabel display="block" { ... textStyle } >{ capitalizedText }</TagLabel>
      </Tag>
    </Tooltip>
  );
};

export default chakra(StatusTag);

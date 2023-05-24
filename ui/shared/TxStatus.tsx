import { TagLabel, TagLeftIcon, Tooltip } from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import errorIcon from 'icons/status/error.svg';
import pendingIcon from 'icons/status/pending.svg';
import successIcon from 'icons/status/success.svg';
import Tag from 'ui/shared/chakra/Tag';

export interface Props {
  status: Transaction['status'];
  errorText?: string | null;
  isLoading?: boolean;
}

const TxStatus = ({ status, errorText, isLoading }: Props) => {
  let label;
  let icon;
  let colorScheme;

  switch (status) {
    case 'ok':
      label = 'Success';
      icon = successIcon;
      colorScheme = 'green';
      break;
    case 'error':
      label = 'Failed';
      icon = errorIcon;
      colorScheme = 'red';
      break;
    case null:
      label = 'Pending';
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
        <TagLabel>{ label }</TagLabel>
      </Tag>
    </Tooltip>
  );
};

export default TxStatus;

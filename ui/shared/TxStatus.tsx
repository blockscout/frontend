import { Tag, TagLabel, TagLeftIcon, Tooltip } from '@chakra-ui/react';
import React from 'react';

import errorIcon from 'icons/status/error.svg';
import pendingIcon from 'icons/status/pending.svg';
import successIcon from 'icons/status/success.svg';

export interface Props {
  status: 'success' | 'failed' | 'pending';
  errorText?: string;
}

const TxStatus = ({ status, errorText }: Props) => {
  let label;
  let icon;
  let colorScheme;

  switch (status) {
    case 'success':
      label = 'Success';
      icon = successIcon;
      colorScheme = 'green';
      break;
    case 'failed':
      label = 'Failed';
      icon = errorIcon;
      colorScheme = 'red';
      break;
    case 'pending':
      label = 'Pending';
      icon = pendingIcon;
      // FIXME: it's not gray on mockups
      // need to implement new color scheme or redefine colors here
      colorScheme = 'gray';
      break;
  }

  return (
    <Tooltip label={ errorText }>
      <Tag colorScheme={ colorScheme } display="inline-flex">
        <TagLeftIcon boxSize={ 2.5 } as={ icon }/>
        <TagLabel>{ label }</TagLabel>
      </Tag>
    </Tooltip>
  );
};

export default TxStatus;

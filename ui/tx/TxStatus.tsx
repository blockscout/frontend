import { Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import React from 'react';

import errorIcon from 'icons/status/error.svg';
import successIcon from 'icons/status/success.svg';

export interface Props {
  status: 'success' | 'error';
}

const TxStatus = ({ status }: Props) => {
  const label = status === 'success' ? 'Success' : 'Error';
  const icon = status === 'success' ? successIcon : errorIcon;
  const colorScheme = status === 'success' ? 'green' : 'red';

  return (
    <Tag colorScheme={ colorScheme }>
      <TagLeftIcon boxSize={ 2.5 } as={ icon }/>
      <TagLabel>{ label }</TagLabel>
    </Tag>
  );
};

export default TxStatus;

// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { CloseButton } from 'src/toolkit/chakra/close-button';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

type Props = {
  onClick: () => void;
};

const ResetFilterButton = ({ onClick }: Props) => {
  return (
    <Tooltip content="Reset filter">
      <CloseButton onClick={ onClick } ml={ 1 }/>
    </Tooltip>
  );
};

export default ResetFilterButton;

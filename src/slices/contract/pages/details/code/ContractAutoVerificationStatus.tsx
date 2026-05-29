// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, HStack, Spinner } from '@chakra-ui/react';
import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Tooltip } from 'src/toolkit/chakra/tooltip';

const STATUS_MAP = {
  pending: {
    text: 'Checking contract verification',
    leftElement: <Spinner size="sm"/>,
  },
  success: {
    text: 'Contract successfully verified',
    leftElement: <SpriteIcon name="verified" boxSize={ 5 } color="green.500"/>,
  },
  failed: {
    text: 'Contract not verified automatically. Please verify manually.',
    leftElement: <SpriteIcon name="status/warning" boxSize={ 5 } color="orange.400"/>,
  },
};

export type TContractAutoVerificationStatus = keyof typeof STATUS_MAP;

interface Props {
  status: TContractAutoVerificationStatus;
  mode?: 'inline' | 'tooltip';
}

const ContractAutoVerificationStatus = ({ status, mode = 'inline' }: Props) => {
  return (
    <Tooltip content={ STATUS_MAP[status].text } disabled={ mode === 'inline' }>
      <HStack gap={ 2 } whiteSpace="pre-wrap">
        { STATUS_MAP[status].leftElement }
        <Box display={ mode === 'inline' ? 'inline' : 'none' } textStyle="sm">{ STATUS_MAP[status].text }</Box>
      </HStack>
    </Tooltip>
  );
};

export default React.memo(ContractAutoVerificationStatus);

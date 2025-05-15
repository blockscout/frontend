import { HStack } from '@chakra-ui/react';
import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

import StatusTag from './StatusTag';

interface Props {
  status: tac.OperationType;
  isLoading?: boolean;
  noTooltip?: boolean;
}

const TacOperationStatus = ({ status, isLoading, noTooltip }: Props) => {
  // TODO @tom2drum remove "as unknown" once the type is fixed
  switch (status as unknown) {
    case 'TON_TAC_TON': {
      return (
        <HStack gap={ 1 } w="fit-content">
          <IconSvg name="brands/ton" boxSize={ 5 } isLoading={ isLoading }/>
          <IconSvg name="arrows/revert" boxSize={ 5 } isLoading={ isLoading } color="text.secondary"/>
          <IconSvg name="brands/tac" boxSize={ 5 } isLoading={ isLoading }/>
        </HStack>
      );
    }

    case 'TAC_TON': {
      return (
        <HStack gap={ 1 } w="fit-content">
          <IconSvg name="brands/tac" boxSize={ 5 } isLoading={ isLoading }/>
          <IconSvg name="arrows/east" boxSize={ 5 } isLoading={ isLoading } color="text.secondary"/>
          <IconSvg name="brands/ton" boxSize={ 5 } isLoading={ isLoading }/>
        </HStack>
      );
    }

    case 'TON_TAC': {
      return (
        <HStack gap={ 1 } w="fit-content">
          <IconSvg name="brands/ton" boxSize={ 5 } isLoading={ isLoading }/>
          <IconSvg name="arrows/east" boxSize={ 5 } isLoading={ isLoading } color="text.secondary"/>
          <IconSvg name="brands/tac" boxSize={ 5 } isLoading={ isLoading }/>
        </HStack>
      );
    }

    case 'ERROR':
      return (
        <Tooltip
          // eslint-disable-next-line max-len
          content="The cross‑chain operation was reverted and the original assets and state were returned to the sender after a failure on the destination chain"
          disabled={ noTooltip }
        >
          <StatusTag type="error" text="Rollback" isLoading={ isLoading }/>
        </Tooltip>
      );
    case 'PENDING':
    default:
      return <StatusTag type="pending" text="Pending" isLoading={ isLoading }/>;
  }
};

export default React.memo(TacOperationStatus);

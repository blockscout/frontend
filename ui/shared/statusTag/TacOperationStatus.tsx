import { HStack } from '@chakra-ui/react';
import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

import StatusTag from './StatusTag';

interface Props {
  status: tac.OperationType;
  isLoading?: boolean;
}

const TacOperationStatus = ({ status, isLoading }: Props) => {
  switch (status) {
    case 'TON_TAC_TON': {
      return (
        <Tooltip content="Operation: TON > TAC > TON">
          <HStack gap={ 1 } w="fit-content">
            <IconSvg name="brands/ton" boxSize={ 5 } isLoading={ isLoading }/>
            <IconSvg name="arrows/revert" boxSize={ 5 } isLoading={ isLoading } color="text.secondary"/>
            <IconSvg name="brands/tac" boxSize={ 5 } isLoading={ isLoading }/>
          </HStack>
        </Tooltip>
      );
    }

    case 'TAC_TON': {
      return (
        <Tooltip content="Operation: TAC > TON">
          <HStack gap={ 1 } w="fit-content">
            <IconSvg name="brands/tac" boxSize={ 5 } isLoading={ isLoading }/>
            <IconSvg name="arrows/east" boxSize={ 5 } isLoading={ isLoading } color="text.secondary"/>
            <IconSvg name="brands/ton" boxSize={ 5 } isLoading={ isLoading }/>
          </HStack>
        </Tooltip>
      );
    }

    case 'TON_TAC': {
      return (
        <Tooltip content="Operation: TON > TAC">
          <HStack gap={ 1 } w="fit-content">
            <IconSvg name="brands/ton" boxSize={ 5 } isLoading={ isLoading }/>
            <IconSvg name="arrows/east" boxSize={ 5 } isLoading={ isLoading } color="text.secondary"/>
            <IconSvg name="brands/tac" boxSize={ 5 } isLoading={ isLoading }/>
          </HStack>
        </Tooltip>
      );
    }

    case 'ERROR':
      return (
        <Tooltip content="Transaction sent from TON, unsuccessfully executed on TAC and funds returned to TON back">
          <StatusTag type="error" text="Rollback" isLoading={ isLoading }/>
        </Tooltip>
      );
    case 'PENDING':
    default:
      return <StatusTag type="pending" text="Pending" isLoading={ isLoading }/>;
  }
};

export default React.memo(TacOperationStatus);

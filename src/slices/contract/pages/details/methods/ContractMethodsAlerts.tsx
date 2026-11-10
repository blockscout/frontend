// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, VStack } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import ContractCodeProxyPattern from '../code/alerts/ContractDetailsAlertProxyPattern';
import ConnectWalletAlert from './alerts/ConnectWalletAlert';
import ContractCustomAbiAlert from './alerts/ContractCustomAbiAlert';
import CustomRpcAlert from './alerts/CustomRpcAlert';

interface Props {
  isLoading?: boolean;
  isCustomAbi?: boolean;
  proxyType?: schemas['ProxyType'];
  conflictingImplementations?: schemas['SmartContract']['conflicting_implementations'];
}

const ContractMethodsAlerts = ({ isLoading, isCustomAbi, proxyType, conflictingImplementations }: Props) => {
  return (
    <VStack gap={ 1 } alignItems="stretch">
      <Flex gap={ 1 } alignItems="stretch" _empty={{ display: 'none' }}>
        <CustomRpcAlert isLoading={ isLoading }/>
        <ConnectWalletAlert isLoading={ isLoading }/>
      </Flex>
      { proxyType && <ContractCodeProxyPattern isLoading={ isLoading } type={ proxyType } conflictingImplementations={ conflictingImplementations }/> }
      { isCustomAbi && <ContractCustomAbiAlert isLoading={ isLoading }/> }
    </VStack>
  );
};

export default React.memo(ContractMethodsAlerts);

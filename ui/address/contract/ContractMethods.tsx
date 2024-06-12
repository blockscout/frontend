import { useRouter } from 'next/router';
import React from 'react';

import type { MethodType } from './ABI/types';
import type { SmartContractMethod } from './types';

import config from 'configs/app';
import getQueryParamString from 'lib/router/getQueryParamString';
import ContentLoader from 'ui/shared/ContentLoader';

import ContractAbi from './ABI/ContractAbi';
import ContractConnectWallet from './ContractConnectWallet';
import ContractCustomAbiAlert from './ContractCustomAbiAlert';

interface Props {
  data: Array<SmartContractMethod>;
  isLoading?: boolean;
  type: MethodType;
}

const ContractMethods = ({ data, isLoading, type }: Props) => {
  const router = useRouter();

  const tab = getQueryParamString(router.query.tab);
  const addressHash = getQueryParamString(router.query.hash);
  const isCustomAbi = tab === 'read_custom_methods' || tab === 'write_custom_methods';

  if (isLoading) {
    return <ContentLoader/>;
  }

  if (data.length === 0) {
    return <span>No public { type } functions were found for this contract.</span>;
  }

  return (
    <>
      { isCustomAbi && <ContractCustomAbiAlert/> }
      { config.features.blockchainInteraction.isEnabled && <ContractConnectWallet/> }
      <ContractAbi data={ data } addressHash={ addressHash } tab={ tab }/>
    </>
  );
};

export default React.memo(ContractMethods);

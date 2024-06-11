import { useRouter } from 'next/router';
import React from 'react';

import type { SmartContractMethod } from './types';

import config from 'configs/app';
import getQueryParamString from 'lib/router/getQueryParamString';
import ContentLoader from 'ui/shared/ContentLoader';

import ContractAbi from './ABI/ContractAbi';
import ContractConnectWallet from './ContractConnectWallet';

interface Props {
  data: Array<SmartContractMethod>;
  isLoading?: boolean;
  type: 'read' | 'write';
}

const ContractRead = ({ data, isLoading, type }: Props) => {
  const router = useRouter();

  const tab = getQueryParamString(router.query.tab);
  const addressHash = getQueryParamString(router.query.hash);

  if (isLoading) {
    return <ContentLoader/>;
  }

  if (data.length === 0) {
    return <span>No public { type } functions were found for this contract.</span>;
  }

  return (
    <>
      { /* { isCustomAbi && <ContractCustomAbiAlert/> } */ }
      { config.features.blockchainInteraction.isEnabled && <ContractConnectWallet/> }
      { /* { isProxy && <ContractImplementationAddress hash={ addressHash }/> } */ }
      <ContractAbi data={ data } addressHash={ addressHash } tab={ tab }/>
    </>
  );
};

export default React.memo(ContractRead);

import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import useAccount from 'lib/web3/useAccount';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import ContractAbi from './ABI/ContractAbi';
import ContractConnectWallet from './ContractConnectWallet';
import ContractCustomAbiAlert from './ContractCustomAbiAlert';
import ContractImplementationAddress from './ContractImplementationAddress';

interface Props {
  isLoading?: boolean;
}

const ContractRead = ({ isLoading }: Props) => {
  const { address } = useAccount();
  const router = useRouter();

  const tab = getQueryParamString(router.query.tab);
  const addressHash = getQueryParamString(router.query.hash);
  const isProxy = tab === 'read_proxy';
  const isCustomAbi = tab === 'read_custom_methods';

  const { data, isPending, isError } = useApiQuery(isProxy ? 'contract_methods_read_proxy' : 'contract_methods_read', {
    pathParams: { hash: addressHash },
    queryParams: {
      is_custom_abi: isCustomAbi ? 'true' : 'false',
      from: address,
    },
    queryOptions: {
      enabled: !isLoading,
    },
  });

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (isPending) {
    return <ContentLoader/>;
  }

  if (data.length === 0 && !isProxy) {
    return <span>No public read functions were found for this contract.</span>;
  }

  return (
    <>
      { isCustomAbi && <ContractCustomAbiAlert/> }
      { config.features.blockchainInteraction.isEnabled && <ContractConnectWallet/> }
      { isProxy && <ContractImplementationAddress hash={ addressHash }/> }
      <ContractAbi data={ data } addressHash={ addressHash } tab={ tab } methodType="read"/>
    </>
  );
};

export default React.memo(ContractRead);

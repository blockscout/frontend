import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import ContractAbi from './ABI/ContractAbi';
import ContractConnectWallet from './ContractConnectWallet';
import ContractCustomAbiAlert from './ContractCustomAbiAlert';
import ContractImplementationAddress from './ContractImplementationAddress';

interface Props {
  isLoading?: boolean;
}

const ContractWrite = ({ isLoading }: Props) => {
  const router = useRouter();

  const tab = getQueryParamString(router.query.tab);
  const addressHash = getQueryParamString(router.query.hash);
  const isProxy = tab === 'write_proxy';
  const isCustomAbi = tab === 'write_custom_methods';

  const { data, isPending, isError } = useApiQuery(isProxy ? 'contract_methods_write_proxy' : 'contract_methods_write', {
    pathParams: { hash: addressHash },
    queryParams: {
      is_custom_abi: isCustomAbi ? 'true' : 'false',
    },
    queryOptions: {
      enabled: !isLoading,
      refetchOnMount: false,
    },
  });

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (isPending) {
    return <ContentLoader/>;
  }

  if (data.length === 0 && !isProxy) {
    return <span>No public write functions were found for this contract.</span>;
  }

  return (
    <>
      { isCustomAbi && <ContractCustomAbiAlert/> }
      { config.features.blockchainInteraction.isEnabled && <ContractConnectWallet/> }
      { isProxy && <ContractImplementationAddress hash={ addressHash }/> }
      <ContractAbi data={ data } addressHash={ addressHash } tab={ tab } methodType="write"/>
    </>
  );
};

export default React.memo(ContractWrite);

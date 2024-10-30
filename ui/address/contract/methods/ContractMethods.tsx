import { useRouter } from 'next/router';
import React from 'react';

import type { MethodType, SmartContractMethod } from './types';

import getQueryParamString from 'lib/router/getQueryParamString';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import ContractAbi from './ContractAbi';

interface Props {
  abi: Array<SmartContractMethod>;
  isLoading?: boolean;
  isError?: boolean;
  type: MethodType;
  sourceAddress?: string;
}

const ContractMethods = ({ abi, isLoading, isError, type, sourceAddress }: Props) => {

  const router = useRouter();

  const tab = getQueryParamString(router.query.tab);
  const addressHash = getQueryParamString(router.query.hash);

  if (isLoading) {
    return <ContentLoader/>;
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (abi.length === 0) {
    const typeText = type === 'all' ? '' : type;
    return <span>No public { typeText } functions were found for this contract.</span>;
  }

  return <ContractAbi abi={ abi } tab={ tab } addressHash={ addressHash } sourceAddress={ sourceAddress }/>;
};

export default React.memo(ContractMethods);

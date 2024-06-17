import { Box } from '@chakra-ui/react';
import React from 'react';

import type { MethodType } from './ABI/types';
import type { AddressImplementation } from 'types/api/addressParams';

import useApiQuery from 'lib/api/useApiQuery';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import ContractImplementationAddress from './ContractImplementationAddress';
import ContractMethods from './ContractMethods';
import { isReadMethod, isWriteMethod } from './utils';

interface Props {
  type: MethodType;
  addressHash: string | undefined;
  implementations: Array<AddressImplementation>;
}

const ContractMethodsProxy = ({ type, addressHash, implementations }: Props) => {

  const [ selectedImplementation ] = React.useState(implementations[0].address);

  const contractQuery = useApiQuery('contract', {
    pathParams: { hash: selectedImplementation },
    queryOptions: {
      enabled: Boolean(selectedImplementation),
      refetchOnMount: false,
    },
  });

  const content = (() => {
    if (contractQuery.isPending) {
      return <ContentLoader/>;
    }

    if (contractQuery.isError) {
      return <DataFetchAlert/>;
    }

    const data = contractQuery.data.abi?.filter(type === 'read' ? isReadMethod : isWriteMethod) || [];

    return <ContractMethods abi={ data } type={ type }/>;
  })();

  return (
    <Box>
      <ContractImplementationAddress hash={ addressHash }/>
      { content }
    </Box>
  );
};

export default React.memo(ContractMethodsProxy);

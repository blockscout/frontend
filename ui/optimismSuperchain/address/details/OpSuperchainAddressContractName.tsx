import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import { route } from 'nextjs-routes';

import * as contract from 'lib/multichain/contract';
import shortenString from 'lib/shortenString';
import { Badge } from 'toolkit/chakra/badge';
import { Link } from 'toolkit/chakra/link';

import OpSuperchainAddressInfoBreakdown from './OpSuperchainAddressInfoBreakdown';

interface Props {
  data: multichain.GetAddressResponse | undefined;
  isLoading: boolean;
}

const OpSuperchainAddressContractName = ({ data, isLoading }: Props) => {
  if (!data?.chain_infos) {
    return null;
  }

  const contractName = contract.getName(data);

  return (
    <>
      { contractName && <Link href={ route({ pathname: '/address/[hash]', query: { hash: data.hash, tab: 'contract' } }) }>{ contractName }</Link> }
      <OpSuperchainAddressInfoBreakdown data={ data?.chain_infos } loading={ isLoading } ml={ 2 }>
        { ([ , chainInfo ]) => {
          const badge = (() => {
            if (chainInfo.is_verified) {
              return <Badge colorPalette="green" ml={ 2 }>Verified</Badge>;
            }
            return (
              <Badge colorPalette="gray" ml={ 2 }>
                { chainInfo.is_contract ? 'Non-verified' : 'Not a contract' }
              </Badge>
            );
          })();

          return (
            <>
              { chainInfo.contract_name || shortenString(data.hash) }
              { badge }
            </>
          );
        } }
      </OpSuperchainAddressInfoBreakdown>
    </>
  );
};

export default React.memo(OpSuperchainAddressContractName);

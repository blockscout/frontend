import React from 'react';

import { route } from 'nextjs/routes';

import multichainConfig from 'configs/multichain';
import { Link } from 'toolkit/chakra/link';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import TextSeparator from 'ui/shared/TextSeparator';

import ChainIcon from '../components/ChainIcon';

interface Props {
  addressHash: string;
}

const OpSuperchainAddressDetails = ({ addressHash }: Props) => {
  const chains = multichainConfig()?.chains;

  return (
    <DetailedInfo.Container templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }} >
      { chains && chains.length > 0 && (
        <>
          <DetailedInfo.ItemLabel
            hint="Chains"
          >
            Chain{ chains.length > 1 ? 's' : '' }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue columnGap={ 3 }>
            { chains.map((chain) => (
              <Link
                key={ chain.slug }
                href={ chain.config.app.baseUrl + route({ pathname: '/address/[hash]', query: { hash: addressHash } }) }
                external
                display="flex"
                alignItems="center"
                color="text.primary"
                _hover={{ color: 'link.primary.hover' }}
              >
                <ChainIcon data={ chain } mr={ 2 }/>
                { chain.config.chain.name }
              </Link>
            )) }
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemLabel
        hint="Number of transactions related to this address"
      >
        Transactions
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue whiteSpace="pre-wrap">
        Cross-chain 🐈🐈🐈
        <TextSeparator color="border.divider"/>
        Local <Link href={ route({ pathname: '/address/[hash]', query: { hash: addressHash, tab: 'txs_local' } }) }>view by chain</Link>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="Number of transfers to/from this address"
      >
        Transfers
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue whiteSpace="pre-wrap">
        Cross-chain 🦆🦆🦆
        <TextSeparator color="border.divider"/>
        Local <Link href={ route({ pathname: '/address/[hash]', query: { hash: addressHash, tab: 'token_transfers_local' } }) }>view by chain</Link>
      </DetailedInfo.ItemValue>

    </DetailedInfo.Container>
  );
};

export default React.memo(OpSuperchainAddressDetails);

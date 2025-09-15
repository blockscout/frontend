import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import { route } from 'nextjs/routes';

import multichainConfig from 'configs/multichain';
import getCurrencySymbol from 'lib/multichain/getCurrencySymbol';
import { Link } from 'toolkit/chakra/link';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoSponsoredItem from 'ui/shared/DetailedInfo/DetailedInfoSponsoredItem';
import TextSeparator from 'ui/shared/TextSeparator';

import ChainIcon from '../components/ChainIcon';

interface Props {
  data: multichain.GetAddressResponse | undefined;
  addressHash: string;
  isLoading: boolean;
}

const OpSuperchainAddressDetails = ({ data, addressHash, isLoading }: Props) => {
  const chains = multichainConfig()?.chains;
  const activeChainsIds = Object.keys(data?.chain_infos ?? {});
  const activeChains = chains?.filter((chain) => activeChainsIds.includes(String(chain.config.chain.id))) ?? [];

  const currencySymbol = getCurrencySymbol();

  if (!data && !isLoading) {
    return null;
  }

  return (
    <DetailedInfo.Container templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }} >
      { (isLoading || activeChains.length > 0) && (
        <>
          <DetailedInfo.ItemLabel
            hint="Chains this address has interacted with"
            isLoading={ isLoading }
          >
            Chain{ activeChains.length > 1 ? 's' : '' }
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue columnGap={ 3 } multiRow>
            { activeChains.map((chain) => (
              <Link
                key={ chain.slug }
                href={ chain.config.app.baseUrl + route({ pathname: '/address/[hash]', query: { hash: addressHash } }) }
                external
                loading={ isLoading }
                display="flex"
                alignItems="center"
                color="text.primary"
                _hover={{ color: 'link.primary.hover' }}
              >
                <ChainIcon data={ chain } mr={ 2 }/>
                <span>{ chain.config.chain.name }</span>
              </Link>
            )) }
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemLabel
        hint="The name found in the source code of the Contract"
        isLoading={ isLoading }
      >
        Contract name
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Link href={ route({ pathname: '/address/[hash]', query: { hash: addressHash, tab: 'contract' } }) }>View by chain</Link>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint={ `${ currencySymbol } balance` }
        isLoading={ isLoading }
      >
        { currencySymbol } balance
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        Coming soon 🔜
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="All tokens in the account and total value"
        isLoading={ isLoading }
      >
        Tokens
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        Coming soon 🔜
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="Number of transactions related to this address"
        isLoading={ isLoading }
      >
        Transactions
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue whiteSpace="pre-wrap">
        Cross-chain <Link href={ route({ pathname: '/address/[hash]', query: { hash: addressHash, tab: 'txs_cross_chain' } }) }>TBD</Link>
        <TextSeparator color="border.divider"/>
        Local <Link href={ route({ pathname: '/address/[hash]', query: { hash: addressHash, tab: 'txs_local' } }) }>view by chain</Link>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="Number of transfers to/from this address"
        isLoading={ isLoading }
      >
        Transfers
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue whiteSpace="pre-wrap">
        Cross-chain <Link href={ route({ pathname: '/address/[hash]', query: { hash: addressHash, tab: 'token_transfers_cross_chain' } }) }>TBD</Link>
        <TextSeparator color="border.divider"/>
        Local <Link href={ route({ pathname: '/address/[hash]', query: { hash: addressHash, tab: 'token_transfers_local' } }) }>view by chain</Link>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="Block number in which the address was updated"
        isLoading={ isLoading }
      >
        Last balance update
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        Coming soon 🔜
      </DetailedInfo.ItemValue>

      <DetailedInfoSponsoredItem isLoading={ isLoading }/>

    </DetailedInfo.Container>
  );
};

export default React.memo(OpSuperchainAddressDetails);

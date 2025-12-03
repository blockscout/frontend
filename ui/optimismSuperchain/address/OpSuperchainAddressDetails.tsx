import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import { route } from 'nextjs/routes';

import multichainConfig from 'configs/multichain';
import getCurrencySymbol from 'lib/multichain/getCurrencySymbol';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoSponsoredItem from 'ui/shared/DetailedInfo/DetailedInfoSponsoredItem';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';

import OpSuperchainAddressCoinBalance from './details/OpSuperchainAddressCoinBalance';
import OpSuperchainAddressContractName from './details/OpSuperchainAddressContractName';
import OpSuperchainAddressNetWorth from './details/OpSuperchainAddressNetWorth';
import OpSuperchainTokenSelect from './tokens/OpSuperchainTokenSelect';
import useFetchTokens from './tokens/useFetchTokens';

interface Props {
  data: multichain.GetAddressResponse | undefined;
  addressHash: string;
  isLoading: boolean;
}

const OpSuperchainAddressDetails = ({ data, addressHash, isLoading }: Props) => {
  const chains = multichainConfig()?.chains;
  const activeChainsIds = Object.keys(data?.chain_infos ?? {});
  const activeChains = chains?.filter((chain) => activeChainsIds.includes(String(chain.id))) ?? [];

  const currencySymbol = getCurrencySymbol();

  const tokensInfo = useFetchTokens({ hash: addressHash, enabled: data?.has_tokens && !isLoading });

  if (!data && !isLoading) {
    return null;
  }

  const isContract = Object.values(data?.chain_infos ?? {}).some((chainInfo) => chainInfo.is_contract);

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
                key={ chain.id }
                href={ route({
                  pathname: '/address/[hash]',
                  query: {
                    hash: addressHash,
                    utm_source: 'multichain-explorer',
                    utm_medium: 'address',
                  },
                }, { chain, external: true }) }
                external
                loading={ isLoading }
                display="flex"
                alignItems="center"
                color="text.primary"
                _hover={{ color: 'link.primary.hover' }}
              >
                <ChainIcon data={ chain } mr={ 2 }/>
                <span>{ chain.name }</span>
              </Link>
            )) }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { isContract && (
        <>
          <DetailedInfo.ItemLabel
            hint="The name found in the source code of the Contract"
            isLoading={ isLoading }
          >
            Contract name
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <OpSuperchainAddressContractName data={ data } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemLabel
        hint={ `${ currencySymbol } balance` }
        isLoading={ isLoading }
      >
        { currencySymbol } balance
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <OpSuperchainAddressCoinBalance data={ data } isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>

      { data?.has_tokens && (
        <>
          <DetailedInfo.ItemLabel
            hint="All tokens in the account and total value"
            isLoading={ isLoading }
          >
            Tokens
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <OpSuperchainTokenSelect isLoading={ isLoading || tokensInfo.isPending } isError={ tokensInfo.isError } data={ tokensInfo.data }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      <DetailedInfo.ItemLabel
        hint="Total net worth in USD of native coin and all tokens for the address"
        isLoading={ isLoading }
      >
        Net worth
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <OpSuperchainAddressNetWorth
          addressData={ data }
          tokensData={ tokensInfo.data }
          isLoading={ isLoading || Boolean(tokensInfo.isPending && data?.has_tokens) }
          isError={ tokensInfo.isError }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="Number of transactions related to this address"
        isLoading={ isLoading }
      >
        Transactions
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue whiteSpace="pre-wrap">
        <Skeleton loading={ isLoading }>
          <Link href={ route({ pathname: '/address/[hash]', query: { hash: addressHash, tab: 'txs_local' } }) }>View by chain</Link>
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        hint="Number of transfers to/from this address"
        isLoading={ isLoading }
      >
        Transfers
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue whiteSpace="pre-wrap">
        <Skeleton loading={ isLoading }>
          <Link href={ route({ pathname: '/address/[hash]', query: { hash: addressHash, tab: 'token_transfers_local' } }) }>View by chain</Link>
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfoSponsoredItem isLoading={ isLoading }/>

    </DetailedInfo.Container>
  );
};

export default React.memo(OpSuperchainAddressDetails);

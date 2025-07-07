import React from 'react';

import { route } from 'nextjs/routes';

import multichainConfig from 'configs/multichain';
import getIconUrl from 'lib/multichain/getIconUrl';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import TextSeparator from 'ui/shared/TextSeparator';

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
            Chains
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue columnGap={ 3 }>
            { chains.map((chain) => (
              <Link
                key={ chain.slug }
                display="flex"
                alignItems="center"
                gap={ 2 }
                href={ route({ pathname: '/chain/[chain-slug]/address/[hash]', query: { hash: addressHash, 'chain-slug': chain.slug } }) }
              >
                <Image src={ getIconUrl(chain) } boxSize={ 5 } borderRadius="full"/>
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

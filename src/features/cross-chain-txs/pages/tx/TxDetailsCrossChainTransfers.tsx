// SPDX-License-Identifier: LicenseRef-Blockscout

import { route } from 'nextjs-routes';
import React from 'react';

import { useMultichainContext } from 'src/features/multichain/context';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import { Link } from 'src/toolkit/chakra/link';

import useTxCrossChainTransfersQuery from '../../hooks/useTxCrossChainTransfersQuery';

interface Props {
  hash: string;
  isLoading: boolean;
}

const TxDetailsCrossChainTransfers = ({ hash, isLoading: isLoadingProp }: Props) => {

  const { data, isPending } = useTxCrossChainTransfersQuery({ hash });
  const multichainContext = useMultichainContext();

  const isLoading = isLoadingProp || isPending;

  if ((!isPending && (!data || !data.items.length)) || !(multichainContext?.chain.app_config ?? config).features.crossChainTxs.isEnabled) {
    return null;
  }

  const text = (() => {
    if (!data) {
      return '0';
    }

    return data.next_page_params ? '50+' : data.items.length;
  })();

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Number of cross-chain transfers in this transaction"
        isLoading={ isLoading }
      >
        Cross-chain transfers
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Link
          href={ route({ pathname: '/tx/[hash]', query: { hash, tab: 'token_transfers_cross_chain' } }) }
          loading={ isLoading }
        >
          { text }
        </Link>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsCrossChainTransfers);

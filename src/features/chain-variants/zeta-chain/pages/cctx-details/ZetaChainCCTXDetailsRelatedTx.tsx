// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import { type RelatedCctx, CctxStatusReduced } from '@blockscout/zetachain-cctx-types';

import TxEntityZetaChainCC from 'src/features/chain-variants/zeta-chain/components/TxEntityZetaChainCC';
import ZetaChainCCTXReducedStatus from 'src/features/chain-variants/zeta-chain/components/ZetaChainCCTXReducedStatus';
import useZetaChainConfig from 'src/features/chain-variants/zeta-chain/hooks/useZetaChainConfig';

import ChainIcon from 'src/shared/external-chains/ChainIcon';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

type Props = {
  tx: RelatedCctx;
  isLoading: boolean;
};

const ZetaChainCCTXDetailsRelatedTx = ({ tx, isLoading }: Props) => {
  const { data: chainsConfig } = useZetaChainConfig();
  const chainFrom = chainsConfig?.find((chain) => chain.id === tx.source_chain_id.toString());

  const chainsTo = tx.outbound_params.map((p) => chainsConfig?.find((chain) => chain.id === p.chain_id.toString()));

  const color = (() => {
    if (tx.status_reduced === CctxStatusReduced.SUCCESS) {
      return 'text.success';
    }
    if (tx.status_reduced === CctxStatusReduced.FAILED) {
      return 'text.error';
    }
    return 'text.secondary';
  })();

  return (
    <Skeleton
      display="flex"
      gap={ 2 }
      alignItems="center"
      loading={ isLoading }
      color={ color }
      maxH="20px"
    >
      <ChainIcon data={ chainFrom }/>
      <SpriteIcon name="arrows/east" boxSize={ 5 } color="text.secondary"/>
      { chainsTo.map((chain, index) => <ChainIcon key={ index } data={ chain }/>) }
      <Box>CCTX</Box>
      <TxEntityZetaChainCC hash={ tx.index } isLoading={ isLoading } noIcon truncation="constant"/>
      <ZetaChainCCTXReducedStatus status={ tx.status_reduced } isLoading={ isLoading } type="full"/>
    </Skeleton>
  );
};

export default ZetaChainCCTXDetailsRelatedTx;

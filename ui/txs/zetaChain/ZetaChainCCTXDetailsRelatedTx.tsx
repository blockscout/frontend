import { Box } from '@chakra-ui/react';
import React from 'react';

import type { ZetaChainRelatedCCTX } from 'types/api/zetaChain';

import { Skeleton } from 'toolkit/chakra/skeleton';
import ChainIconWithTooltip from 'ui/shared/ChainIconWithTooltip';
import CCTxEntityZetaChain from 'ui/shared/entities/tx/CCTxEntityZetaChain';
import IconSvg from 'ui/shared/IconSvg';
import ZetaChainCCTXReducedStatus from 'ui/shared/zetaChain/ZetaChainCCTXReducedStatus';
import useZetaChainConfig from 'ui/zetaChain/useZetaChainConfig';

type Props = {
  tx: ZetaChainRelatedCCTX;
  isLoading: boolean;
};

const ZetaChainCCTXDetailsRelatedTx = ({ tx, isLoading }: Props) => {
  const { data: chainsConfig } = useZetaChainConfig();
  const chainFrom = chainsConfig?.find((chain) => chain.chain_id === tx.source_chain_id);

  const chainsTo = tx.outbound_params.map((p) => chainsConfig?.find((chain) => chain.chain_id === p.chain_id));

  const color = (() => {
    if (tx.status_reduced === 'SUCCESS') {
      return 'text.success';
    }
    if (tx.status_reduced === 'FAILED') {
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
      <ChainIconWithTooltip chain={ chainFrom }/>
      <IconSvg name="arrows/east" boxSize={ 5 } color="text.secondary"/>
      { chainsTo.map((chain, index) => <ChainIconWithTooltip key={ index } chain={ chain }/>) }
      <Box>CCTX</Box>
      <CCTxEntityZetaChain hash={ tx.index } isLoading={ isLoading } noIcon truncation="constant" noCopy={ false }/>
      <ZetaChainCCTXReducedStatus status={ tx.status_reduced } isLoading={ isLoading } type="full"/>
    </Skeleton>
  );
};

export default ZetaChainCCTXDetailsRelatedTx;

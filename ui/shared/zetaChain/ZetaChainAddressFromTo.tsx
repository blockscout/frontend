import React from 'react';

import type { ZetaChainCCTX } from 'types/api/zetaChain';

import config from 'configs/app';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import { unknownAddress } from 'ui/shared/address/utils';
import useZetaChainConfig from 'ui/zetaChain/useZetaChainConfig';

const ZetaChainAddressFromTo = ({ tx, isLoading }: { tx: ZetaChainCCTX; isLoading?: boolean }) => {
  const { data: chainsConfig } = useZetaChainConfig();

  const senderChain = tx.source_chain_id === config.chain.id ? undefined :
    (chainsConfig?.find((chain) => chain.chain_id.toString() === tx.source_chain_id) || null);
  const receiverChain = tx.target_chain_id === config.chain.id ? undefined :
    (chainsConfig?.find((chain) => chain.chain_id.toString() === tx.target_chain_id) || null);

  return (
    <AddressFromTo
      from={{ ...unknownAddress, hash: tx.sender_address }}
      to={{ ...unknownAddress, hash: tx.receiver_address }}
      isLoading={ isLoading }
      chainFrom={ senderChain }
      chainTo={ receiverChain }
    />
  );
};

export default React.memo(ZetaChainAddressFromTo);

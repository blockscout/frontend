// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import getSocketUrl from 'client/api/get-socket-url';
import { SocketProvider } from 'client/api/socket/context';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'client/shell/page/action-bar/ActionBar';

import type { Props as BlocksContentProps } from 'client/slices/block/pages/index/BlocksContent';
import BlocksContent from 'client/slices/block/pages/index/BlocksContent';

import { MultichainProvider } from 'client/features/multichain/context';

import multichainConfig from 'configs/multichain';

interface Props extends BlocksContentProps {
  chainId: string | undefined;
}

const MultichainBlocksContent = ({ chainId, ...rest }: Props) => {
  const chainConfig = multichainConfig()?.chains.find(chain => chain.id === chainId);

  return (
    <MultichainProvider chainId={ chainId }>
      <SocketProvider url={ chainConfig ? getSocketUrl(chainConfig.app_config) : undefined }>
        <BlocksContent
          { ...rest }
          top={ ACTION_BAR_HEIGHT_DESKTOP }
        />
      </SocketProvider>
    </MultichainProvider>
  );
};

export default React.memo(MultichainBlocksContent);

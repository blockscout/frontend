// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import getSocketUrl from 'src/api/get-socket-url';
import { SocketProvider } from 'src/api/socket/context';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import type { Props as BlocksContentProps } from 'src/slices/block/pages/index/BlocksContent';
import BlocksContent from 'src/slices/block/pages/index/BlocksContent';

import multichainConfig from 'src/features/multichain/chains-config';
import { MultichainProvider } from 'src/features/multichain/context';

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

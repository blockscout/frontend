import React from 'react';

import multichainConfig from 'configs/multichain';
import getSocketUrl from 'lib/api/getSocketUrl';
import { MultichainProvider } from 'lib/contexts/multichain';
import { SocketProvider } from 'lib/socket/context';
import type { Props as BlocksContentProps } from 'ui/blocks/BlocksContent';
import BlocksContent from 'ui/blocks/BlocksContent';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';

interface Props extends BlocksContentProps {
  chainSlug: string | undefined;
}

const OpSuperchainBlocksContent = ({ chainSlug, ...rest }: Props) => {
  const chainConfig = multichainConfig()?.chains.find(chain => chain.slug === chainSlug);

  return (
    <MultichainProvider chainSlug={ chainSlug }>
      <SocketProvider url={ chainConfig ? getSocketUrl(chainConfig.config) : undefined }>
        <BlocksContent
          { ...rest }
          top={ ACTION_BAR_HEIGHT_DESKTOP }
        />
      </SocketProvider>
    </MultichainProvider>
  );
};

export default React.memo(OpSuperchainBlocksContent);

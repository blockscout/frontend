// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Separator } from '@chakra-ui/react';
import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { IconButton } from 'src/toolkit/chakra/icon-button';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

import { useCustomRpcNodeStatus } from './settings/fields/rpc-node/useCustomRpcNodeStatus';
import { useSettingsModalContext } from './settings/modal/context';

const TopBarCustomRpc = () => {
  const customRpc = useCustomRpcNodeStatus();
  const settingsModal = useSettingsModalContext();

  const handleClick = React.useCallback(() => {
    settingsModal?.open('rpc-node');
  }, [ settingsModal ]);

  if (!customRpc) {
    return null;
  }

  const { status, isPending } = customRpc;
  const tooltipContent = (
    <>
      <div>Custom RPC: { status.tag.label }</div>
      { status.alert?.text && <div>{ status.alert?.text }</div> }
    </>
  );

  return (
    <Flex alignItems="center">
      <Tooltip content={ tooltipContent } disabled={ isPending }>
        <IconButton
          aria-label="Custom RPC node"
          variant="link"
          size="2xs"
          borderRadius="none"
          color={ isPending ? 'icon.secondary' : status.plug.color }
          _hover={{ color: isPending ? 'icon.secondary' : status.plug.color, opacity: 0.8 }}
          onClick={ handleClick }
        >
          <SpriteIcon name={ status.plug.icon }/>
        </IconButton>
      </Tooltip>
      <Separator orientation="vertical" mx={ 2 } h={ 4 }/>
    </Flex>
  );
};

export default React.memo(TopBarCustomRpc);

// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import { useCustomRpcNodeStatus } from 'src/shell/top-bar/settings/fields/rpc-node/useCustomRpcNodeStatus';
import { useSettingsModalContext } from 'src/shell/top-bar/settings/modal/context';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Button } from 'src/toolkit/chakra/button';

interface Props {
  isLoading?: boolean;
}

const CustomRpcAlert = ({ isLoading }: Props) => {
  const customRpc = useCustomRpcNodeStatus();
  const settingsModal = useSettingsModalContext();

  const handleClick = React.useCallback(() => {
    settingsModal?.open('rpc-node');
  }, [ settingsModal ]);

  if (!customRpc) {
    return null;
  }

  const { status, isPending } = customRpc;

  return (
    <Button
      cursor="pointer"
      aria-label={ `Custom RPC: ${ status.tag.label }` }
      onClick={ handleClick }
      loadingSkeleton={ isLoading || isPending }
      variant="dropdown"
      selected
      textStyle="sm"
      fontWeight="medium"
      h="auto"
    >
      <SpriteIcon name={ status.plug.icon } boxSize={ 5 } color={ status.plug.color }/>
      <chakra.span hideBelow="lg">Custom RPC</chakra.span>
    </Button>
  );
};

export default React.memo(CustomRpcAlert);

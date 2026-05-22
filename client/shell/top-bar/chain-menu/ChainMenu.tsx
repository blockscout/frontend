// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { Button } from 'toolkit/chakra/button';
import { PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import IconSvg from 'ui/shared/IconSvg';

import ChainMenuContent from './ChainMenuContent';
import useChainMenu from './useChainMenu';

const ChainMenu = () => {
  const menu = useChainMenu();

  const handlePopoverOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    menu.onOpenChange({ open });
  }, [ menu ]);

  return (
    <PopoverRoot
      positioning={{ placement: 'bottom-start', offset: { mainAxis: 6 } }}
      lazyMount
      open={ menu.open }
      onOpenChange={ handlePopoverOpenChange }
    >
      <PopoverTrigger>
        <Button
          variant="link"
          aria-label="Network menu"
          onClick={ menu.onToggle }
          size="2xs"
          fontWeight={ 500 }
        >
          <IconSvg name="networks" boxSize="14px"/>
          <span>Chains</span>
          <IconSvg name="arrows/east-mini" boxSize={ 4 } transform="rotate(-90deg)"/>
        </Button>
      </PopoverTrigger>
      <ChainMenuContent items={ menu.data } tabs={ menu.availableTabs }/>
    </PopoverRoot>
  );
};

export default React.memo(ChainMenu);

// SPDX-License-Identifier: LicenseRef-Blockscout

'use client';

import { Menu as ChakraMenu, Portal } from '@chakra-ui/react';
import * as React from 'react';

interface MenuContentProps extends ChakraMenu.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
}

export const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(
  function MenuContent(props, ref) {
    const { portalled = true, portalRef, ...rest } = props;
    return (
      <Portal disabled={ !portalled } container={ portalRef }>
        <ChakraMenu.Positioner>
          <ChakraMenu.Content ref={ ref } { ...rest }/>
        </ChakraMenu.Positioner>
      </Portal>
    );
  },
);

export const MenuArrow = React.forwardRef<
  HTMLDivElement,
  ChakraMenu.ArrowProps
>(function MenuArrow(props, ref) {
  return (
    <ChakraMenu.Arrow ref={ ref } { ...props }>
      <ChakraMenu.ArrowTip/>
    </ChakraMenu.Arrow>
  );
});

export const MenuItemGroup = React.forwardRef<
  HTMLDivElement,
  ChakraMenu.ItemGroupProps
>(function MenuItemGroup(props, ref) {
  const { title, children, ...rest } = props;
  return (
    <ChakraMenu.ItemGroup ref={ ref } { ...rest }>
      { title && (
        <ChakraMenu.ItemGroupLabel userSelect="none">
          { title }
        </ChakraMenu.ItemGroupLabel>
      ) }
      { children }
    </ChakraMenu.ItemGroup>
  );
});

export interface MenuTriggerItemProps extends ChakraMenu.ItemProps {
  startIcon?: React.ReactNode;
}

export const MenuRadioItemGroup = ChakraMenu.RadioItemGroup;
export const MenuContextTrigger = ChakraMenu.ContextTrigger;
export const MenuRoot = (props: ChakraMenu.RootProps) => {
  const { lazyMount = true, unmountOnExit = true, ...rest } = props;
  const positioning = {
    placement: 'bottom-start' as const,
    ...props.positioning,
    offset: {
      mainAxis: 4,
      ...props.positioning?.offset,
    },
  };

  return <ChakraMenu.Root { ...rest } positioning={ positioning } lazyMount={ lazyMount } unmountOnExit={ unmountOnExit }/>;
};
export const MenuSeparator = ChakraMenu.Separator;

export const MenuItem = ChakraMenu.Item;
export const MenuItemText = ChakraMenu.ItemText;
export const MenuItemCommand = ChakraMenu.ItemCommand;
export const MenuTrigger = ChakraMenu.Trigger;

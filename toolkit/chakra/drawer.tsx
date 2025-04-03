import { Drawer as ChakraDrawer, Portal } from '@chakra-ui/react';
import * as React from 'react';

import { CloseButton } from './close-button';

interface DrawerContentProps extends ChakraDrawer.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  offset?: ChakraDrawer.ContentProps['padding'];
}

export const DrawerContent = React.forwardRef<
  HTMLDivElement,
  DrawerContentProps
>(function DrawerContent(props, ref) {
  const { children, portalled = true, portalRef, offset, ...rest } = props;
  return (
    <Portal disabled={ !portalled } container={ portalRef }>
      <ChakraDrawer.Positioner padding={ offset }>
        <ChakraDrawer.Content ref={ ref } { ...rest } asChild={ false }>
          { children }
        </ChakraDrawer.Content>
      </ChakraDrawer.Positioner>
    </Portal>
  );
});

export const DrawerCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraDrawer.CloseTriggerProps
>(function DrawerCloseTrigger(props, ref) {
  return (
    <ChakraDrawer.CloseTrigger
      position="absolute"
      top="2"
      insetEnd="2"
      { ...props }
      asChild
    >
      <CloseButton ref={ ref }/>
    </ChakraDrawer.CloseTrigger>
  );
});

const EMPTY_ELEMENT = () => null;

export const DrawerRoot = (props: ChakraDrawer.RootProps) => {
  const { initialFocusEl = EMPTY_ELEMENT, ...rest } = props;
  return <ChakraDrawer.Root { ...rest } initialFocusEl={ initialFocusEl }/>;
};

export const DrawerTrigger = (props: ChakraDrawer.TriggerProps) => {
  const { asChild = true, ...rest } = props;
  return <ChakraDrawer.Trigger asChild={ asChild } { ...rest }/>;
};

export const DrawerFooter = ChakraDrawer.Footer;
export const DrawerHeader = ChakraDrawer.Header;
export const DrawerBody = ChakraDrawer.Body;
export const DrawerBackdrop = ChakraDrawer.Backdrop;
export const DrawerDescription = ChakraDrawer.Description;
export const DrawerTitle = ChakraDrawer.Title;
export const DrawerActionTrigger = ChakraDrawer.ActionTrigger;

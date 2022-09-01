import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { Modal as ModalComponent } from '@chakra-ui/react';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';
import { mode, runIfFn } from '@chakra-ui/theme-tools';

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyleDialog = defineStyle((props) => {
  return {
    padding: 8,
    borderRadius: 'lg',
    bg: mode('white', 'gray.900')(props),
    margin: 'auto',
  };
});

const baseStyleDialogContainer = defineStyle({
  '::-webkit-scrollbar': { display: 'none' },
  'scrollbar-width': 'none',
  '@supports (height: -webkit-fill-available)': { height: '100vh' },
});

const baseStyleHeader = defineStyle((props) => ({
  padding: 0,
  marginBottom: 8,
  fontSize: '2xl',
  lineHeight: 10,
  color: mode('blackAlpha.800', 'whiteAlpha.800')(props),
}));

const baseStyleBody = defineStyle({
  padding: 0,
  marginBottom: 8,
});

const baseStyleFooter = defineStyle({
  padding: 0,
  justifyContent: 'flex-start',
});

const baseStyleCloseButton = defineStyle((props) => {
  return {
    top: 8,
    right: 8,
    height: 10,
    width: 10,
    color: mode('gray.700', 'gray.500')(props),
    _hover: { color: 'blue.400' },
    _active: { bg: 'none' },
  };
});

const baseStyleOverlay = defineStyle({
  bg: 'blackAlpha.800',
});

const baseStyle = definePartsStyle((props) => ({
  dialog: runIfFn(baseStyleDialog, props),
  dialogContainer: baseStyleDialogContainer,
  header: runIfFn(baseStyleHeader, props),
  body: baseStyleBody,
  footer: baseStyleFooter,
  closeButton: runIfFn(baseStyleCloseButton, props),
  overlay: baseStyleOverlay,
}));

const sizes = {
  md: definePartsStyle({
    dialog: {
      maxW: '760px',
    },
  }),
  full: definePartsStyle({
    dialog: {
      maxW: '100vw',
      minH: '100vh',
      my: '0',
      borderRadius: '0',
    },
  }),
};

const Modal = defineMultiStyleConfig({
  sizes,
  baseStyle,
});

export default Modal;

ModalComponent.defaultProps = {
  ...ModalComponent.defaultProps,
  isCentered: true,
};

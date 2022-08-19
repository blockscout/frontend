import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';
import type { PartsStyleFunction, SystemStyleFunction } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

const baseStyleDialog: SystemStyleFunction = (props) => {
  return {
    padding: 8,
    borderRadius: 'lg',
    bg: mode('white', 'gray.900')(props),
  };
};

const baseStyleHeader: SystemStyleFunction = (props) => ({
  padding: 0,
  marginBottom: 8,
  fontSize: '2xl',
  lineHeight: 10,
  color: mode('blackAlpha.800', 'whiteAlpha.800')(props),
});

const baseStyleBody = {
  padding: 0,
  marginBottom: 8,
};

const baseStyleFooter = {
  padding: 0,
  justifyContent: 'flex-start',
};

const baseStyleCloseButton: SystemStyleFunction = (props) => {
  return {
    top: 8,
    right: 8,
    height: 10,
    width: 10,
    color: mode('gray.700', 'gray.500')(props),
    _hover: { color: 'blue.400' },
    _active: { bg: 'none' },
  };
};
const baseStyleOverlay = {
  bg: 'blackAlpha.800',
};

const baseStyle: PartsStyleFunction<typeof parts> = (props) => ({
  dialog: baseStyleDialog(props),
  header: baseStyleHeader(props),
  body: baseStyleBody,
  footer: baseStyleFooter,
  closeButton: baseStyleCloseButton(props),
  overlay: baseStyleOverlay,
});

const sizes = {
  md: {
    dialog: {
      maxW: '760px',
    },
  },
};

const Modal: ComponentMultiStyleConfig = {
  parts: parts.keys,
  sizes,
  baseStyle,
};

Modal.defaultProps = { isCentered: true };

export default Modal;

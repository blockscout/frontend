import type { ComponentMultiStyleConfig } from '@chakra-ui/theme';

const Modal: ComponentMultiStyleConfig = {
  parts: [ ],
  sizes: {
    md: {
      dialog: {
        maxW: '760px',
      },
    },
  },
  baseStyle: {
    dialog: {
      padding: 8,
      borderRadius: 'lg',
    },
    header: {
      padding: 0,
      marginBottom: 8,
      fontSize: '2xl',
      lineHeight: 10,
    },
    body: {
      padding: 0,
      marginBottom: 8,
    },
    footer: {
      padding: 0,
      justifyContent: 'flex-start',
    },
    closeButton: {
      top: 8,
      right: 8,
      height: 10,
      width: 10,
      color: 'gray.700',
      _hover: { color: 'blue.400' },
      _active: { bg: 'none' },
    },
  },
}

export default Modal;

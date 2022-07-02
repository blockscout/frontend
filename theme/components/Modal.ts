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
    },
    body: {
      padding: 0,
      marginBottom: 8,
    },
    footer: {
      padding: 0,
    },
    closeButton: {
      top: '40px',
      right: '40px',
      color: 'blue.500',
    },
  },
}

export default Modal;

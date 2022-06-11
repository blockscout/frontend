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
      padding: '40px',
      borderRadius: '30px',
    },
    header: {
      padding: 0,
      marginBottom: '20px',
      fontSize: '24px',
    },
    body: {
      padding: 0,
      marginBottom: '40px',
    },
    footer: {
      padding: 0,
    },
    closeButton: {
      top: '40px',
      right: '40px',
    },
  },
}

export default Modal;

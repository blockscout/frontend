import { mode } from '@chakra-ui/theme-tools';
import type { StyleFunctionProps } from '@chakra-ui/theme-tools';

const styles = (props: StyleFunctionProps) => {
  return {
    '.address-entity': {
      '&.address-entity_highlighted': {
        _before: {
          content: `" "`,
          position: 'absolute',
          py: 1,
          pl: 1,
          pr: 0,
          top: '-5px',
          left: '-5px',
          width: `100%`,
          height: '100%',
          borderRadius: 'base',
          borderColor: mode('blue.200', 'blue.600')(props),
          borderWidth: '1px',
          borderStyle: 'dashed',
          bgColor: mode('blue.50', 'blue.900')(props),
          zIndex: -1,
        },
      },
    },
    '.address-entity_no-copy': {
      '&.address-entity_highlighted': {
        _before: {
          pr: 2,
        },
      },
    },
  };
};

export default styles;

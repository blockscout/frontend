import { mode } from '@chakra-ui/theme-tools';
import type { StyleFunctionProps } from '@chakra-ui/theme-tools';

import colors from 'theme/foundations/colors';

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
          borderColor: mode('blue.200', colors.grayTrue[200])(props), //'blue.600'
          borderWidth: '1px',
          borderStyle: 'dashed',
          bgColor: mode('blue.50', colors.grayTrue[700])(props), //'blue.900'
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

import { getCSSVar } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';
import type { StyleFunctionProps } from '@chakra-ui/theme-tools';

const scrollbar = (props: StyleFunctionProps) => {
  const bgColor = mode('blackAlpha.300', 'whiteAlpha.300')(props);
  const resizerUrl = mode('url(/static/resizer_light.png)', 'url(/static/resizer_dark.png)')(props);

  return {
    'body *::-webkit-scrollbar': {
      width: '20px',
    },
    'body *::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    'body *::-webkit-scrollbar-thumb': {
      backgroundColor: bgColor,
      borderRadius: '20px',
      border: `8px solid rgba(0,0,0,0)`,
      backgroundClip: 'content-box',
      minHeight: '32px',
    },
    'body *::-webkit-scrollbar-button': {
      display: 'none',
    },
    'body *::-webkit-scrollbar-corner': {
      backgroundColor: 'transparent',
    },
    'body *::-webkit-resizer': {
      backgroundImage: resizerUrl,
      backgroundSize: '20px',
    },
    'body *': {
      scrollbarWidth: 'thin',
      scrollbarColor: `${ getCSSVar(props.theme, 'colors', bgColor) } transparent`,
    },
  };
};

export default scrollbar;

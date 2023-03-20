import { useColorModeValue } from '@chakra-ui/react';

export default function useColors() {
  return {
    panels: {
      bgColor: useColorModeValue('#eee', '#222'),
    },
    buttons: {
      bgColorHover: useColorModeValue('rgba(184, 184, 184, 0.31)', 'rgba(90, 93, 94, 0.31)'),
      color: '#616161',
    },
    selection: {
      bgColorSelected: useColorModeValue('#e4e6f1', '#37373d'),
    },
  };
}

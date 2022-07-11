import type { ComponentStyleConfig } from '@chakra-ui/theme';
import type {
  PartsStyleFunction,
} from '@chakra-ui/theme-tools'
import { getColor } from '@chakra-ui/theme-tools'

import type { tabsAnatomy as parts } from '@chakra-ui/anatomy'

const variantSoftRounded: PartsStyleFunction<typeof parts> = (props) => {
  const { colorScheme: c, theme } = props
  return {
    tab: {
      borderRadius: '12px',
      fontWeight: 'semibold',
      color: 'gray.600',
      _selected: {
        color: getColor(theme, `${ c }.700`),
        bg: getColor(theme, `${ c }.50`),
      },
      _hover: {
        color: getColor(theme, `${ c }.400`),
      },
    },
  }
}

const Tabs: ComponentStyleConfig = {
  variants: {
    'soft-rounded': variantSoftRounded,
  },
}

export default Tabs;

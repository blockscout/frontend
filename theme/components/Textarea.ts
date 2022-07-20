import type {
  SystemStyleObject,
} from '@chakra-ui/theme-tools'

import type { ComponentStyleConfig } from '@chakra-ui/theme';
import getOutlinedFieldStyles from '../utils/getOutlinedFieldStyles';

const sizes: Record<string, SystemStyleObject> = {
  lg: {
    fontSize: 'md',
    lineHeight: '20px',
    px: '24px',
    py: '28px',
    h: '160px',
    borderRadius: 'base',
  },
}

const Textarea: ComponentStyleConfig = {
  sizes,
  variants: {
    outline: (props) => getOutlinedFieldStyles(props),
  },
  defaultProps: {
    size: 'md',
    variant: 'outline',
  },
}

export default Textarea;

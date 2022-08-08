import { Tooltip as TooltipComponent } from '@chakra-ui/react';
import type { ComponentStyleConfig } from '@chakra-ui/theme';

const Tooltip: ComponentStyleConfig = {
  baseStyle: {
    maxWidth: 'unset',
  },
};

TooltipComponent.defaultProps = { ...TooltipComponent.defaultProps, hasArrow: true };

export default Tooltip;

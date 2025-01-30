import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

import luxColors from 'theme/foundations/lux-colors';

type Props = {
  isExpanded?: boolean;
  isCollapsed?: boolean;
  isActive?: boolean;
  px?: string | number;
}

export default function useNavLinkProps({ isExpanded, isCollapsed, isActive }: Props) {

  return {
    itemProps: {
      py: 2.5,
      display: 'flex',
      border: 'none',
      color: isActive ? luxColors.colors.foreground : luxColors.colors.muted2,
      bgColor: 'transparent',
      _hover: { color: luxColors.colors.accent  },
      ...getDefaultTransitionProps({ transitionProperty: 'width, padding' }),
    },
    textProps: {
      variant: 'inherit',
      fontSize: 'sm',
      lineHeight: '20px',
      opacity: { base: '1', lg: isExpanded ? '1' : '0', xl: isCollapsed ? '0' : '1' },
      transitionProperty: 'opacity',
      transitionDuration: 'normal',
      transitionTimingFunction: 'ease',
    },
  };
}

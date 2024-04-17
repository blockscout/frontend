import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

import useColors from './useColors';

type Props = {
  isExpanded?: boolean;
  isCollapsed?: boolean;
  isActive?: boolean;
  px?: string | number;
}

export default function useNavLinkProps({ isExpanded, isCollapsed, isActive }: Props) {
  const colors = useColors();

  return {
    itemProps: {
      py: 0,
      display: 'flex',
      color: colors.text.default,
      bgColor: colors.bg.default,
      _hover: { color: 'black', background: '#f1f1f1', borderRadius: 16 },
      // borderRadius: 'base',
      ...(isActive && {
        background: '#f1f1f1',
        fontWeight: 600,
        borderRadius: 16,
      }),
      // width: '120px',
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

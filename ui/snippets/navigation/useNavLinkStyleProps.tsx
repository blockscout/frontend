import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

type Props = {
  isExpanded?: boolean;
  isCollapsed?: boolean;
  isActive?: boolean;
};

export default function useNavLinkStyleProps({ isExpanded, isCollapsed, isActive }: Props) {
  return {
    itemProps: {
      visual: 'navigation' as const,
      py: '9px',
      display: 'flex',
      ...(isActive ? { 'data-selected': true } : {}),
      borderRadius: 'base',
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

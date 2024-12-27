import type { EntityBaseProps } from './components';

export type IconSize = 'md' | 'lg';

export function getIconProps(size: IconSize = 'md') {
  switch (size) {
    case 'md': {
      return {
        boxSize: '20px', // for tables, lists and regular content
      };
    }
    case 'lg': {
      return {
        boxSize: '30px', // for headings
      };
    }
  }
}

export function distributeEntityProps<Props extends EntityBaseProps>(props: Props) {
  const { className, onClick, icon, ...restProps } = props;

  return {
    container: { className },
    icon: { ...restProps, ...icon },
    link: { ...restProps, onClick },
    content: restProps,
    symbol: restProps,
    copy: restProps,
  };
}

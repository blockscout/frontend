import type { EntityBaseProps } from './components';

export function getIconProps(variant: EntityBaseProps['variant'] = 'content') {
  switch (variant) {
    case 'content':
    case 'subheading': {
      return {
        boxSize: '20px', // for tables, lists, regular content and page subheadings
      };
    }
    case 'heading': {
      return {
        boxSize: '30px', // for page headings
      };
    }
  }
}

export function getContentProps(variant: EntityBaseProps['variant'] = 'content') {
  switch (variant) {
    // currently, there could be only icon in the heading variant
    // and for the content variant, fontStyle is set in the consumer component
    case 'subheading': {
      return {
        textStyle: 'heading.md',
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

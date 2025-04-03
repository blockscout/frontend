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
        textStyle: { base: 'heading.sm', lg: 'heading.md' },
      };
    }
  }
}

export function distributeEntityProps<Props extends EntityBaseProps>(props: Props) {
  const { className, onClick, icon, linkVariant, ...mainProps } = props;
  const { variant, ...restProps } = mainProps;

  return {
    container: { className },
    icon: { ...mainProps, ...icon },
    link: { ...restProps, variant: linkVariant, onClick },
    content: mainProps,
    symbol: restProps,
    copy: restProps,
  };
}

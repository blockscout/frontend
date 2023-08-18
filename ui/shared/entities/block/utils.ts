export type Size = 'md' | 'lg';

export function getPropsForSize(size: Size = 'md') {
  switch (size) {
    case 'md': {
      return {
        icon: {
          boxSize: '24px',
        },
        content: {
          fontSize: 'md',
          lineHeight: 'normal',
          fontWeight: 400,
        },
      };
    }
    case 'lg': {
      return {
        icon: {
          boxSize: '30px',
        },
        content: {
          fontSize: 'xl',
          lineHeight: 'normal',
          fontWeight: 500,
        },
      };
    }
  }
}

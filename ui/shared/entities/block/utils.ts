export type Size = 'sm' | 'md' | 'lg';

export function getPropsForSize(size: Size = 'md') {
  switch (size) {
    case 'sm': {
      return {
        icon: {
          boxSize: '24px',
          marginRight: 1,
        },
        content: {
          fontSize: 'sm',
          lineHeight: '20px',
        },
      };
    }
    case 'md': {
      return {
        icon: {
          boxSize: '24px',
          marginRight: 2,
        },
        content: {
          fontSize: 'md',
          lineHeight: 'normal',
        },
      };
    }
    case 'lg': {
      return {
        icon: {
          boxSize: '30px',
          marginRight: 2,
        },
        content: {
          fontSize: 'xl',
          lineHeight: 'normal',
        },
      };
    }
  }
}

export type Size = 'sm' | 'md' | 'lg';

// TODO @tom2drum revise and maybe remove lineHeight and fontSize, leave only icon size
export function getPropsForSize(size: Size = 'md') {
  switch (size) {
    case 'sm': {
      return {
        icon: {
          boxSize: '24px',
          marginRight: 1,
        },
      };
    }
    case 'md': {
      return {
        icon: {
          boxSize: '24px',
          marginRight: 2,
        },
      };
    }
    case 'lg': {
      return {
        icon: {
          boxSize: '30px',
          marginRight: 2,
        },
      };
    }
  }
}

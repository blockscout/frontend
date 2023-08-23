export type IconSize = 'sm' | 'md' | 'lg';

export function getIconProps(size: IconSize = 'md') {
  switch (size) {
    case 'sm': {
      return {
        boxSize: '20px',
      };
    }
    case 'md': {
      return {
        boxSize: '24px',
      };
    }
    case 'lg': {
      return {
        boxSize: '30px',
      };
    }
  }
}

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

import { Flex } from '@chakra-ui/react';
import React from 'react';
import type { MouseEventHandler } from 'react';

import IconSvg from 'ui/shared/IconSvg';

type Props = {
  filledIndex: number;
  onMouseOverFactory?: (index: number) => MouseEventHandler<HTMLDivElement>;
  onMouseOut?: () => void;
  onClickFactory?: (index: number) => MouseEventHandler<HTMLDivElement>;
};

const Stars = ({ filledIndex, onMouseOverFactory, onMouseOut, onClickFactory }: Props) => {
  const outlineStartColor = onMouseOverFactory ? 'gray.400' : { _light: 'gray.200', _dark: 'gray.700' };
  return (
    <Flex>
      { Array(5).fill(null).map((_, index) => (
        <IconSvg
          key={ index }
          name={ filledIndex >= index ? 'star_filled' : 'star_outline' }
          color={ filledIndex >= index ? 'yellow.400' : outlineStartColor }
          w={ 6 } // 5 + 1 padding
          h={ 5 }
          pr={ 1 } // use padding intead of margin so that there are no empty spaces between stars without hover effect
          _last={{ w: 5, pr: 0 }}
          cursor={ onMouseOverFactory ? 'pointer' : 'default' }
          onMouseOver={ onMouseOverFactory?.(index) }
          onMouseOut={ onMouseOut }
          onClick={ onClickFactory?.(index) }
        />
      )) }
    </Flex>
  );
};

export default Stars;

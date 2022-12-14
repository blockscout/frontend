import { Tag, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  isIn: boolean;
  isOut: boolean;
  className?: string;
}

const InOutTag = ({ isIn, isOut, className }: Props) => {
  if (!isIn && !isOut) {
    return null;
  }

  const colorScheme = isOut ? 'orange' : 'green';

  return (
    <Tag
      className={ className }
      colorScheme={ colorScheme }
      display="flex"
      justifyContent="center"
    >
      { isOut ? 'OUT' : 'IN' }
    </Tag>
  );
};

export default React.memo(chakra(InOutTag));

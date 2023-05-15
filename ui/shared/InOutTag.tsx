import { chakra } from '@chakra-ui/react';
import React from 'react';

import Tag from 'ui/shared/chakra/Tag';

interface Props {
  isIn: boolean;
  isOut: boolean;
  className?: string;
  isLoading?: boolean;
}

const InOutTag = ({ isIn, isOut, className, isLoading }: Props) => {
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
      isLoading={ isLoading }
    >
      { isOut ? 'OUT' : 'IN' }
    </Tag>
  );
};

export default React.memo(chakra(InOutTag));

import { Box, HStack, Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  columns: Array<string>;
  className?: string;
  isLong?: boolean;
}

const SkeletonTable = ({ columns, className, isLong }: Props) => {
  const rowsNum = isLong ? 50 : 3;

  return (
    <Box className={ className }>
      <Skeleton height={ 10 } width="100%" borderBottomLeftRadius="none" borderBottomRightRadius="none"/>
      { Array.from(Array(rowsNum)).map((item, index) => (
        <HStack key={ index } spacing={ 6 } marginTop={ 8 }>
          { columns.map((width, index) => (
            <Skeleton
              key={ index }
              height={ 5 }
              width={ width }
              flexShrink={ width.includes('%') ? 'initial' : 0 }
              borderRadius="full"
            />
          )) }
        </HStack>
      )) }
    </Box>
  );
};

export default React.memo(chakra(SkeletonTable));

import { HStack, Skeleton } from '@chakra-ui/react';
import React from 'react';

interface Props {
  columns: Array<string>;
}

const SkeletonTable = ({ columns }: Props) => {
  return (
    <div>
      <Skeleton height={ 10 } width="100%" borderTopLeftRadius="base" borderTopRightRadius="base"/>
      { Array.from(Array(5)).map((item, index) => (
        <HStack key={ index } spacing={ 6 } marginTop={ 8 }>
          { columns.map((width, index) => (
            <Skeleton
              key={ index }
              height={ 5 }
              flexBasis={ width === 'auto' ? '100%' : width }
              flexShrink={ width === 'auto' ? 'initial' : 0 }
              borderRadius="full"
            />
          )) }
        </HStack>
      )) }
    </div>
  );
};

export default React.memo(SkeletonTable);

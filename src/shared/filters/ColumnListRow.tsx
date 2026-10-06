// SPDX-License-Identifier: LicenseRef-Blockscout

import type { HTMLChakraProps } from '@chakra-ui/react';
import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Checkbox } from 'src/toolkit/chakra/checkbox';

import type { ColumnsButtonColumn } from './ColumnsButton';

interface Props {
  readonly column: ColumnsButtonColumn<string>;
  readonly rowRef?: React.Ref<HTMLDivElement>;
  readonly rowStyle?: React.CSSProperties;
  readonly handleRef?: React.Ref<HTMLSpanElement>;
  readonly handleProps?: HTMLChakraProps<'span'>;
  readonly isDragging?: boolean;
}

const ColumnListRow = ({ column, rowRef, rowStyle, handleRef, handleProps, isDragging }: Props) => {
  return (
    <Flex
      ref={ rowRef }
      style={ rowStyle }
      alignItems="center"
      gap={ 3 }
      h={ 8 }
      position="relative"
      zIndex={ isDragging ? 1 : undefined }
      bgColor={ isDragging ? 'popover.bg' : undefined }
      boxShadow={ isDragging ? 'size.lg' : undefined }
      borderRadius="sm"
    >
      <chakra.span
        ref={ handleRef }
        display="inline-flex"
        flexShrink={ 0 }
        color={ isDragging ? 'hover' : 'icon.secondary' }
        _hover={ handleProps ? { color: 'hover' } : undefined }
        cursor={ isDragging ? 'grabbing' : 'grab' }
        touchAction="none"
        borderRadius="sm"
        aria-hidden={ handleProps ? undefined : true }
        { ...handleProps }
      >
        <SpriteIcon name="move" boxSize={ 5 }/>
      </chakra.span>
      <Checkbox value={ column.id } size="md" w="100%">
        { column.name }
      </Checkbox>
    </Flex>
  );
};

export default React.memo(ColumnListRow);

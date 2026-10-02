// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Button } from 'src/toolkit/chakra/button';
import { Checkbox, CheckboxGroup } from 'src/toolkit/chakra/checkbox';
import { DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from 'src/toolkit/chakra/drawer';
import { IconButton } from 'src/toolkit/chakra/icon-button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'src/toolkit/chakra/popover';

export interface ColumnsButtonColumn<TColumnId extends string> {
  readonly id: TColumnId;
  readonly name: string;
}

interface Props<TColumnId extends string> {
  tableColumns: ReadonlyArray<ColumnsButtonColumn<TColumnId>>;
  columns: Partial<Record<TColumnId, boolean>>;
  onChange: (val: Record<TColumnId, boolean>) => void;
  selected?: boolean;
  onReset?: () => void;
}

const ColumnsButton = <TColumnId extends string>({ tableColumns, columns, onChange, selected, onReset }: Props<TColumnId>) => {

  const isMobile = useIsMobile();

  const handleValueChange = React.useCallback((value: Array<string>) => {
    const newCols = value.reduce((acc, key) => {
      acc[key as TColumnId] = true;
      return acc;
    }, {} as Record<TColumnId, boolean>);
    onChange(newCols);
  }, [ onChange ]);

  const value = React.useMemo(() => tableColumns.filter(({ id }) => columns[id]).map(({ id }) => id), [ tableColumns, columns ]);

  const resetButton = onReset && (
    <Button
      variant="link"
      onClick={ onReset }
      disabled={ !selected }
      textStyle="sm"
    >
      Reset
    </Button>
  );

  const checkboxes = (
    <CheckboxGroup
      value={ value }
      onValueChange={ handleValueChange }
      display="grid"
      gridTemplateColumns="160px 160px"
      gap={ 3 }
    >
      { tableColumns.map(col => (
        <Checkbox
          key={ col.id }
          value={ col.id }
          size="md"
        >
          { col.name }
        </Checkbox>
      )) }
    </CheckboxGroup>
  );

  const trigger = (
    <IconButton
      variant="dropdown"
      size="md"
      aria-label="Columns"
      selected={ selected }
    >
      <SpriteIcon name="columns"/>
    </IconButton>
  );

  if (isMobile) {
    return (
      <DrawerRoot placement="bottom">
        <DrawerTrigger>
          { trigger }
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              <Flex justifyContent="space-between">
                Columns
                { resetButton }
              </Flex>
            </DrawerTitle>
            <DrawerCloseTrigger/>
          </DrawerHeader>
          <DrawerBody>
            { checkboxes }
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    );
  }

  return (
    <PopoverRoot>
      <PopoverTrigger>
        { trigger }
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          <Flex justifyContent="space-between" textStyle="sm" mb={ 5 }>
            <Box fontWeight={ 600 } color="text.secondary">Columns</Box>
            { resetButton }
          </Flex>
          { checkboxes }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default ColumnsButton;

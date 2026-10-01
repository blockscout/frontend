// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Checkbox, CheckboxGroup } from 'src/toolkit/chakra/checkbox';
import { DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from 'src/toolkit/chakra/drawer';
import { IconButton } from 'src/toolkit/chakra/icon-button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'src/toolkit/chakra/popover';

export interface ColumnsButtonColumn<TColumnId extends string> {
  readonly id: TColumnId;
  readonly name: string;
}

interface Props<TColumnId extends string> {
  tableColumns: Array<ColumnsButtonColumn<TColumnId>>;
  columns: Record<TColumnId, boolean>;
  onChange: (val: Record<TColumnId, boolean>) => void;
}

const ColumnsButton = <TColumnId extends string>({ tableColumns, columns, onChange }: Props<TColumnId>) => {

  const isMobile = useIsMobile();

  const handleValueChange = React.useCallback((value: Array<string>) => {
    const newCols = value.reduce((acc, key) => {
      acc[key as TColumnId] = true;
      return acc;
    }, {} as Record<TColumnId, boolean>);
    onChange(newCols);
  }, [ onChange ]);

  const content = (
    <CheckboxGroup
      defaultValue={ Object.keys(columns).filter((key) => columns[key as TColumnId]) }
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
            <DrawerTitle>Columns</DrawerTitle>
            <DrawerCloseTrigger/>
          </DrawerHeader>
          <DrawerBody>
            { content }
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
          { content }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default ColumnsButton;

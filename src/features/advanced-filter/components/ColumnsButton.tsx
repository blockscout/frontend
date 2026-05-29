// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { ColumnsIds } from '../types/client';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Button } from 'src/toolkit/chakra/button';
import { Checkbox, CheckboxGroup } from 'src/toolkit/chakra/checkbox';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'src/toolkit/chakra/popover';

import { TABLE_COLUMNS } from '../utils/consts';

interface Props {
  columns: Record<ColumnsIds, boolean>;
  onChange: (val: Record<ColumnsIds, boolean>) => void;
}

const ColumnsButton = ({ columns, onChange }: Props) => {
  const handleValueChange = React.useCallback((value: Array<string>) => {
    const newCols = value.reduce((acc, key) => {
      acc[key as ColumnsIds] = true;
      return acc;
    }, {} as Record<ColumnsIds, boolean>);
    onChange(newCols);
  }, [ onChange ]);

  return (
    <PopoverRoot>
      <PopoverTrigger>
        <Button
          variant="dropdown"
          size="sm"
          px={{ base: 1, lg: 3 }}
        >
          <SpriteIcon name="columns" boxSize={ 5 } color="inherit"/>
          <chakra.span hideBelow="lg">Columns</chakra.span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody px={ 4 } py={ 6 } display="flex" flexDir="column" rowGap={ 5 }>
          <CheckboxGroup
            defaultValue={ Object.keys(columns).filter((key) => columns[key as ColumnsIds]) }
            onValueChange={ handleValueChange }
            display="grid"
            gridTemplateColumns="160px 160px"
            gap={ 3 }
          >
            { TABLE_COLUMNS.map(col => (
              <Checkbox
                key={ col.id }
                value={ col.id }
                size="md"
              >
                { col.id === 'or_and' ? 'And/Or' : col.name }
              </Checkbox>
            )) }
          </CheckboxGroup>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default ColumnsButton;

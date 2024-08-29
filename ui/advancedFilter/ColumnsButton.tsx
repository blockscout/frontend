import {
  Button,
  Grid,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useDisclosure,
  Checkbox,
} from '@chakra-ui/react';
import React from 'react';
import type { ChangeEvent } from 'react';

import type { ColumnsIds } from 'ui/pages/AdvancedFilter';
import { TABLE_COLUMNS } from 'ui/pages/AdvancedFilter';
import Popover from 'ui/shared/chakra/Popover';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  columns: Record<ColumnsIds, boolean>;
  onChange: (val: Record<ColumnsIds, boolean>) => void;
}

const ColumnsButton = ({ columns, onChange }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const onCheckboxClick = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const newCols = { ...columns };
    const id = event.target.id as ColumnsIds;
    newCols[id] = event.target.checked;
    onChange(newCols);
  }, [ onChange, columns ]);

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <Button
          onClick={ onToggle }
          variant="outline"
          colorScheme="gray"
          size="sm"
          leftIcon={ <IconSvg name="columns" boxSize={ 5 } color="inherit"/> }
        >
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody px={ 4 } py={ 6 } display="flex" flexDir="column" rowGap={ 5 }>
          <Grid gridTemplateColumns="160px 160px" gap={ 3 }>
            { TABLE_COLUMNS.map(col => (
              <Checkbox
                key={ col.id }
                defaultChecked={ columns[col.id] }
                onChange={ onCheckboxClick }
                id={ col.id }
                size="lg"
              >
                { col.name }
              </Checkbox>
            )) }
          </Grid>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ColumnsButton;

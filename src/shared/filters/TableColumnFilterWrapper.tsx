// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Button } from 'src/toolkit/chakra/button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'src/toolkit/chakra/popover';

interface Props {
  columnName: string;
  isLoading?: boolean;
  selected?: boolean;
  className?: string;
  children: React.ReactNode;
  value?: string;
}

const TableColumnFilterWrapper = ({ columnName, className, children, isLoading, selected, value }: Props) => {
  return (
    <PopoverRoot>
      <PopoverTrigger>
        <Button
          display="inline-flex"
          aria-label={ `filter by ${ columnName }` }
          variant="icon_secondary"
          borderWidth="0"
          h="20px"
          minW="auto"
          disabled={ isLoading }
          selected={ selected }
          borderRadius="4px"
          size="sm"
          textStyle="sm"
          fontWeight={ 500 }
          padding={ 0 }
        >
          <SpriteIcon name="filter" w="19px" h="19px"/>
          { Boolean(value) && <chakra.span>{ value }</chakra.span> }
        </Button>
      </PopoverTrigger>
      <PopoverContent className={ className }>
        <PopoverBody display="flex" flexDir="column" rowGap={ 3 }>
          { children }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default chakra(TableColumnFilterWrapper);

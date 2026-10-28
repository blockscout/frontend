// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import { Button } from 'src/toolkit/chakra/button';
import { PopoverCloseTriggerWrapper } from 'src/toolkit/chakra/popover';

type Props = {
  isTouched?: boolean;
  onFilter: () => void;
  children: React.ReactNode;
};

const ColumnFilterContent = ({ isTouched, onFilter, children }: Props) => {
  const handleFilterClick = React.useCallback(() => {
    onFilter();
  }, [ onFilter ]);

  return (
    <Flex flexDir="column" rowGap={ 6 }>
      { children }
      <PopoverCloseTriggerWrapper>
        <Button
          disabled={ !isTouched }
          onClick={ handleFilterClick }
          w="fit-content"
          size="sm"
        >
          Filter
        </Button>
      </PopoverCloseTriggerWrapper>
    </Flex>
  );
};

export default ColumnFilterContent;

// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { Button } from 'src/toolkit/chakra/button';
import { PopoverCloseTriggerWrapper } from 'src/toolkit/chakra/popover';

type Props = {
  title: string;
  isFilled?: boolean;
  isTouched?: boolean;
  hasReset?: boolean;
  onFilter: () => void;
  onReset?: () => void;
  children: React.ReactNode;
};

const ColumnFilterContent = ({ title, isFilled, isTouched, hasReset, onFilter, onReset, children }: Props) => {
  const handleFilterClick = React.useCallback(() => {
    onFilter();
  }, [ onFilter ]);

  return (
    <Flex flexDir="column" rowGap={ 3 }>
      <Flex alignItems="center" justifyContent="space-between" columnGap={ 6 }>
        <Text color="text.secondary" fontWeight="600">{ title }</Text>
        { hasReset && (
          <Button
            variant="link"
            onClick={ onReset }
            disabled={ !isFilled }
            textStyle="sm"
          >
            Reset
          </Button>
        ) }
      </Flex>
      { children }
      <PopoverCloseTriggerWrapper>
        <Button
          disabled={ !isTouched }
          onClick={ handleFilterClick }
          w="fit-content"
        >
          Filter
        </Button>
      </PopoverCloseTriggerWrapper>
    </Flex>
  );
};

export default ColumnFilterContent;

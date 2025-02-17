import {
  chakra,
  Flex,
  Text,
} from '@chakra-ui/react';
import React from 'react';

import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import { PopoverCloseTriggerWrapper } from 'toolkit/chakra/popover';

type Props = {
  title: string;
  isFilled?: boolean;
  isTouched?: boolean;
  hasReset?: boolean;
  onFilter: () => void;
  onReset?: () => void;
  children: React.ReactNode;
};

const TableColumnFilter = ({ title, isFilled, isTouched, hasReset, onFilter, onReset, children }: Props) => {
  const onFilterClick = React.useCallback(() => {
    onFilter();
  }, [ onFilter ]);
  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="text.secondary" fontWeight="600">{ title }</Text>
        { hasReset && (
          <Link
            onClick={ onReset }
            cursor={ isFilled ? 'pointer' : 'unset' }
            opacity={ isFilled ? 1 : 0.2 }
            _hover={{
              color: isFilled ? 'link_hovered' : 'none',
            }}
          >
            Reset
          </Link>
        ) }
      </Flex>
      { children }
      <PopoverCloseTriggerWrapper>
        <Button
          disabled={ !isTouched }
          onClick={ onFilterClick }
          w="fit-content"
        >
          Filter
        </Button>
      </PopoverCloseTriggerWrapper>
    </>
  );
};

export default chakra(TableColumnFilter);

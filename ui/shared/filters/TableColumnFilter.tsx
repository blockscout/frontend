import {
  chakra,
  Flex,
  Text,
  Link,
  Button,
} from '@chakra-ui/react';
import React from 'react';

import TableColumnFilterWrapper from './TableColumnFilterWrapper';

type ContentProps = {
  title: string;
  isFilled?: boolean;
  hasReset?: boolean;
  onFilter: () => void;
  onReset?: () => void;
  onClose?: () => void;
  children: React.ReactNode;
}

type Props = ContentProps & {
  columnName: string;
  isActive?: boolean;
  isLoading?: boolean;
  className?: string;
}

const TableColumnFilterContent = ({ title, isFilled, hasReset, onFilter, onReset, onClose, children }: ContentProps) => {
  const onFilterClick = React.useCallback(() => {
    onClose && onClose();
    onFilter();
  }, [ onClose, onFilter ]);
  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="text_secondary" fontWeight="600">{ title }</Text>
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
      <Button
        isDisabled={ !isFilled }
        onClick={ onFilterClick }
        w="fit-content"
      >
        Filter
      </Button>
    </>
  );
};

const TableColumnFilter = ({ columnName, isActive, className, isLoading, ...props }: Props) => {
  return (
    <TableColumnFilterWrapper
      isActive={ isActive }
      columnName={ columnName }
      className={ className }
      isLoading={ isLoading }
    >
      <TableColumnFilterContent { ...props }/>
    </TableColumnFilterWrapper>
  );
};

export default chakra(TableColumnFilter);

import {
  chakra,
  Flex,
  Text,
} from '@chakra-ui/react';
import React from 'react';

import { Button } from 'toolkit/chakra/button';

import ColumnFilterWrapper from './ColumnFilterWrapper';

type Props = {
  columnName: string;
  title: string;
  isActive?: boolean;
  isFilled?: boolean;
  onFilter: () => void;
  onReset?: () => void;
  onClose?: () => void;
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ContentProps = {
  title: string;
  isFilled?: boolean;
  onFilter: () => void;
  onReset?: () => void;
  onClose?: () => void;
  children: React.ReactNode;
};

const ColumnFilterContent = ({ title, isFilled, onFilter, onReset, onClose, children }: ContentProps) => {
  const onFilterClick = React.useCallback(() => {
    onClose && onClose();
    onFilter();
  }, [ onClose, onFilter ]);
  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mb={ 3 }>
        <Text color="text_secondary" fontWeight="600">{ title }</Text>
        <Button
          variant="link"
          onClick={ onReset }
          disabled={ !isFilled }
        >
          Reset
        </Button>
      </Flex>
      { children }
      <Button
        disabled={ !isFilled }
        mt={ 4 }
        onClick={ onFilterClick }
        w="fit-content"
      >
        Filter
      </Button>
    </>
  );
};

const ColumnFilter = ({ columnName, isActive, className, isLoading, ...props }: Props) => {
  return (
    <ColumnFilterWrapper
      isActive={ isActive }
      columnName={ columnName }
      className={ className }
      isLoading={ isLoading }
    >
      <ColumnFilterContent { ...props }/>
    </ColumnFilterWrapper>
  );
};

export default chakra(ColumnFilter);

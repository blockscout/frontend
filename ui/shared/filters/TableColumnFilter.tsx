import {
  chakra,
  Flex,
  Text,
  Link,
  Button,
} from '@chakra-ui/react';
import React from 'react';

type Props = {
  title: string;
  isFilled?: boolean;
  isTouched?: boolean;
  hasReset?: boolean;
  onFilter: () => void;
  onReset?: () => void;
  onClose?: () => void;
  children: React.ReactNode;
};

const TableColumnFilter = ({ title, isFilled, isTouched, hasReset, onFilter, onReset, onClose, children }: Props) => {
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
        isDisabled={ !isTouched }
        onClick={ onFilterClick }
        w="fit-content"
      >
        Filter
      </Button>
    </>
  );
};

export default chakra(TableColumnFilter);

import {
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useDisclosure,
  chakra,
  Portal,
  Button,
} from '@chakra-ui/react';
import React from 'react';

import Popover from 'ui/shared/chakra/Popover';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  columnName: string;
  isActive?: boolean;
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
  value?: string;
}

const TableColumnFilterWrapper = ({ columnName, isActive, className, children, isLoading, value }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const content = React.Children.only(children) as React.ReactElement & {
    ref?: React.Ref<React.ReactNode>;
  };

  const modifiedContent = React.cloneElement(
    content,
    { onClose },
  );

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy lazyBehavior="unmount">
      <PopoverTrigger>
        <Button
          onClick={ onToggle }
          aria-label={ `filter by ${ columnName }` }
          variant="ghost"
          h="20px"
          isActive={ Boolean(value) || isActive }
          isDisabled={ isLoading }
          borderRadius="4px"
          color="text_secondary"
          fontSize="sm"
          fontWeight={ 500 }
          leftIcon={ <IconSvg name="filter" w="19px" h="19px"/> }
          padding={ 0 }
          sx={{
            'span:only-child': {
              mx: 0,
            },
            'span:not(:only-child)': {
              mr: '2px',
            },
          }}
        >
          { Boolean(value) && <chakra.span>{ value }</chakra.span> }
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent className={ className }>
          <PopoverBody px={ 4 } py={ 6 } display="flex" flexDir="column" rowGap={ 3 }>
            { modifiedContent }
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default chakra(TableColumnFilterWrapper);

import {
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useDisclosure,
  IconButton,
  chakra,
  Portal,
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
}

const TableColumnFilterWrapper = ({ columnName, isActive, className, children, isLoading }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const child = React.Children.only(children) as React.ReactElement & {
    ref?: React.Ref<React.ReactNode>;
  };

  const modifiedChildren = React.cloneElement(
    child,
    { onClose },
  );

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy lazyBehavior="unmount">
      <PopoverTrigger>
        <IconButton
          onClick={ onToggle }
          aria-label={ `filter by ${ columnName }` }
          variant="ghost"
          w="20px"
          h="20px"
          icon={ <IconSvg name="filter" w="19px" h="19px"/> }
          isActive={ isActive }
          isDisabled={ isLoading }
          borderRadius="4px"
          color="text_secondary"
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent className={ className }>
          <PopoverBody px={ 4 } py={ 6 } display="flex" flexDir="column" rowGap={ 3 }>
            { modifiedChildren }
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default chakra(TableColumnFilterWrapper);

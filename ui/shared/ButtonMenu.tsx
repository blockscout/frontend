import { Button, Popover, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import type { CSSProperties, ReactNode } from 'react';
import React from 'react';

import { menuButton } from './RoutedTabs/utils';

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isTransparent?: boolean;
  isActive?: boolean;
  styles?: CSSProperties;
  buttonRef: React.RefObject<HTMLButtonElement>;
  children: ReactNode;
}

const ButtonMenu = ({ isOpen, onOpen, onClose, isTransparent, isActive, styles, buttonRef, children }: Props) => {
  return (
    <Popover
      isLazy
      placement="bottom-end"
      key="more"
      isOpen={ isOpen }
      onClose={ onClose }
      onOpen={ onOpen }
      closeDelay={ 0 }
    >
      <PopoverTrigger>
        <Button
          opacity={ isTransparent ? 0 : 1 }
          variant="ghost"
          isActive={ isOpen || isActive }
          ref={ buttonRef }
          css={{ ...styles }}
        >
          { menuButton.title }
        </Button>
      </PopoverTrigger>
      <PopoverContent w="auto">
        <PopoverBody display="flex" flexDir="column">
          { children }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(ButtonMenu);

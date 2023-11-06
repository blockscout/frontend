import type {
  ButtonProps } from '@chakra-ui/react';
import { Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import type { StyleProps } from '@chakra-ui/styled-system';
import React from 'react';

import type { MenuButton, TabItem } from './types';

import TabCounter from './TabCounter';
import { menuButton } from './utils';

interface Props {
  tabs: Array<TabItem | MenuButton>;
  activeTab?: TabItem;
  tabsCut: number;
  isActive: boolean;
  styles?: StyleProps;
  onItemClick: (index: number) => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
  size: ButtonProps['size'];
}

const TabsMenu = ({ tabs, tabsCut, isActive, styles, onItemClick, buttonRef, activeTab, size }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleItemClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    onClose();
    const tabIndex = event.currentTarget.getAttribute('data-index');
    if (tabIndex) {
      onItemClick(tabsCut + Number(tabIndex));
    }
  }, [ onClose, onItemClick, tabsCut ]);

  return (
    <Popover isLazy placement="bottom-end" key="more" isOpen={ isOpen } onClose={ onClose } onOpen={ onOpen } closeDelay={ 0 }>
      <PopoverTrigger>
        <Button
          variant="ghost"
          isActive={ isOpen || isActive }
          ref={ buttonRef }
          size={ size }
          { ...styles }
        >
          { menuButton.title }
        </Button>
      </PopoverTrigger>
      <PopoverContent w="auto">
        <PopoverBody display="flex" flexDir="column">
          { tabs.slice(tabsCut).map((tab, index) => (
            <Button
              key={ tab.id }
              variant="ghost"
              onClick={ handleItemClick }
              isActive={ activeTab ? activeTab.id === tab.id : false }
              justifyContent="left"
              data-index={ index }
              sx={{
                '&:hover span': {
                  color: 'inherit',
                },
              }}
            >
              { typeof tab.title === 'function' ? tab.title() : tab.title }
              <TabCounter count={ tab.count }/>
            </Button>
          )) }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(TabsMenu);

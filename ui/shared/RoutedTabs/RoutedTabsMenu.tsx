import { Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import type { StyleProps } from '@chakra-ui/styled-system';
import React from 'react';

import type { MenuButton, RoutedTab } from './types';

import { menuButton } from './utils';

interface Props {
  tabs: Array<RoutedTab | MenuButton>;
  activeTab: RoutedTab;
  tabsCut: number;
  isActive: boolean;
  styles?: StyleProps;
  onItemClick: (index: number) => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const RoutedTabsMenu = ({ tabs, tabsCut, isActive, styles, onItemClick, buttonRef, activeTab }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleItemClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    onClose();
    const tabIndex = (event.target as HTMLButtonElement).getAttribute('data-index');
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
              isActive={ activeTab.id === tab.id }
              justifyContent="left"
              data-index={ index }
            >
              { tab.title }
            </Button>
          )) }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(RoutedTabsMenu);

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
  onItemClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const RoutedTabsMenu = ({ tabs, tabsCut, isActive, styles, onItemClick, buttonRef, activeTab }: Props) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Popover isLazy placement="bottom-end" key="more">
      <PopoverTrigger>
        <Button
          variant="subtle"
          onClick={ onToggle }
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
              key={ tab.routeName }
              variant="subtle"
              onClick={ onItemClick }
              isActive={ activeTab.routeName === tab.routeName }
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

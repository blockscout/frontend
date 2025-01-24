import type { StyleProps } from '@chakra-ui/styled-system';
import React from 'react';

import type { MenuButton, TabItem } from './types';

import type { ButtonProps } from 'toolkit/chakra/button';
import { Button } from 'toolkit/chakra/button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';

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
  // const { isOpen, onClose, onOpen } = useDisclosure();

  const handleItemClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    // onClose();
    const tabIndex = event.currentTarget.getAttribute('data-index');
    if (tabIndex) {
      onItemClick(tabsCut + Number(tabIndex));
    }
  }, [ onItemClick, tabsCut ]);

  return (
    <PopoverRoot positioning={{ placement: 'bottom-end' }}>
      <PopoverTrigger>
        <Button
          as="div"
          role="button"
          variant="ghost"
          // isActive={ isOpen || isActive }
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
              key={ tab.id?.toString() }
              variant="ghost"
              onClick={ handleItemClick }
              active={ activeTab ? activeTab.id === tab.id : false }
              justifyContent="left"
              data-index={ index }
              css={{
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
    </PopoverRoot>
  );
};

export default React.memo(TabsMenu);

import React from 'react';

import type { TabItem } from './types';

import { PopoverBody, PopoverCloseTriggerWrapper, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { TabsCounter, TabsTrigger } from 'toolkit/chakra/tabs';
import IconSvg from 'ui/shared/IconSvg';

import { IconButton } from '../../chakra/icon-button';
import type { IconButtonProps } from '../../chakra/icon-button';
import { getTabValue } from './utils';

interface Props extends IconButtonProps {
  tabs: Array<TabItem>;
  tabsCut: number;
  isActive: boolean;
}

const AdaptiveTabsMenu = ({ tabs, tabsCut, isActive, ...props }: Props, ref: React.Ref<HTMLButtonElement>) => {

  return (
    <PopoverRoot positioning={{ placement: 'bottom-end' }}>
      <PopoverTrigger>
        <IconButton
          // we use "div" so the :last-of-type pseudo-class targets the last tab and not the menu trigger
          as="div"
          variant="plain"
          color="tabs.solid.fg"
          _hover={{
            color: 'link.primary.hover',
          }}
          _expanded={{
            color: 'tabs.solid.fg.selected',
            bg: 'tabs.solid.bg.selected',
          }}
          ref={ ref }
          expanded={ isActive }
          px="18px"
          { ...props }
        >
          <IconSvg name="dots" boxSize={ 5 }/>
        </IconButton>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody display="flex" flexDir="column" rowGap={ 2 } px={ 0 }>
          { tabs.slice(tabsCut).map((tab) => {
            const value = getTabValue(tab);

            return (
              <PopoverCloseTriggerWrapper key={ value }>
                <TabsTrigger
                  className="group"
                  value={ value }
                  w="100%"
                  py="5px"
                  borderRadius="none"
                  fontWeight="normal"
                  color="initial"
                  _hover={{
                    bg: 'tabs.solid.bg.selected',
                  }}
                >
                  { typeof tab.title === 'function' ? tab.title() : tab.title }
                  <TabsCounter count={ tab.count }/>
                </TabsTrigger>
              </PopoverCloseTriggerWrapper>
            );
          }) }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(React.forwardRef(AdaptiveTabsMenu));

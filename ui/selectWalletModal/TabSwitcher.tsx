import { Flex } from '@chakra-ui/react';
import React, { useCallback } from 'react';

export interface TabSwitcherProps<T> {
  tabs: Array<{ key: T; label: string }>;
  selected: T;
  onSelect: (tab: T) => void;
}

export interface TabSwitcherTabProps<T> {
  tabKey: T;
  tabLabel: string;
  isActive: boolean;
  onSelect: (tab: T) => void;
}

export const TabSwitcherTab = <T extends string>({
  tabKey, tabLabel, isActive, onSelect,
}: TabSwitcherTabProps<T>) => {
  const onClick = useCallback(() => {
    onSelect(tabKey);
  }, [ onSelect, tabKey ]);

  const color = isActive ? 'link_hovered' : 'gray.500';

  return (
    <Flex
      onClick={ onClick }
      alignItems="center"
      flexDirection="row"
      color={ color }
      cursor={ isActive ? 'default' : 'pointer' }
      flexBasis={ 0 }
      flexGrow={ 1 }
      flexShrink={ 1 }
      fontSize={ 14 }
      fontStyle="normal"
      fontWeight={ 400 }
      height="32px"
      justifyContent="center"
      lineHeight="20px"
      overflow="hidden"
      paddingBottom="12px"
      position="relative"
    >
      { tabLabel }
      <Flex
        bg={ isActive ? 'link_hovered' : 'gray.800' }
        bottom={ isActive ? '-3px' : 0 }
        height={ isActive ? '6px' : '1px' }
        position="absolute"
        width="100%"
        borderTopLeftRadius={ isActive ? '3px' : 0 }
        borderTopRightRadius={ isActive ? '3px' : 0 }
      >&nbsp;</Flex>
    </Flex>
  );
};

export const TabSwitcher = <T extends string>({ tabs, selected, onSelect }: TabSwitcherProps<T>) => {
  return (
    <Flex
      alignItems="center"
      flexDirection="row"
      justifyContent="flex-start"
      marginTop="24px"
    >
      { tabs.map(tab => (
        <TabSwitcherTab
          key={ tab.key }
          tabKey={ tab.key }
          tabLabel={ tab.label }
          isActive={ tab.key === selected }
          onSelect={ onSelect }
        />
      )) }
    </Flex>
  );
};

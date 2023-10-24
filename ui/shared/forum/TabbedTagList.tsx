import { Flex, Icon } from '@chakra-ui/react';
import React from 'react';

import bookmarkIcon from 'icons/bookmark.svg';

import TabsWithScroll from '../Tabs/TabsWithScroll';

interface Props {
  noBookmarked?: boolean;
  items: Array<string>;
  defaultValue: string;
  onChange: (newValue: string) => void;
}

const TabbedTagsList = ({ noBookmarked, items, defaultValue, onChange }: Props) => {

  const handleTabChange = React.useCallback((newTabIdx: number) => {
    if (noBookmarked) {
      return onChange(items[newTabIdx - 1]);
    } else {
      return onChange(newTabIdx === 0 ? 'bookmarked' : items[newTabIdx - 1]);
    }
  }, [ items, noBookmarked, onChange ]);

  const defaultTabIndex = React.useMemo(() => {
    if (noBookmarked) {
      return items.findIndex(i => i === defaultValue) + 1;
    } else {
      return defaultValue === 'bookmarked' ? 0 : items.findIndex(i => i === defaultValue) + 1;
    }
  }, [ items, noBookmarked, defaultValue ]);

  return (
    <Flex mb={ 6 } flexDir="column" w="100%" align="stretch">
      <TabsWithScroll
        w="100%"
        grow={ 1 }
        tabs={ [
          ...(noBookmarked ? [] : [ {
            id: 'bookmarked',
            title: () => <Icon as={ bookmarkIcon } boxSize={ 4 }/>,
            component: null,
          } ]),
          ...items.map(i => ({
            id: i,
            title: i,
            component: null,
          })) ] }
        tabListProps={{
          marginBottom: { base: 0, lg: 0 },
        }}
        onTabChange={ handleTabChange }
        defaultTabIndex={ defaultTabIndex }
      />
    </Flex>
  );
};

export default TabbedTagsList;

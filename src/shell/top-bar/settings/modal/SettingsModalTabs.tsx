// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'src/toolkit/chakra/tabs';

import type { SettingsModalTab, SettingsModalTabId } from './registry';

interface Props {
  tabs: Array<SettingsModalTab>;
  targetTab: SettingsModalTabId | undefined;
}

const SettingsModalTabs = ({ tabs, targetTab }: Props) => {
  const isMobile = useIsMobile();
  const defaultTab = tabs.find((tab) => tab.id === targetTab) ?? tabs[0];

  if (tabs.length === 1 && defaultTab) {
    return <defaultTab.Content/>;
  }

  const contents = tabs.map((tab) => (
    <TabsContent key={ tab.id } value={ tab.id } ps={ 0 } pt={{ base: 6, lg: 2 }} flexGrow={ 1 } minW={ 0 } overflowY="auto" overflowX="hidden">
      <tab.Content/>
    </TabsContent>
  ));

  if (isMobile) {
    return (
      <TabsRoot defaultValue={ defaultTab?.id } orientation="horizontal" variant="secondary" size="sm">
        <TabsList>
          { tabs.map((tab) => (
            <TabsTrigger key={ tab.id } value={ tab.id }>{ tab.title }</TabsTrigger>
          )) }
        </TabsList>
        { contents }
      </TabsRoot>
    );
  }

  return (
    <TabsRoot defaultValue={ defaultTab?.id } orientation="vertical" variant="solid" size="md" gap={ 8 } h="100%">
      <TabsList w="180px" gap={ 1 } flexShrink={ 0 }>
        { tabs.map((tab) => (
          <TabsTrigger key={ tab.id } value={ tab.id } justifyContent="flex-start" fontWeight="medium" px={ 3 } textStyle="sm" gap={ 2 }>
            <SpriteIcon name={ tab.icon } boxSize={ 5 }/>
            { tab.title }
          </TabsTrigger>
        )) }
      </TabsList>
      { contents }
    </TabsRoot>
  );
};

export default React.memo(SettingsModalTabs);

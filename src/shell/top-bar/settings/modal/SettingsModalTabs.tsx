// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'src/toolkit/chakra/tabs';

import type { SettingsModalTab, SettingsModalTabId } from './registry';

interface Props {
  tabs: Array<SettingsModalTab>;
  targetTab: SettingsModalTabId | undefined;
}

const SettingsModalTabs = ({ tabs, targetTab }: Props) => {
  const defaultTab = tabs.find((tab) => tab.id === targetTab) ?? tabs[0];

  return (
    <TabsRoot defaultValue={ defaultTab?.id } orientation="vertical" variant="solid" size="md" gap={ 8 } h="100%">
      <TabsList w="180px" gap={ 1 } flexShrink={ 0 }>
        { tabs.map((tab) => (
          <TabsTrigger key={ tab.id } value={ tab.id } justifyContent="flex-start" fontWeight="medium" px={ 3 }>
            <SpriteIcon name={ tab.icon } boxSize={ 5 }/>
            { tab.title }
          </TabsTrigger>
        )) }
      </TabsList>
      { tabs.map((tab) => (
        <TabsContent key={ tab.id } value={ tab.id } ps={ 0 } pt={ 2 } flexGrow={ 1 } minW={ 0 } overflowY="auto">
          <tab.Content/>
        </TabsContent>
      )) }
    </TabsRoot>
  );
};

export default React.memo(SettingsModalTabs);

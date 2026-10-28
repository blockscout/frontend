// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, VStack } from '@chakra-ui/react';
import React from 'react';

import SettingsSectionTitle from '../parts/SettingsSectionTitle';
import type { SettingsModalTab, SettingsModalTabId } from './registry';

interface Props {
  tabs: Array<SettingsModalTab>;
  targetTab: SettingsModalTabId | undefined;
}

const SettingsModalSections = ({ tabs, targetTab }: Props) => {
  const sectionRefs = React.useRef<Partial<Record<SettingsModalTabId, HTMLDivElement | null>>>({});

  React.useEffect(() => {
    if (targetTab) {
      sectionRefs.current[targetTab]?.scrollIntoView({ block: 'start' });
    }
  }, [ targetTab ]);

  return (
    <VStack gap={ 8 } alignItems="stretch">
      { tabs.map((tab) => (
        <Box
          key={ tab.id }
          as="section"
          ref={ (element: HTMLDivElement | null) => {
            sectionRefs.current[tab.id] = element;
          } }
        >
          <SettingsSectionTitle
            title={ tab.title }
            icon={ tab.icon }
            variant="modal"
          />
          <tab.Content/>
        </Box>
      )) }
    </VStack>
  );
};

export default React.memo(SettingsModalSections);

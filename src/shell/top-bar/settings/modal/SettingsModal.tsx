// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useIsMobile from 'src/shared/hooks/useIsMobile';

import { DialogBody, DialogContent, DialogHeader, DialogRoot } from 'src/toolkit/chakra/dialog';

import type { SettingsModalTabId } from './registry';
import { getVisibleSettingsModalTabs } from './registry';
import SettingsModalSections from './SettingsModalSections';
import SettingsModalTabs from './SettingsModalTabs';

interface Props {
  targetTab: SettingsModalTabId | undefined;
  onClose: () => void;
}

const SettingsModal = ({ targetTab, onClose }: Props) => {
  const isMobile = useIsMobile();
  const tabs = React.useMemo(() => getVisibleSettingsModalTabs(), []);

  const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (!open) {
      onClose();
    }
  }, [ onClose ]);

  return (
    <DialogRoot open onOpenChange={ handleOpenChange } adaptive size="md">
      <DialogContent h={{ lg: '560px' }}>
        <DialogHeader mb={{ base: 3, lg: 6 }}>Advanced site settings</DialogHeader>
        <DialogBody>
          { isMobile ?
            <SettingsModalSections tabs={ tabs } targetTab={ targetTab }/> :
            <SettingsModalTabs tabs={ tabs } targetTab={ targetTab }/> }
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default React.memo(SettingsModal);

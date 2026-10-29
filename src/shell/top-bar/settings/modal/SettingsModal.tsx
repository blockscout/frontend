// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { DialogBody, DialogContent, DialogHeader, DialogRoot } from 'src/toolkit/chakra/dialog';

import type { SettingsModalTabId } from './registry';
import { getVisibleSettingsModalTabs } from './registry';
import SettingsModalTabs from './SettingsModalTabs';

interface Props {
  targetTab: SettingsModalTabId | undefined;
  onClose: () => void;
}

const SettingsModal = ({ targetTab, onClose }: Props) => {
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
          <SettingsModalTabs tabs={ tabs } targetTab={ targetTab }/>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default React.memo(SettingsModal);

// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { File } from './types';

import CodeEditorTab from './CodeEditorTab';
import useThemeColors from './utils/useThemeColors';

interface Props {
  tabs: Array<File>;
  activeTab: string;
  mainFile?: string;
  hasRawPaths: boolean;
  onTabSelect: (fileKey: string) => void;
  onTabClose: (fileKey: string) => void;
}

const CodeEditorTabs = ({ tabs, activeTab, mainFile, hasRawPaths, onTabSelect, onTabClose }: Props) => {
  const themeColors = useThemeColors();

  const tabsPathChunks = React.useMemo(() => {
    return tabs.map((tab) => tab.display_path.split('/'));
  }, [ tabs ]);

  return (
    <Flex
      borderTopLeftRadius="md"
      overflow="hidden"
      bgColor={ themeColors['sideBar.background'] }
      flexWrap="wrap"
    >
      { tabs.map((tab) => (
        <CodeEditorTab
          key={ tab.key }
          fileKey={ tab.key }
          path={ tab.display_path }
          hasRawPaths={ hasRawPaths }
          isActive={ activeTab === tab.key }
          isMainFile={ mainFile === tab.key }
          onClick={ onTabSelect }
          onClose={ onTabClose }
          isCloseDisabled={ tabs.length === 1 }
          tabsPathChunks={ tabsPathChunks }
        />
      )) }
    </Flex>
  );
};

export default React.memo(CodeEditorTabs);

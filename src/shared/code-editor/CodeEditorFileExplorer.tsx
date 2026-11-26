// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { File } from './types';

import CodeEditorCollapseButton from './CodeEditorCollapseButton';
import CodeEditorFileList from './CodeEditorFileList';
import CodeEditorFileTree from './CodeEditorFileTree';
import type { FileExplorerView } from './CodeEditorViewSwitcher';
import CodeEditorViewSwitcher from './CodeEditorViewSwitcher';
import { centerInScrollParent } from './utils/center-in-scroll-parent';
import { composeFileList } from './utils/compose-file-list';
import composeFileTree from './utils/composeFileTree';

interface Props {
  data: Array<File>;
  isTreePossible: boolean;
  onFileSelect: (index: number) => void;
  selectedFile: string;
  mainFile?: string;
  isActive: boolean;
  setActionBarRenderer: React.Dispatch<React.SetStateAction<(() => React.JSX.Element) | undefined>>;
}

const CodeEditorFileExplorer = ({ data, isTreePossible, onFileSelect, selectedFile, mainFile, isActive, setActionBarRenderer }: Props) => {
  const [ preferredView, setPreferredView ] = React.useState<FileExplorerView>('tree');
  const [ treeKey, setTreeKey ] = React.useState(0);
  const [ isTreeCollapsed, setIsTreeCollapsed ] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const view = isTreePossible ? preferredView : 'list';
  const viewWithSelectionInSightRef = React.useRef(view);

  const tree = React.useMemo(() => {
    return view === 'tree' ? composeFileTree(data) : undefined;
  }, [ data, view ]);
  const list = React.useMemo(() => {
    return view === 'list' ? composeFileList(data, { hasRawPaths: !isTreePossible, mainFile }) : undefined;
  }, [ data, isTreePossible, mainFile, view ]);

  const handleCollapseButtonClick = React.useCallback(() => {
    setIsTreeCollapsed(true);
    setTreeKey((prev) => prev + 1);
  }, []);

  const handleViewSwitcherClick = React.useCallback(() => {
    setPreferredView((prev) => prev === 'tree' ? 'list' : 'tree');
    setIsTreeCollapsed(false);
  }, []);

  const renderActionBar = React.useCallback(() => {
    return (
      <Flex ml="auto" alignSelf="center" columnGap="2px">
        <CodeEditorViewSwitcher view={ view } onClick={ handleViewSwitcherClick } isTreePossible={ isTreePossible }/>
        <CodeEditorCollapseButton onClick={ handleCollapseButtonClick } label="Collapse folders" isDisabled={ view === 'list' }/>
      </Flex>
    );
  }, [ handleCollapseButtonClick, handleViewSwitcherClick, isTreePossible, view ]);

  const handleFileClick = React.useCallback((event: React.MouseEvent) => {
    const fileKey = (event.currentTarget as HTMLDivElement).getAttribute('data-file-key');
    const fileIndex = data.findIndex((item) => item.key === fileKey);

    if (fileIndex > -1) {
      onFileSelect(fileIndex);
    }
  }, [ data, onFileSelect ]);

  React.useEffect(() => {
    isActive && setActionBarRenderer(() => renderActionBar);
  }, [ isActive, renderActionBar, setActionBarRenderer ]);

  React.useEffect(() => {
    if (viewWithSelectionInSightRef.current === view) {
      return;
    }

    viewWithSelectionInSightRef.current = view;

    const rows = containerRef.current?.querySelectorAll<HTMLElement>('[data-file-key]') ?? [];
    const selectedRow = Array.from(rows).find((row) => row.getAttribute('data-file-key') === selectedFile);

    selectedRow && centerInScrollParent(selectedRow);
  }, [ selectedFile, view ]);

  return (
    <Box ref={ containerRef }>
      { tree && (
        <CodeEditorFileTree
          key={ treeKey }
          tree={ tree }
          onItemClick={ handleFileClick }
          isCollapsed={ isTreeCollapsed }
          selectedFile={ selectedFile }
          mainFile={ mainFile }
        />
      ) }
      { list && (
        <CodeEditorFileList
          items={ list }
          onItemClick={ handleFileClick }
          selectedFile={ selectedFile }
          mainFile={ mainFile }
        />
      ) }
    </Box>
  );
};

export default React.memo(CodeEditorFileExplorer);

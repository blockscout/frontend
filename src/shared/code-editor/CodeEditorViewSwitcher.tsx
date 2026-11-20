// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import CodeEditorActionButton from './CodeEditorActionButton';

export type FileExplorerView = 'tree' | 'list';

interface Props {
  readonly view: FileExplorerView;
  readonly onClick: () => void;
  readonly isTreePossible: boolean;
}

const CodeEditorViewSwitcher = ({ view, onClick, isTreePossible }: Props) => {
  const label = (() => {
    if (!isTreePossible) {
      return 'Tree view is unavailable: several source files resolve to the same path';
    }

    return view === 'tree' ? 'View as list' : 'View as tree';
  })();

  return (
    <CodeEditorActionButton
      iconName={ view === 'tree' ? 'search-list' : 'search-tree' }
      iconContent={ view === 'tree' ? '\\eb84' : '\\eb86' }
      label={ label }
      onClick={ onClick }
      isDisabled={ !isTreePossible }
    />
  );
};

export default React.memo(CodeEditorViewSwitcher);

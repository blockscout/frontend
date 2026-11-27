// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import CodeEditorActionButton from './CodeEditorActionButton';

interface Props {
  onClick: () => void;
  label: string;
  isDisabled?: boolean;
  isCollapsed?: boolean;
}

const CodeEditorCollapseButton = ({ onClick, label, isDisabled, isCollapsed }: Props) => {
  return (
    <CodeEditorActionButton
      ml="auto"
      alignSelf="center"
      iconName={ isCollapsed ? 'search-expand-results' : 'collapse-all' }
      iconContent={ isCollapsed ? '\\eb95' : '\\eac5' }
      label={ label }
      onClick={ onClick }
      isDisabled={ isDisabled }
    />
  );
};

export default React.memo(CodeEditorCollapseButton);

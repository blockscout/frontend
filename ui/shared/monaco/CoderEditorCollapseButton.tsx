import { Tooltip, Box } from '@chakra-ui/react';
import React from 'react';

interface Props {
  onClick: () => void;
  label: string;
  isDisabled?: boolean;
  isCollapsed?: boolean;
}

const CoderEditorCollapseButton = ({ onClick, label, isDisabled, isCollapsed }: Props) => {
  return (
    <Tooltip label={ label } isDisabled={ isDisabled }>
      <Box
        position="absolute"
        right={ 3 }
        top={ 2 }
        zIndex="sticky1"
        className={ isCollapsed ? 'codicon codicon-search-expand-results' : 'codicon codicon-collapse-all' }
        opacity={ isDisabled ? 0.6 : 1 }
        _before={{
          content: isCollapsed ? '"\\eb95"' : '"\\eac5"',
        }}
        onClick={ onClick }
        cursor="pointer"
      />
    </Tooltip>
  );
};

export default React.memo(CoderEditorCollapseButton);

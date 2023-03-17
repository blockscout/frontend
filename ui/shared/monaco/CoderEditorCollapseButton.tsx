import { Tooltip, Box } from '@chakra-ui/react';
import React from 'react';

import useColors from './utils/useColors';

interface Props {
  onClick: () => void;
  label: string;
  isDisabled?: boolean;
  isCollapsed?: boolean;
}

const CoderEditorCollapseButton = ({ onClick, label, isDisabled, isCollapsed }: Props) => {
  const colors = useColors();
  return (
    <Tooltip label={ label } isDisabled={ isDisabled }>
      <Box
        position="absolute"
        right="12px"
        top="8px"
        zIndex="sticky1"
        className={ isCollapsed ? 'codicon codicon-search-expand-results' : 'codicon codicon-collapse-all' }
        opacity={ isDisabled ? 0.6 : 1 }
        boxSize="20px"
        p="2px"
        borderRadius="sm"
        _before={{
          content: isCollapsed ? '"\\eb95"' : '"\\eac5"',
        }}
        _hover={{
          bgColor: colors.buttons.bgColorHover,
        }}
        onClick={ onClick }
        cursor="pointer"
      />
    </Tooltip>
  );
};

export default React.memo(CoderEditorCollapseButton);

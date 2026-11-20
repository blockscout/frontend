// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BoxProps } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import React from 'react';

import useThemeColors from './utils/useThemeColors';

interface Props extends Omit<BoxProps, 'onClick'> {
  readonly iconName: string;
  readonly iconContent: string;
  readonly label: string;
  readonly onClick: () => void;
  readonly isDisabled: boolean | undefined;
}

const CodeEditorActionButton = ({ iconName, iconContent, label, onClick, isDisabled, ...rest }: Props) => {
  const themeColors = useThemeColors();

  return (
    <Box
      className={ `codicon codicon-${ iconName }` }
      opacity={ isDisabled ? 0.6 : 1 }
      boxSize="20px"
      p="2px"
      borderRadius="sm"
      // Monaco registers only the editor's own icons, so the glyph of a workbench icon is set here.
      _before={{
        content: `"${ iconContent }"`,
      }}
      _hover={ isDisabled ? undefined : {
        bgColor: themeColors['custom.inputOption.hoverBackground'],
      } }
      onClick={ isDisabled ? undefined : onClick }
      cursor={ isDisabled ? 'default' : 'pointer' }
      title={ label }
      aria-label={ label }
      aria-disabled={ isDisabled }
      { ...rest }
    />
  );
};

export default React.memo(CodeEditorActionButton);

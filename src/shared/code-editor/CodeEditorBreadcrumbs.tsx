// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Box } from '@chakra-ui/react';
import React from 'react';

import { getBreadcrumbChunks } from './utils/get-breadcrumb-chunks';
import useThemeColors from './utils/useThemeColors';

interface Props {
  path: string;
  hasRawPaths: boolean;
}

const CodeEditorBreadcrumbs = ({ path, hasRawPaths }: Props) => {
  const chunks = getBreadcrumbChunks(path, hasRawPaths);
  const themeColors = useThemeColors();

  return (
    <Flex
      color={ themeColors['breadcrumbs.foreground'] }
      bgColor={ themeColors['editor.background'] }
      pl="16px"
      pr="8px"
      flexWrap="wrap"
      fontSize="13px"
      lineHeight="22px"
      alignItems="center"
    >
      { chunks.map((chunk, index) => {
        return (
          <React.Fragment key={ index }>
            { index !== 0 && (
              <Box
                className="codicon codicon-breadcrumb-separator"
                boxSize="16px"
                _before={{
                  content: '"\\eab6"',
                }}/>
            ) }
            <Box>{ chunk }</Box>
          </React.Fragment>
        );
      }) }
    </Flex>
  );
};

export default React.memo(CodeEditorBreadcrumbs);

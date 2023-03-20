import { Flex, Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import stripLeadingSlash from 'lib/stripLeadingSlash';
import * as themes from 'ui/shared/monaco/utils/themes';

interface Props {
  path: string;
}

const CodeEditorBreadcrumbs = ({ path }: Props) => {
  const chunks = stripLeadingSlash(path).split('/');
  const bgColor = useColorModeValue(themes.light.colors['editor.background'], themes.dark.colors['editor.background']);

  return (
    <Flex
      color="text_secondary"
      bgColor={ bgColor }
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

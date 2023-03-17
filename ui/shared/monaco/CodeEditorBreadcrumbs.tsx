import { Flex, Box } from '@chakra-ui/react';
import React from 'react';

import stripLeadingSlash from 'lib/stripLeadingSlash';

interface Props {
  path: string;
}

const CodeEditorBreadcrumbs = ({ path }: Props) => {
  const chunks = stripLeadingSlash(path).split('/');
  return (
    <Flex fontSize="sm" color="text_secondary" pl={ 2 } flexWrap="wrap">
      { chunks.map((chunk, index) => {

        return (
          <React.Fragment key={ index }>
            { index !== 0 && <Box mx={ 1 }>{ '>' }</Box> }
            <Box>{ chunk }</Box>
          </React.Fragment>
        );
      }) }
    </Flex>
  );
};

export default React.memo(CodeEditorBreadcrumbs);

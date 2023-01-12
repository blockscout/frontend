import { Box, chakra, Flex, Link, Text, Tooltip } from '@chakra-ui/react';
import React from 'react';

import type { SmartContract } from 'types/api/contract';

import link from 'lib/link/link';
import CodeEditor from 'ui/shared/CodeEditor';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  data: string;
  hasSol2Yml: boolean;
  address?: string;
  isViper: boolean;
  filePath?: string;
  additionalSource?: SmartContract['additional_sources'];
}

const ContractSourceCode = ({ data, hasSol2Yml, address, isViper, filePath, additionalSource }: Props) => {
  const heading = (
    <Text fontWeight={ 500 }>
      <span>Contract source code</span>
      <Text whiteSpace="pre" as="span" variant="secondary"> ({ isViper ? 'Vyper' : 'Solidity' })</Text>
    </Text>
  );

  const diagramLink = hasSol2Yml && address ? (
    <Tooltip label="Visualize contract code using Sol2Uml JS library">
      <Link
        href={ link('visualize_sol2uml', undefined, { address }) }
        ml="auto"
        mr={ 3 }
      >
        View UML diagram
      </Link>
    </Tooltip>
  ) : null;

  if (!additionalSource) {
    return (
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={ 3 }>
          { heading }
          { diagramLink }
          <CopyToClipboard text={ data }/>
        </Flex>
        <CodeEditor value={ data } id="source_code"/>
      </Box>
    );
  }

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={ 3 }>
        { heading }
        { diagramLink }
      </Flex>
      <Flex flexDir="column" rowGap={ 3 }>
        { [ { file_path: filePath, source_code: data }, ...additionalSource ].map((item, index, array) => (
          <Box key={ index }>
            <Flex justifyContent="space-between" alignItems="center" mb={ 3 }>
              <chakra.span fontSize="sm">File { index + 1 } of { array.length }: { item.file_path }</chakra.span>
              <CopyToClipboard text={ item.source_code }/>
            </Flex>
            <CodeEditor value={ item.source_code } id={ `source_code_${ index }` }/>
          </Box>
        )) }
      </Flex>
    </Box>
  );
};

export default React.memo(ContractSourceCode);

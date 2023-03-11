import { Flex, Text, Tooltip } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { SmartContract } from 'types/api/contract';

import LinkInternal from 'ui/shared/LinkInternal';
import CodeEditor from 'ui/shared/monaco/CodeEditor';

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
      <LinkInternal
        href={ route({ pathname: '/visualize/sol2uml', query: { address } }) }
        ml="auto"
        mr={ 3 }
      >
        View UML diagram
      </LinkInternal>
    </Tooltip>
  ) : null;

  const editorData = React.useMemo(() => {
    const defaultName = isViper ? 'index.vy' : 'index.sol';
    return [ { file_path: filePath || defaultName, source_code: data }, ...(additionalSource || []) ];
  }, [ additionalSource, data, filePath, isViper ]);

  return (
    <section>
      <Flex justifyContent="space-between" alignItems="center" mb={ 3 }>
        { heading }
        { diagramLink }
      </Flex>
      <CodeEditor data={ editorData }/>
    </section>
  );
};

export default React.memo(ContractSourceCode);

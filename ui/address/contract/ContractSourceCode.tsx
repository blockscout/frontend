import { Box, Flex, Select, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { SmartContract } from 'types/api/contract';
import type { ArrayElement } from 'types/utils';

import CopyToClipboard from 'ui/shared/CopyToClipboard';
import LinkInternal from 'ui/shared/LinkInternal';
import CodeEditor from 'ui/shared/monaco/CodeEditor';
import formatFilePath from 'ui/shared/monaco/utils/formatFilePath';

import { useContractContext } from './context';

const SOURCE_CODE_OPTIONS = [
  { id: 'primary', label: 'Proxy' } as const,
  { id: 'secondary', label: 'Implementation' } as const,
];
type SourceCodeType = ArrayElement<typeof SOURCE_CODE_OPTIONS>['id'];

function getEditorData(contractInfo: SmartContract | undefined) {
  if (!contractInfo || !contractInfo.source_code) {
    return undefined;
  }

  const defaultName = contractInfo.is_vyper_contract ? '/index.vy' : '/index.sol';
  return [
    { file_path: formatFilePath(contractInfo.file_path || defaultName), source_code: contractInfo.source_code },
    ...(contractInfo.additional_sources || []).map((source) => ({ ...source, file_path: formatFilePath(source.file_path) })),
  ];
}

interface Props {
  address?: string; // todo_tom need address of proxy contract
  isLoading?: boolean; // todo_tom should be true if proxyInfo is not loaded
}

// todo_tom fix mobile layout
const ContractSourceCode = ({ address, isLoading }: Props) => {
  const [ sourceType, setSourceType ] = React.useState<SourceCodeType>('primary');

  const { contractInfo: primaryContract, proxyInfo: secondaryContract } = useContractContext();

  const editorDataPrimary = React.useMemo(() => {
    return getEditorData(primaryContract);
  }, [ primaryContract ]);

  const editorDataSecondary = React.useMemo(() => {
    return getEditorData(secondaryContract);
  }, [ secondaryContract ]);

  const activeContract = sourceType === 'secondary' ? secondaryContract : primaryContract;
  const activeContractData = sourceType === 'secondary' ? editorDataSecondary : editorDataPrimary;

  const heading = (
    <Skeleton isLoaded={ !isLoading } fontWeight={ 500 }>
      <span>Contract source code</span>
      <Text whiteSpace="pre" as="span" variant="secondary"> ({ activeContract?.is_vyper_contract ? 'Vyper' : 'Solidity' })</Text>
    </Skeleton>
  );

  const diagramLink = activeContract?.can_be_visualized_via_sol2uml && address ? (
    <Tooltip label="Visualize contract code using Sol2Uml JS library">
      <LinkInternal
        href={ route({ pathname: '/visualize/sol2uml', query: { address } }) }
        ml="auto"
      >
        <Skeleton isLoaded={ !isLoading }>
          View UML diagram
        </Skeleton>
      </LinkInternal>
    </Tooltip>
  ) : null;

  const copyToClipboard = activeContractData?.length === 1 ?
    <CopyToClipboard text={ activeContractData[0].source_code } isLoading={ isLoading } ml={ 3 }/> :
    null;

  const handleSelectChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSourceType(event.target.value as SourceCodeType);
  }, []);

  const editorSourceTypeSelector = secondaryContract?.source_code ? (
    <Select
      size="xs"
      borderRadius="base"
      value={ sourceType }
      onChange={ handleSelectChange }
      focusBorderColor="none"
      w="auto"
      ml={ 3 }
    >
      { SOURCE_CODE_OPTIONS.map((option) => <option key={ option.id } value={ option.id }>{ option.label }</option>) }
    </Select>
  ) : null;

  const content = (() => {
    if (isLoading) {
      return <Skeleton h="557px" w="100%"/>;
    }

    if (!editorDataPrimary) {
      return null;
    }

    return (
      <>
        <Box display={ sourceType === 'primary' ? 'block' : 'none' }>
          <CodeEditor data={ editorDataPrimary } remappings={ primaryContract?.compiler_settings?.remappings }/>
        </Box>
        { editorDataSecondary && (
          <Box display={ sourceType === 'secondary' ? 'block' : 'none' }>
            <CodeEditor data={ editorDataSecondary } remappings={ secondaryContract?.compiler_settings?.remappings }/>
          </Box>
        ) }
      </>
    );
  })();

  if (!editorDataPrimary) {
    return null;
  }

  return (
    <section>
      <Flex justifyContent="space-between" alignItems="center" mb={ 3 }>
        { heading }
        { editorSourceTypeSelector }
        { diagramLink }
        { copyToClipboard }
      </Flex>
      { content }
    </section>
  );
};

export default React.memo(ContractSourceCode);

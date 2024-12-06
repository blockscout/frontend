import { Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import React from 'react';

import type { SmartContract } from 'types/api/contract';

import { route } from 'nextjs-routes';

import CopyToClipboard from 'ui/shared/CopyToClipboard';
import LinkInternal from 'ui/shared/links/LinkInternal';
import CodeEditor from 'ui/shared/monaco/CodeEditor';
import formatFilePath from 'ui/shared/monaco/utils/formatFilePath';

import ContractCodeIdes from './ContractCodeIdes';
import ContractExternalLibraries from './ContractExternalLibraries';

function getEditorData(contractInfo: SmartContract | undefined) {
  if (!contractInfo || !contractInfo.source_code) {
    return undefined;
  }

  const extension = (() => {
    switch (contractInfo.language) {
      case 'vyper':
        return 'vy';
      case 'yul':
        return 'yul';
      default:
        return 'sol';
    }
  })();

  return [
    { file_path: formatFilePath(contractInfo.file_path || `index.${ extension }`), source_code: contractInfo.source_code },
    ...(contractInfo.additional_sources || []).map((source) => ({ ...source, file_path: formatFilePath(source.file_path) })),
  ];
}

interface Props {
  data: SmartContract | undefined;
  sourceAddress: string;
  isLoading?: boolean;
}

export const ContractSourceCode = ({ data, isLoading, sourceAddress }: Props) => {

  const editorData = React.useMemo(() => {
    return getEditorData(data);
  }, [ data ]);

  const heading = (
    <Skeleton isLoaded={ !isLoading } fontWeight={ 500 }>
      <span>Contract source code</span>
      { data?.language &&
        <Text whiteSpace="pre" as="span" variant="secondary" textTransform="capitalize"> ({ data.language })</Text> }
    </Skeleton>
  );

  const externalLibraries = data?.external_libraries ?
    <ContractExternalLibraries data={ data.external_libraries } isLoading={ isLoading }/> :
    null;

  const diagramLink = data?.can_be_visualized_via_sol2uml ? (
    <Tooltip label="Visualize contract code using Sol2Uml JS library">
      <LinkInternal
        href={ route({ pathname: '/visualize/sol2uml', query: { address: sourceAddress } }) }
        ml={{ base: '0', lg: 'auto' }}
        isLoading={ isLoading }
      >
        <Skeleton isLoaded={ !isLoading }>
          View UML diagram
        </Skeleton>
      </LinkInternal>
    </Tooltip>
  ) : null;

  const ides = <ContractCodeIdes hash={ sourceAddress } isLoading={ isLoading }/>;

  const copyToClipboard = data && editorData?.length === 1 ? (
    <CopyToClipboard
      text={ data.source_code }
      isLoading={ isLoading }
      ml={{ base: 'auto', lg: diagramLink ? '0' : 'auto' }}
    />
  ) :
    null;

  const content = (() => {
    if (isLoading) {
      return <Skeleton h="557px" w="100%"/>;
    }

    if (!editorData) {
      return null;
    }

    return (
      <CodeEditor
        key={ sourceAddress }
        data={ editorData }
        remappings={ data?.compiler_settings?.remappings }
        libraries={ data?.external_libraries ?? undefined }
        language={ data?.language ?? undefined }
        mainFile={ editorData[0]?.file_path }
        contractName={ data?.name ?? undefined }
      />
    );
  })();

  return (
    <section>
      <Flex alignItems="center" mb={ 3 } columnGap={ 3 } rowGap={ 2 } flexWrap="wrap">
        { heading }
        { externalLibraries }
        { diagramLink }
        { ides }
        { copyToClipboard }
      </Flex>
      { content }
    </section>
  );
};

export default React.memo(ContractSourceCode);

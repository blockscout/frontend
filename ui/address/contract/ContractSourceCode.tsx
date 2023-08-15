import { Box, Flex, Select, Skeleton, Text, Tooltip } from '@chakra-ui/react';
import React from 'react';

import type { SmartContract } from 'types/api/contract';
import type { ArrayElement } from 'types/utils';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import * as stubs from 'stubs/contract';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import LinkInternal from 'ui/shared/LinkInternal';
import CodeEditor from 'ui/shared/monaco/CodeEditor';
import formatFilePath from 'ui/shared/monaco/utils/formatFilePath';

import ContractExternalLibraries from './ContractExternalLibraries';

const SOURCE_CODE_OPTIONS = [
  { id: 'primary', label: 'Proxy' } as const,
  { id: 'secondary', label: 'Implementation' } as const,
];
type SourceCodeType = ArrayElement<typeof SOURCE_CODE_OPTIONS>['id'];

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
  address?: string;
  implementationAddress?: string;
}

const ContractSourceCode = ({ address, implementationAddress }: Props) => {
  const [ sourceType, setSourceType ] = React.useState<SourceCodeType>('primary');

  const primaryContractQuery = useApiQuery('contract', {
    pathParams: { hash: address },
    queryOptions: {
      enabled: Boolean(address),
      refetchOnMount: false,
      placeholderData: stubs.CONTRACT_CODE_VERIFIED,
    },
  });

  const secondaryContractQuery = useApiQuery('contract', {
    pathParams: { hash: implementationAddress },
    queryOptions: {
      enabled: Boolean(implementationAddress),
      refetchOnMount: false,
      placeholderData: stubs.CONTRACT_CODE_VERIFIED,
    },
  });

  const isLoading = implementationAddress ?
    primaryContractQuery.isPlaceholderData || secondaryContractQuery.isPlaceholderData :
    primaryContractQuery.isPlaceholderData;

  const primaryEditorData = React.useMemo(() => {
    return getEditorData(primaryContractQuery.data);
  }, [ primaryContractQuery.data ]);

  const secondaryEditorData = React.useMemo(() => {
    return secondaryContractQuery.isPlaceholderData ? undefined : getEditorData(secondaryContractQuery.data);
  }, [ secondaryContractQuery.data, secondaryContractQuery.isPlaceholderData ]);

  const activeContract = sourceType === 'secondary' ? secondaryContractQuery.data : primaryContractQuery.data;
  const activeContractData = sourceType === 'secondary' ? secondaryEditorData : primaryEditorData;

  const heading = (
    <Skeleton isLoaded={ !isLoading } fontWeight={ 500 }>
      <span>Contract source code</span>
      { activeContract?.language &&
        <Text whiteSpace="pre" as="span" variant="secondary" textTransform="capitalize"> ({ activeContract.language })</Text> }
    </Skeleton>
  );

  const diagramLinkAddress = (() => {
    if (!activeContract?.can_be_visualized_via_sol2uml) {
      return;
    }
    return sourceType === 'secondary' ? implementationAddress : address;
  })();

  const diagramLink = diagramLinkAddress ? (
    <Tooltip label="Visualize contract code using Sol2Uml JS library">
      <LinkInternal
        href={ route({ pathname: '/visualize/sol2uml', query: { address: diagramLinkAddress } }) }
        ml={{ base: '0', lg: 'auto' }}
      >
        <Skeleton isLoaded={ !isLoading }>
          View UML diagram
        </Skeleton>
      </LinkInternal>
    </Tooltip>
  ) : null;

  const copyToClipboard = activeContractData?.length === 1 ?
    <CopyToClipboard text={ activeContractData[0].source_code } isLoading={ isLoading } ml={{ base: 'auto', lg: diagramLink ? '0' : 'auto' }}/> :
    null;

  const handleSelectChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSourceType(event.target.value as SourceCodeType);
  }, []);

  const editorSourceTypeSelector = !secondaryContractQuery.isPlaceholderData && secondaryContractQuery.data?.source_code ? (
    <Select
      size="xs"
      value={ sourceType }
      onChange={ handleSelectChange }
      focusBorderColor="none"
      w="auto"
      fontWeight={ 600 }
      borderRadius="base"
    >
      { SOURCE_CODE_OPTIONS.map((option) => <option key={ option.id } value={ option.id }>{ option.label }</option>) }
    </Select>
  ) : null;

  const externalLibraries = (() => {
    if (sourceType === 'secondary') {
      return secondaryContractQuery.data?.external_libraries && <ContractExternalLibraries data={ secondaryContractQuery.data.external_libraries }/>;
    }

    return primaryContractQuery.data?.external_libraries && <ContractExternalLibraries data={ primaryContractQuery.data.external_libraries }/>;
  })();

  const content = (() => {
    if (isLoading) {
      return <Skeleton h="557px" w="100%"/>;
    }

    if (!primaryEditorData) {
      return null;
    }

    return (
      <>
        <Box display={ sourceType === 'primary' ? 'block' : 'none' }>
          <CodeEditor
            data={ primaryEditorData }
            remappings={ primaryContractQuery.data?.compiler_settings?.remappings }
            libraries={ primaryContractQuery.data?.external_libraries ?? undefined }
            language={ primaryContractQuery.data?.language ?? undefined }
            mainFile={ primaryEditorData[0]?.file_path }
          />
        </Box>
        { secondaryEditorData && (
          <Box display={ sourceType === 'secondary' ? 'block' : 'none' }>
            <CodeEditor
              data={ secondaryEditorData }
              remappings={ secondaryContractQuery.data?.compiler_settings?.remappings }
              libraries={ secondaryContractQuery.data?.external_libraries ?? undefined }
              language={ secondaryContractQuery.data?.language ?? undefined }
              mainFile={ secondaryEditorData?.[0]?.file_path }
            />
          </Box>
        ) }
      </>
    );
  })();

  if (!primaryEditorData) {
    return null;
  }

  return (
    <section>
      <Flex alignItems="center" mb={ 3 } columnGap={ 3 } rowGap={ 2 } flexWrap="wrap">
        { heading }
        { editorSourceTypeSelector }
        { externalLibraries }
        { diagramLink }
        { copyToClipboard }
      </Flex>
      { content }
    </section>
  );
};

export default React.memo(ContractSourceCode);

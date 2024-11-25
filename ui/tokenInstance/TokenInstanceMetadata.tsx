import { Alert, Box, Flex, Select, chakra } from '@chakra-ui/react';
import React from 'react';

import type { TokenInstance } from 'types/api/token';

import ContentLoader from 'ui/shared/ContentLoader';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

import { useMetadataUpdateContext } from './contexts/metadataUpdate';
import MetadataAccordion from './metadata/MetadataAccordion';

type Format = 'JSON' | 'Table';

interface Props {
  data: TokenInstance['metadata'] | undefined;
  isPlaceholderData?: boolean;
}

const TokenInstanceMetadata = ({ data, isPlaceholderData }: Props) => {
  const [ format, setFormat ] = React.useState<Format>('Table');

  const { status: refetchStatus } = useMetadataUpdateContext() || {};

  const handleSelectChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormat(event.target.value as Format);
  }, []);

  if (isPlaceholderData || refetchStatus === 'WAITING_FOR_RESPONSE') {
    return <ContentLoader/>;
  }

  if (!data) {
    return <Box>There is no metadata for this NFT</Box>;
  }

  const content = format === 'Table' ?
    <MetadataAccordion data={ data }/> :
    <RawDataSnippet data={ JSON.stringify(data, undefined, 4) } showCopy={ false }/>;

  return (
    <Box>
      { refetchStatus === 'ERROR' && (
        <Alert status="warning" display="flow" mb={ 6 }>
          <chakra.span fontWeight={ 600 }>Ooops! </chakra.span>
          <span>We { `couldn't` } refresh metadata. Please try again now or later.</span>
        </Alert>
      ) }
      <Flex alignItems="center" mb={ 6 }>
        <chakra.span fontWeight={ 500 }>Metadata</chakra.span>
        <Select size="xs" borderRadius="base" value={ format } onChange={ handleSelectChange } w="auto" ml={ 5 }>
          <option value="Table">Table</option>
          <option value="JSON">JSON</option>
        </Select>
        { format === 'JSON' && <CopyToClipboard text={ JSON.stringify(data) } ml="auto"/> }
      </Flex>
      { content }
    </Box>
  );
};

export default React.memo(TokenInstanceMetadata);

import { Alert, Box, Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import type { TokenInstance } from 'types/api/token';

import ContentLoader from 'ui/shared/ContentLoader';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import RawDataSnippet from 'ui/shared/RawDataSnippet';
import Select from 'ui/shared/select/Select';

import { useMetadataUpdateContext } from './contexts/metadataUpdate';
import MetadataAccordion from './metadata/MetadataAccordion';

const OPTIONS = [
  { label: 'Table', value: 'Table' as const },
  { label: 'JSON', value: 'JSON' as const },
];

type Format = (typeof OPTIONS)[number]['value'];

interface Props {
  data: TokenInstance['metadata'] | undefined;
  isPlaceholderData?: boolean;
}

const TokenInstanceMetadata = ({ data, isPlaceholderData }: Props) => {
  const [ format, setFormat ] = React.useState<Format>('Table');

  const { status: refetchStatus } = useMetadataUpdateContext() || {};

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
        <Select
          options={ OPTIONS }
          name="metadata-format"
          defaultValue="Table"
          onChange={ setFormat }
          w="85px"
          ml={ 5 }
        />
        { format === 'JSON' && <CopyToClipboard text={ JSON.stringify(data) } ml="auto"/> }
      </Flex>
      { content }
    </Box>
  );
};

export default React.memo(TokenInstanceMetadata);

import { Box, Flex, chakra, createListCollection } from '@chakra-ui/react';
import React from 'react';

import type { TokenInstance } from 'types/api/token';

import { Alert } from 'toolkit/chakra/alert';
import { Select } from 'toolkit/chakra/select';
import ContentLoader from 'ui/shared/ContentLoader';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

import { useMetadataUpdateContext } from './contexts/metadataUpdate';
import MetadataAccordion from './metadata/MetadataAccordion';

const OPTIONS = [
  { label: 'Table', value: 'Table' as const },
  { label: 'JSON', value: 'JSON' as const },
];

const collection = createListCollection({ items: OPTIONS });

type Format = (typeof OPTIONS)[number]['value'];

interface Props {
  data: TokenInstance['metadata'] | undefined;
  isPlaceholderData?: boolean;
}

const TokenInstanceMetadata = ({ data, isPlaceholderData }: Props) => {
  const [ format, setFormat ] = React.useState<Format>('Table');

  const { status: refetchStatus } = useMetadataUpdateContext() || {};

  const handleValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setFormat(value[0] as Format);
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
        <Alert status="warning" mb={ 6 } title="Ooops!" display={{ base: 'block', lg: 'flex' }}>
          <span>We { `couldn't` } refresh metadata. Please try again now or later.</span>
        </Alert>
      ) }
      <Flex alignItems="center" mb={ 6 }>
        <chakra.span fontWeight={ 500 }>Metadata</chakra.span>
        <Select
          collection={ collection }
          placeholder="Select type"
          defaultValue={ [ format ] }
          onValueChange={ handleValueChange }
          ml={ 5 }
          w="100px"
        />
        { format === 'JSON' && <CopyToClipboard text={ JSON.stringify(data) } ml="auto"/> }
      </Flex>
      { content }
    </Box>
  );
};

export default React.memo(TokenInstanceMetadata);

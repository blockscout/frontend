import { Flex, GridItem, Select, Skeleton } from '@chakra-ui/react';
import React from 'react';

import CopyToClipboard from 'ui/shared/CopyToClipboard';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

const FORMATS = [ 'Raw', 'Image', 'UTF-8', 'Base64' ] as const;

type Format = typeof FORMATS[number];

interface Props {
  data: string;
  isLoading?: boolean;
}

const BlobData = ({ data, isLoading }: Props) => {
  const [ format, setFormat ] = React.useState<Format>('Raw');

  const handleSelectChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormat(event.target.value as Format);
  }, []);

  const content = format === 'Raw' ?
    <RawDataSnippet data={ data } showCopy={ false } isLoading={ isLoading }/> :
    <span>FOO BAR</span>;

  return (
    <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 3, lg: 2 }}>
      <Flex alignItems="center" mb={ 3 }>
        <Skeleton fontWeight={{ base: 700, lg: 500 }} isLoaded={ !isLoading }>
            Blob data
        </Skeleton>
        <Skeleton ml={ 5 } isLoaded={ !isLoading }>
          <Select
            size="xs"
            borderRadius="base"
            value={ format }
            onChange={ handleSelectChange }
            focusBorderColor="none"
            w="auto"
          >
            { FORMATS.map((format) => (
              <option key={ format } value={ format }>{ format }</option>
            )) }
          </Select>
        </Skeleton>
        <CopyToClipboard text={ JSON.stringify(data) } ml="auto" isLoading={ isLoading }/>
      </Flex>
      { content }
    </GridItem>
  );
};

export default React.memo(BlobData);

import { createListCollection, Flex, GridItem } from '@chakra-ui/react';
import React from 'react';

import * as blobUtils from 'lib/blob';
import removeNonSignificantZeroBytes from 'lib/blob/removeNonSignificantZeroBytes';
import bytesToBase64 from 'lib/bytesToBase64';
import downloadBlob from 'lib/downloadBlob';
import hexToBase64 from 'lib/hexToBase64';
import hexToBytes from 'lib/hexToBytes';
import hexToUtf8 from 'lib/hexToUtf8';
import { Button } from 'toolkit/chakra/button';
import type { SelectOption } from 'toolkit/chakra/select';
import { Select } from 'toolkit/chakra/select';
import { Skeleton } from 'toolkit/chakra/skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

import BlobDataImage from './BlobDataImage';

const FORMATS = [
  { label: 'Image', value: 'Image' as const },
  { label: 'Raw', value: 'Raw' as const },
  { label: 'UTF-8', value: 'UTF-8' as const },
  { label: 'Base64', value: 'Base64' as const },
];

type Format = typeof FORMATS[number]['value'];

interface Props {
  data: string;
  hash: string;
  isLoading?: boolean;
}

const BlobData = ({ data, isLoading, hash }: Props) => {
  const [ format, setFormat ] = React.useState<Array<Format>>([ 'Raw' ]);

  const guessedType = React.useMemo(() => {
    if (isLoading) {
      return;
    }
    return blobUtils.guessDataType(data);
  }, [ data, isLoading ]);

  const isImage = guessedType?.mime?.startsWith('image/');
  const collection = React.useMemo(() => {
    const formats = isImage ? FORMATS : FORMATS.filter((format) => format.value !== 'Image');
    return createListCollection<SelectOption>({
      items: formats,
    });
  }, [ isImage ]);

  React.useEffect(() => {
    if (isImage) {
      setFormat([ 'Image' ]);
    }
  }, [ isImage ]);

  const handleFormatChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setFormat(value as Array<Format>);
  }, []);

  const handleDownloadButtonClick = React.useCallback(() => {
    const fileBlob = (() => {
      switch (format[0]) {
        case 'Image': {
          const bytes = hexToBytes(data);
          const filteredBytes = removeNonSignificantZeroBytes(bytes);
          return new Blob([ filteredBytes ], { type: guessedType?.mime });
        }
        case 'UTF-8': {
          return new Blob([ hexToUtf8(data) ], { type: guessedType?.mime ?? 'text/plain' });
        }
        case 'Base64': {
          return new Blob([ hexToBase64(data) ], { type: 'application/octet-stream' });
        }
        case 'Raw': {
          return new Blob([ data ], { type: 'application/octet-stream' });
        }
      }
    })();
    const fileName = `blob_${ hash }`;

    downloadBlob(fileBlob, fileName);
  }, [ data, format, guessedType, hash ]);

  const content = (() => {
    switch (format[0]) {
      case 'Image': {
        if (!guessedType?.mime?.startsWith('image/')) {
          return <RawDataSnippet data="Not an image" showCopy={ false } isLoading={ isLoading }/>;
        }

        const bytes = hexToBytes(data);
        const filteredBytes = removeNonSignificantZeroBytes(bytes);
        const base64 = bytesToBase64(filteredBytes);

        const imgSrc = `data:${ guessedType.mime };base64,${ base64 }`;

        return <BlobDataImage src={ imgSrc }/>;
      }
      case 'UTF-8':
        return <RawDataSnippet data={ hexToUtf8(data) } showCopy={ false } isLoading={ isLoading } contentProps={{ wordBreak: 'break-word' }}/>;
      case 'Base64':
        return <RawDataSnippet data={ hexToBase64(data) } showCopy={ false } isLoading={ isLoading }/>;
      case 'Raw':
        return <RawDataSnippet data={ data } showCopy={ false } isLoading={ isLoading }/>;
      default:
        return <span/>;
    }
  })();

  return (
    <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 3, lg: 2 }}>
      <Flex alignItems="center" mb={ 3 }>
        <Skeleton fontWeight={{ base: 700, lg: 500 }} loading={ isLoading }>
          Blob data
        </Skeleton>
        <Select
          collection={ collection }
          placeholder="Select type"
          value={ format }
          onValueChange={ handleFormatChange }
          ml={ 5 }
          w="100px"
          loading={ isLoading }
        />
        <Skeleton ml="auto" mr={ 3 } loading={ isLoading }>
          <Button
            variant="outline"
            size="sm"
            onClick={ handleDownloadButtonClick }
          >
            Download
          </Button>
        </Skeleton>
        <CopyToClipboard text={ data } isLoading={ isLoading }/>
      </Flex>
      { content }
    </GridItem>
  );
};

export default React.memo(BlobData);

import { Flex, GridItem, Skeleton, Button } from '@chakra-ui/react';
import React from 'react';

import * as blobUtils from 'lib/blob';
import removeNonSignificantZeroBytes from 'lib/blob/removeNonSignificantZeroBytes';
import bytesToBase64 from 'lib/bytesToBase64';
import downloadBlob from 'lib/downloadBlob';
import hexToBase64 from 'lib/hexToBase64';
import hexToBytes from 'lib/hexToBytes';
import hexToUtf8 from 'lib/hexToUtf8';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import RawDataSnippet from 'ui/shared/RawDataSnippet';
import Select from 'ui/shared/select/Select';

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
  const [ format, setFormat ] = React.useState<Format>('Raw');

  const guessedType = React.useMemo(() => {
    if (isLoading) {
      return;
    }
    return blobUtils.guessDataType(data);
  }, [ data, isLoading ]);

  const isImage = guessedType?.mime?.startsWith('image/');
  const formats = isImage ? FORMATS : FORMATS.filter((format) => format.value !== 'Image');

  React.useEffect(() => {
    if (isImage) {
      setFormat('Image');
    }
  }, [ isImage ]);

  const handleDownloadButtonClick = React.useCallback(() => {
    const fileBlob = (() => {
      switch (format) {
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
    switch (format) {
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
        <Skeleton fontWeight={{ base: 700, lg: 500 }} isLoaded={ !isLoading }>
          Blob data
        </Skeleton>
        <Skeleton ml={ 5 } isLoaded={ !isLoading }>
          <Select
            options={ formats }
            name="format"
            defaultValue={ format }
            onChange={ setFormat }
            isLoading={ isLoading }
            w="95px"
          />
        </Skeleton>
        <Skeleton ml="auto" mr={ 3 } isLoaded={ !isLoading }>
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

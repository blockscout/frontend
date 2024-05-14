import { Flex, GridItem, Select, Skeleton, Button } from '@chakra-ui/react';
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

import BlobDataImage from './BlobDataImage';

const FORMATS = [ 'Image', 'Raw', 'UTF-8', 'Base64' ] as const;

type Format = typeof FORMATS[number];

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
  const formats = isImage ? FORMATS : FORMATS.filter((format) => format !== 'Image');

  React.useEffect(() => {
    if (isImage) {
      setFormat('Image');
    }
  }, [ isImage ]);

  const handleSelectChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormat(event.target.value as Format);
  }, []);

  const handleDownloadButtonClick = React.useCallback(() => {
    const fileBlob = (() => {
      switch (format) {
        case 'Image': {
          const bytes = new Uint8Array(hexToBytes(data));
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

        const bytes = new Uint8Array(hexToBytes(data));
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
            size="xs"
            borderRadius="base"
            value={ format }
            onChange={ handleSelectChange }
            w="auto"
          >
            { formats.map((format) => (
              <option key={ format } value={ format }>{ format }</option>
            )) }
          </Select>
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

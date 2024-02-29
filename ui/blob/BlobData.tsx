import { Flex, GridItem, Select, Skeleton } from '@chakra-ui/react';
import React from 'react';

import * as blobUtils from 'lib/blob';
import hexToBase64 from 'lib/hexToBase64';
import hexToUtf8 from 'lib/hexToUtf8';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

import BlobDataImage from './BlobDataImage';

const FORMATS = [ 'Raw', 'Image', 'UTF-8', 'Base64' ] as const;

type Format = typeof FORMATS[number];

interface Props {
  data: string;
  isLoading?: boolean;
}

const BlobData = ({ isLoading, data }: Props) => {
  const [ format, setFormat ] = React.useState<Format>('Raw');

  const guessedType = React.useMemo(() => {
    if (isLoading) {
      return;
    }
    return blobUtils.guessDataType(data);
  }, [ data, isLoading ]);

  const isImage = guessedType?.mime?.startsWith('image/');
  const formats = isImage ? FORMATS : FORMATS.filter((format) => format !== 'Image');

  const handleSelectChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormat(event.target.value as Format);
  }, []);

  const content = (() => {
    switch (format) {
      case 'Image': {
        if (!guessedType?.mime?.startsWith('image/')) {
          return <RawDataSnippet data="Not an image" showCopy={ false } isLoading={ isLoading }/>;
        }

        const base64 = hexToBase64(data);
        const imgSrc = `data:${ guessedType.mime };base64,${ base64 }`;

        return <BlobDataImage src={ imgSrc }/>;
      }
      case 'UTF-8':
        return <RawDataSnippet data={ hexToUtf8(data) } showCopy={ false } isLoading={ isLoading }/>;
      case 'Base64':
        return <RawDataSnippet data={ hexToBase64(data) } showCopy={ false } isLoading={ isLoading }/>;
      case 'Raw':
        return <RawDataSnippet data={ data } showCopy={ false } isLoading={ isLoading }/>;
      default:
        return <span>fallback</span>;
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
            focusBorderColor="none"
            w="auto"
          >
            { formats.map((format) => (
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

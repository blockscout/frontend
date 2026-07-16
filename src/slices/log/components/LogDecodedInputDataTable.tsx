// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Grid, type JsxStyleProps } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import CopyToClipboard from 'src/shared/texts/CopyToClipboard';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TruncatedText } from 'src/toolkit/components/truncation/TruncatedText';

interface Props extends JsxStyleProps {
  data: schemas['DecodedLogInput']['parameters'] | schemas['DecodedInput']['parameters'];
  isLoading?: boolean;
}

const HeaderItem = ({ children, isLoading }: { children: React.ReactNode; isLoading?: boolean }) => {
  return (
    <Skeleton
      fontWeight={ 600 }
      pb={ 1 }
      display="inline-block"
      width="fit-content"
      height="fit-content"
      loading={ isLoading }
    >
      { children }
    </Skeleton>
  );
};

const Row = ({
  name,
  type,
  indexed,
  value,
  isLoading,
}: Omit<schemas['DecodedLogInput']['parameters'][number], 'indexed'> & { indexed?: boolean; isLoading?: boolean }) => {
  const content = (() => {
    if (type === 'address' && typeof value === 'string') {
      return (
        <AddressEntity
          address={{ hash: value, name: '' }}
          isLoading={ isLoading }
        />
      );
    }

    if (typeof value === 'object') {
      const text = JSON.stringify(value, undefined, 4);
      return (
        <Flex alignItems="flex-start" whiteSpace="normal" wordBreak="break-all">
          <TruncatedText text={ text } loading={ isLoading }/>
          <CopyToClipboard text={ text } isLoading={ isLoading }/>
        </Flex>
      );
    }

    return (
      <Flex alignItems="flex-start" whiteSpace="normal" wordBreak="break-all">
        <TruncatedText text={ value } loading={ isLoading }/>
        <CopyToClipboard text={ value } isLoading={ isLoading }/>
      </Flex>
    );
  })();

  return (
    <>
      <TruncatedText text={ name } loading={ isLoading }/>
      <TruncatedText text={ type } loading={ isLoading }/>
      { indexed !== undefined && (
        <Skeleton loading={ isLoading } display="inline-block">{ indexed ? 'true' : 'false' }</Skeleton>
      ) }
      <Skeleton loading={ isLoading } display="inline-block">{ content }</Skeleton>
    </>
  );
};

const LogDecodedInputDataTable = ({ data, isLoading, ...rest }: Props) => {
  const hasIndexed = data.some((item) => 'indexed' in item && typeof item.indexed === 'boolean');

  const gridTemplateColumnsBase = hasIndexed ?
    '50px 60px 40px minmax(0, 1fr)' :
    '50px 60px minmax(0, 1fr)';
  const gridTemplateColumnsLg = hasIndexed ?
    '80px 80px 80px minmax(0, 1fr)' :
    '80px 80px minmax(0, 1fr)';

  return (
    <Grid
      gridTemplateColumns={{ base: gridTemplateColumnsBase, lg: gridTemplateColumnsLg }}
      textStyle="sm"
      bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
      p={ 4 }
      mt={ 2 }
      w="100%"
      columnGap={ 5 }
      rowGap={ 5 }
      borderBottomLeftRadius="md"
      borderBottomRightRadius="md"
      { ...rest }
    >
      <HeaderItem isLoading={ isLoading }>Name</HeaderItem>
      <HeaderItem isLoading={ isLoading }>Type</HeaderItem>
      { hasIndexed && <HeaderItem isLoading={ isLoading }>Inde<wbr/>xed?</HeaderItem> }
      <HeaderItem isLoading={ isLoading }>Data</HeaderItem>
      { data.map((item) => {

        return (
          <Row
            key={ item.name }
            name={ item.name || 'unnamed' }
            type={ item.type || '' }
            value={ item.value || '-' }
            indexed={ 'indexed' in item ? item.indexed : undefined }
            isLoading={ isLoading }
          />
        );
      }) }
    </Grid>
  );
};

export default LogDecodedInputDataTable;

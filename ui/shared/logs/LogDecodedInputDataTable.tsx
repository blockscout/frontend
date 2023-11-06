import { Flex, Grid, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { DecodedInput } from 'types/api/decodedInput';
import type { ArrayElement } from 'types/utils';

import CopyToClipboard from 'ui/shared/CopyToClipboard';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TruncatedValue from 'ui/shared/TruncatedValue';

interface Props {
  data: DecodedInput['parameters'];
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
      isLoaded={ !isLoading }
    >
      { children }
    </Skeleton>
  );
};

const Row = ({ name, type, indexed, value, isLoading }: ArrayElement<DecodedInput['parameters']> & { isLoading?: boolean }) => {
  const content = (() => {
    if (type === 'address' && typeof value === 'string') {
      return (
        <AddressEntity
          address={{ hash: value, name: '', implementation_name: null, is_contract: false, is_verified: false }}
          isLoading={ isLoading }
        />
      );
    }

    if (typeof value === 'object') {
      const text = JSON.stringify(value, undefined, 4);
      return (
        <Flex alignItems="flex-start" justifyContent="space-between" whiteSpace="normal" wordBreak="break-all">
          <TruncatedValue value={ text } isLoading={ isLoading }/>
          <CopyToClipboard text={ text } isLoading={ isLoading }/>
        </Flex>
      );
    }

    return (
      <Flex alignItems="flex-start" justifyContent="space-between" whiteSpace="normal" wordBreak="break-all">
        <TruncatedValue value={ value } isLoading={ isLoading }/>
        <CopyToClipboard text={ value } isLoading={ isLoading }/>
      </Flex>
    );
  })();

  return (
    <>
      <TruncatedValue value={ name } isLoading={ isLoading }/>
      <TruncatedValue value={ type } isLoading={ isLoading }/>
      { indexed !== undefined && (
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ indexed ? 'true' : 'false' }</Skeleton>
      ) }
      <Skeleton isLoaded={ !isLoading } display="inline-block">{ content }</Skeleton>
    </>
  );
};

const LogDecodedInputDataTable = ({ data, isLoading }: Props) => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const hasIndexed = data.some(({ indexed }) => indexed !== undefined);

  const gridTemplateColumnsBase = hasIndexed ?
    '50px 60px 40px minmax(0, 1fr)' :
    '50px 60px minmax(0, 1fr)';
  const gridTemplateColumnsLg = hasIndexed ?
    '80px 80px 80px minmax(0, 1fr)' :
    '80px 80px minmax(0, 1fr)';

  return (
    <Grid
      gridTemplateColumns={{ base: gridTemplateColumnsBase, lg: gridTemplateColumnsLg }}
      fontSize="sm"
      lineHeight={ 5 }
      bgColor={ bgColor }
      p={ 4 }
      mt={ 2 }
      w="100%"
      columnGap={ 5 }
      rowGap={ 5 }
      borderBottomLeftRadius="md"
      borderBottomRightRadius="md"
    >
      <HeaderItem isLoading={ isLoading }>Name</HeaderItem>
      <HeaderItem isLoading={ isLoading }>Type</HeaderItem>
      { hasIndexed && <HeaderItem isLoading={ isLoading }>Inde<wbr/>xed?</HeaderItem> }
      <HeaderItem isLoading={ isLoading }>Data</HeaderItem>
      { data.map((item) => {

        return <Row key={ item.name } { ...item } isLoading={ isLoading }/>;
      }) }
    </Grid>
  );
};

export default LogDecodedInputDataTable;

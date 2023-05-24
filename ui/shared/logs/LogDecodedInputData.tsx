import { Flex, Grid, GridItem, useColorModeValue, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { DecodedInput } from 'types/api/decodedInput';

import Address from 'ui/shared/address/Address';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface RowProps {
  children: React.ReactNode;
  isLast?: boolean;
  name: string;
  type: string;
  indexed?: boolean;
  isLoading?: boolean;
}

const PADDING = 4;
const GAP = 5;

const TableRow = ({ isLast, name, type, children, indexed, isLoading }: RowProps) => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <>
      <GridItem
        pl={ PADDING }
        pr={ GAP }
        pt={ GAP }
        pb={ isLast ? PADDING : 0 }
        bgColor={ bgColor }
        borderBottomLeftRadius={ isLast ? 'md' : 'none' }
      >
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ name }</Skeleton>
      </GridItem>
      <GridItem
        pr={ GAP }
        pt={ GAP }
        pb={ isLast ? PADDING : 0 }
        bgColor={ bgColor }
      >
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ type }</Skeleton>
      </GridItem>
      { indexed !== undefined && (
        <GridItem
          pr={ GAP }
          pt={ GAP }
          pb={ isLast ? PADDING : 0 }
          bgColor={ bgColor }
        >
          <Skeleton isLoaded={ !isLoading } display="inline-block">{ indexed ? 'true' : 'false' }</Skeleton>
        </GridItem>
      ) }
      <GridItem
        pr={ PADDING }
        pt={ GAP }
        pb={ isLast ? PADDING : 0 }
        bgColor={ bgColor }
        borderBottomRightRadius={ isLast ? 'md' : 'none' }
      >
        { children }
      </GridItem>
    </>
  );
};

interface Props {
  data: DecodedInput;
  isLoading?: boolean;
}

const LogDecodedInputData = ({ data, isLoading }: Props) => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const hasIndexed = data.parameters.some(({ indexed }) => indexed !== undefined);

  const gridTemplateColumns = hasIndexed ?
    'minmax(80px, auto) minmax(80px, auto) minmax(80px, auto) minmax(0, 1fr)' :
    'minmax(80px, auto) minmax(80px, auto) minmax(0, 1fr)';
  const colNumber = hasIndexed ? 4 : 3;

  return (
    <Grid gridTemplateColumns={ gridTemplateColumns } fontSize="sm" lineHeight={ 5 } w="100%">
      { /* FIRST PART OF BLOCK */ }
      <GridItem fontWeight={ 600 } pl={{ base: 0, lg: PADDING }} pr={{ base: 0, lg: GAP }} colSpan={{ base: colNumber, lg: undefined }}>
        <Skeleton isLoaded={ !isLoading }>Method Id</Skeleton>
      </GridItem>
      <GridItem colSpan={{ base: colNumber, lg: colNumber - 1 }} pr={{ base: 0, lg: PADDING }} mt={{ base: 2, lg: 0 }}>
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ data.method_id }</Skeleton>
      </GridItem>
      <GridItem
        py={ 2 }
        mt={ 2 }
        pl={{ base: 0, lg: PADDING }}
        pr={{ base: 0, lg: GAP }}
        fontWeight={ 600 }
        borderTopColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
        borderTopWidth="1px"
        colSpan={{ base: colNumber, lg: undefined }}
      >
        <Skeleton isLoaded={ !isLoading }>Call</Skeleton>
      </GridItem>
      <GridItem
        py={{ base: 0, lg: 2 }}
        mt={{ base: 0, lg: 2 }}
        mb={{ base: 2, lg: 0 }}
        colSpan={{ base: colNumber, lg: colNumber - 1 }}
        pr={{ base: 0, lg: PADDING }}
        borderTopColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
        borderTopWidth={{ base: '0px', lg: '1px' }}
        whiteSpace="normal"
      >
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ data.method_call }</Skeleton>
      </GridItem>
      { /* TABLE INSIDE OF BLOCK */ }
      { data.parameters.length > 0 && (
        <>
          <GridItem
            pl={ PADDING }
            pr={ GAP }
            pt={ PADDING }
            pb={ 1 }
            bgColor={ bgColor }
            fontWeight={ 600 }
          >
            <Skeleton isLoaded={ !isLoading } display="inline-block">Name</Skeleton>
          </GridItem>
          <GridItem
            pr={ GAP }
            pt={ PADDING }
            pb={ 1 }
            bgColor={ bgColor }
            fontWeight={ 600 }
          >
            <Skeleton isLoaded={ !isLoading } display="inline-block">Type</Skeleton>
          </GridItem>
          { hasIndexed && (
            <GridItem
              pr={ GAP }
              pt={ PADDING }
              pb={ 1 }
              bgColor={ bgColor }
              fontWeight={ 600 }
            >
              <Skeleton isLoaded={ !isLoading } display="inline-block">Inde<wbr/>xed?</Skeleton>
            </GridItem>
          ) }
          <GridItem
            pr={ PADDING }
            pt={ PADDING }
            pb={ 1 }
            bgColor={ bgColor }
            fontWeight={ 600 }
          >
            <Skeleton isLoaded={ !isLoading } display="inline-block">Data</Skeleton>
          </GridItem>
        </>
      ) }
      { data.parameters.map(({ name, type, value, indexed }, index) => {
        const content = (() => {
          if (type === 'address' && typeof value === 'string') {
            return (
              <Address justifyContent="space-between">
                <AddressLink type="address" hash={ value } isLoading={ isLoading }/>
                <CopyToClipboard text={ value } isLoading={ isLoading }/>
              </Address>
            );
          }

          if (typeof value === 'object') {
            const text = JSON.stringify(value, undefined, 4);
            return (
              <Flex alignItems="flex-start" justifyContent="space-between" whiteSpace="normal" wordBreak="break-all">
                <Skeleton isLoaded={ !isLoading } display="inline-block">{ text }</Skeleton>
                <CopyToClipboard text={ text } isLoading={ isLoading }/>
              </Flex>
            );
          }

          return (
            <Flex alignItems="flex-start" justifyContent="space-between" whiteSpace="normal" wordBreak="break-all">
              <Skeleton isLoaded={ !isLoading } display="inline-block">{ value }</Skeleton>
              <CopyToClipboard text={ value } isLoading={ isLoading }/>
            </Flex>
          );
        })();

        return (
          <TableRow
            key={ name }
            name={ name }
            type={ type }
            isLast={ index === data.parameters.length - 1 }
            indexed={ indexed }
            isLoading={ isLoading }
          >
            { content }
          </TableRow>
        );
      }) }
    </Grid>
  );
};

export default LogDecodedInputData;

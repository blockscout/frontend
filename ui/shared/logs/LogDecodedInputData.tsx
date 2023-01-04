import { Flex, Text, Grid, GridItem, useColorModeValue } from '@chakra-ui/react';
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
}

const PADDING = 4;
const GAP = 5;

const TableRow = ({ isLast, name, type, children, indexed }: RowProps) => {
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
        { name }
      </GridItem>
      <GridItem
        pr={ GAP }
        pt={ GAP }
        pb={ isLast ? PADDING : 0 }
        bgColor={ bgColor }
      >
        { type }
      </GridItem>
      { indexed !== undefined && (
        <GridItem
          pr={ GAP }
          pt={ GAP }
          pb={ isLast ? PADDING : 0 }
          bgColor={ bgColor }
        >
          { indexed ? 'true' : 'false' }
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
}

const LogDecodedInputData = ({ data }: Props) => {
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
        Method Id
      </GridItem>
      <GridItem colSpan={{ base: colNumber, lg: colNumber - 1 }} pr={{ base: 0, lg: PADDING }} mt={{ base: 2, lg: 0 }}>
        { data.method_id }
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
        Call
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
        { data.method_call }
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
        Name
          </GridItem>
          <GridItem
            pr={ GAP }
            pt={ PADDING }
            pb={ 1 }
            bgColor={ bgColor }
            fontWeight={ 600 }
          >
        Type
          </GridItem>
          { hasIndexed && (
            <GridItem
              pr={ GAP }
              pt={ PADDING }
              pb={ 1 }
              bgColor={ bgColor }
              fontWeight={ 600 }
            >
          Inde<wbr/>xed?
            </GridItem>
          ) }
          <GridItem
            pr={ PADDING }
            pt={ PADDING }
            pb={ 1 }
            bgColor={ bgColor }
            fontWeight={ 600 }
          >
        Data
          </GridItem>
        </>
      ) }
      { data.parameters.map(({ name, type, value, indexed }, index) => {
        return (
          <TableRow key={ name } name={ name } type={ type } isLast={ index === data.parameters.length - 1 } indexed={ indexed }>
            { type === 'address' ? (
              <Address justifyContent="space-between">
                <AddressLink hash={ value }/>
                <CopyToClipboard text={ value }/>
              </Address>
            ) : (
              <Flex alignItems="flex-start" justifyContent="space-between" whiteSpace="normal" wordBreak="break-all">
                <Text>{ String(value) }</Text>
                <CopyToClipboard text={ value }/>
              </Flex>
            ) }
          </TableRow>
        );
      }) }
    </Grid>
  );
};

export default LogDecodedInputData;

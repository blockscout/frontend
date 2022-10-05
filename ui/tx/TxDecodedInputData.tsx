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

const TableRow = ({ isLast, name, type, children }: RowProps) => {
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
      { /* <GridItem
        pr={ GAP }
        pt={ GAP }
        pb={ isLast ? PADDING : 0 }
        bgColor={ bgColor }
      >
        { indexed ? 'true' : 'false' }
      </GridItem> */ }
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

const TxDecodedInputData = ({ data }: Props) => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <Grid gridTemplateColumns="minmax(80px, auto) minmax(80px, auto) minmax(0, 1fr)" fontSize="sm" lineHeight={ 5 } w="100%">
      { /* FIRST PART OF BLOCK */ }
      <GridItem fontWeight={ 600 } pl={{ base: 0, lg: PADDING }} pr={{ base: 0, lg: GAP }} colSpan={{ base: 3, lg: undefined }}>Method Id</GridItem>
      <GridItem colSpan={{ base: 3, lg: 2 }} pr={{ base: 0, lg: PADDING }} mt={{ base: 2, lg: 0 }}>{ data.method_id }</GridItem>
      <GridItem
        py={ 2 }
        mt={ 2 }
        pl={{ base: 0, lg: PADDING }}
        pr={{ base: 0, lg: GAP }}
        fontWeight={ 600 }
        borderTopColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
        borderTopWidth="1px"
        colSpan={{ base: 3, lg: undefined }}
      >
        Call
      </GridItem>
      <GridItem
        py={{ base: 0, lg: 2 }}
        mt={{ base: 0, lg: 2 }}
        mb={{ base: 2, lg: 0 }}
        colSpan={{ base: 3, lg: 2 }}
        pr={{ base: 0, lg: PADDING }}
        borderTopColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
        borderTopWidth={{ base: '0px', lg: '1px' }}
        whiteSpace="normal"
      >
        { data.method_call }
      </GridItem>
      { /* TABLE INSIDE OF BLOCK */ }
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
      { /* <GridItem
        pr={ GAP }
        pt={ PADDING }
        pb={ 1 }
        bgColor={ bgColor }
        fontWeight={ 600 }
      >
        Inde<wbr/>xed?
      </GridItem> */ }
      <GridItem
        pr={ PADDING }
        pt={ PADDING }
        pb={ 1 }
        bgColor={ bgColor }
        fontWeight={ 600 }
      >
        Data
      </GridItem>
      { data.parameters.map(({ name, type, value }, index) => {
        const formattedValue = type.startsWith('uint') ? BigInt(value).toString() : value;
        return (
          <TableRow key={ name } name={ name } type={ type } isLast={ index === data.parameters.length - 1 }>
            { type === 'address' ? (
              <Address justifyContent="space-between">
                <AddressLink hash={ value }/>
                <CopyToClipboard text={ value }/>
              </Address>
            ) : (
              <Flex alignItems="flex-start" justifyContent="space-between" whiteSpace="normal" wordBreak="break-all">
                <Text>{ value }</Text>
                <br/>
                <Text>{ formattedValue }</Text>
                <CopyToClipboard text={ value }/>
              </Flex>
            ) }
          </TableRow>
        );
      }) }
    </Grid>
  );
};

export default TxDecodedInputData;

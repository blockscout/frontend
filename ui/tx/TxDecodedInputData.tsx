import { Flex, Text, Grid, GridItem, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

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
      <GridItem
        pr={ GAP }
        pt={ GAP }
        pb={ isLast ? PADDING : 0 }
        bgColor={ bgColor }
      >
        { indexed ? 'true' : 'false' }
      </GridItem>
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

const TxDecodedInputData = () => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <Grid gridTemplateColumns="minmax(80px, auto) minmax(80px, auto) minmax(80px, auto) minmax(0, 1fr)" fontSize="sm" lineHeight={ 5 } w="100%">
      { /* FIRST PART OF BLOCK */ }
      <GridItem fontWeight={ 600 } pl={{ base: 0, lg: PADDING }} pr={{ base: 0, lg: GAP }} colSpan={{ base: 4, lg: undefined }}>Method Id</GridItem>
      <GridItem colSpan={{ base: 4, lg: 3 }} pr={{ base: 0, lg: PADDING }} mt={{ base: 2, lg: 0 }}>0xddf252ad</GridItem>
      <GridItem
        py={ 2 }
        mt={ 2 }
        pl={{ base: 0, lg: PADDING }}
        pr={{ base: 0, lg: GAP }}
        fontWeight={ 600 }
        borderTopColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
        borderTopWidth="1px"
        colSpan={{ base: 4, lg: undefined }}
      >
        Call
      </GridItem>
      <GridItem
        py={{ base: 0, lg: 2 }}
        mt={{ base: 0, lg: 2 }}
        mb={{ base: 2, lg: 0 }}
        colSpan={{ base: 4, lg: 3 }}
        pr={{ base: 0, lg: PADDING }}
        borderTopColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
        borderTopWidth={{ base: '0px', lg: '1px' }}
        whiteSpace="normal"
      >
        Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
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
      <GridItem
        pr={ GAP }
        pt={ PADDING }
        pb={ 1 }
        bgColor={ bgColor }
        fontWeight={ 600 }
      >
        Indexed?
      </GridItem>
      <GridItem
        pr={ PADDING }
        pt={ PADDING }
        pb={ 1 }
        bgColor={ bgColor }
        fontWeight={ 600 }
      >
        Data
      </GridItem>
      <TableRow name="from" type="address">
        <Address justifyContent="space-between">
          <AddressLink hash="0x0000000000000000000000000000000000000000"/>
          <CopyToClipboard text="0x0000000000000000000000000000000000000000"/>
        </Address>
      </TableRow>
      <TableRow name="to" type="address" indexed>
        <Address justifyContent="space-between">
          <AddressLink hash="0xcf0c50b7ea8af37d57380a0ac199d55b0782c718"/>
          <CopyToClipboard text="0xcf0c50b7ea8af37d57380a0ac199d55b0782c718"/>
        </Address>
      </TableRow>
      <TableRow name="tokenId" type="uint256" isLast>
        <Flex alignItems="center" justifyContent="space-between">
          <Text>116842</Text>
          <CopyToClipboard text="116842"/>
        </Flex>
      </TableRow>
    </Grid>
  );
};

export default TxDecodedInputData;

import { Grid, GridItem, Text, Box, Icon, Link, Flex, Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import type { Transaction } from 'types/api/transaction';

import clockIcon from 'icons/clock.svg';
import flameIcon from 'icons/flame.svg';
import { WEI, WEI_IN_GWEI } from 'lib/consts';
// import errorIcon from 'icons/status/error.svg';
// import successIcon from 'icons/status/success.svg';
import dayjs from 'lib/date/dayjs';
import useFetch from 'lib/hooks/useFetch';
import useNetwork from 'lib/hooks/useNetwork';
import getConfirmationDuration from 'lib/tx/getConfirmationDuration';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import CurrencyValue from 'ui/shared/CurrencyValue';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import PrevNext from 'ui/shared/PrevNext';
import RawInputData from 'ui/shared/RawInputData';
import TextSeparator from 'ui/shared/TextSeparator';
// import TokenSnippet from 'ui/shared/TokenSnippet';
import TxStatus from 'ui/shared/TxStatus';
import Utilization from 'ui/shared/Utilization';
import TxDetailsSkeleton from 'ui/tx/details/TxDetailsSkeleton';
import TokenTransfer from 'ui/tx/TokenTransfer';
import TxDecodedInputData from 'ui/tx/TxDecodedInputData';

const TxDetails = () => {
  const selectedNetwork = useNetwork();
  const router = useRouter();
  const fetch = useFetch();

  const { data, isLoading, isError } = useQuery<unknown, unknown, Transaction>(
    [ 'tx', router.query.id ],
    async() => await fetch(`/api/transactions/${ router.query.id }`),
    {
      enabled: Boolean(router.query.id),
    },
  );

  const [ isExpanded, setIsExpanded ] = React.useState(false);

  const handleCutClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
    scroller.scrollTo('TxDetails__cutLink', {
      duration: 500,
      smooth: true,
    });
  }, []);

  if (isLoading) {
    return <TxDetailsSkeleton/>;
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  return (
    <Grid columnGap={ 8 } rowGap={{ base: 3, lg: 3 }} templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }}>
      <DetailsInfoItem
        title="Transaction hash"
        hint="Unique character string (TxID) assigned to every verified transaction."
        flexWrap="nowrap"
      >
        { data.status === null && <Spinner mr={ 2 } size="sm" flexShrink={ 0 }/> }
        <Box overflow="hidden">
          <HashStringShortenDynamic hash={ data.hash }/>
        </Box>
        <CopyToClipboard text={ data.hash }/>
        <PrevNext ml={ 7 }/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Status"
        hint="Current transaction state: Success, Failed (Error), or Pending (In Process)"
      >
        <TxStatus status={ data.status } errorText={ data.status === 'error' ? data.result : undefined }/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Block"
        hint="Block number containing the transaction."
      >
        <Text>{ data.block === null ? 'Pending' : data.block }</Text>
        { Boolean(data.confirmations) && (
          <>
            <TextSeparator color="gray.500"/>
            <Text variant="secondary">
              { data.confirmations } Block confirmations
            </Text>
          </>
        ) }
      </DetailsInfoItem>
      { data.timestamp && (
        <DetailsInfoItem
          title="Timestamp"
          hint="Date & time of transaction inclusion, including length of time for confirmation."
        >
          <Icon as={ clockIcon } boxSize={ 5 } color="gray.500"/>
          <Text ml={ 1 }>{ dayjs(data.timestamp).fromNow() }</Text>
          <TextSeparator/>
          <Text whiteSpace="normal">{ dayjs(data.timestamp).format('LLLL') }<TextSeparator color="gray.500"/></Text>
          <Text variant="secondary">{ getConfirmationDuration(data.confirmation_duration) }</Text>
        </DetailsInfoItem>
      ) }
      <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 3, lg: 8 }}/>
      <DetailsInfoItem
        title="From"
        hint="Address (external or contract) sending the transaction."
      >
        <Address>
          <AddressIcon hash={ data.from.hash }/>
          <AddressLink ml={ 2 } hash={ data.from.hash } alias={ data.from.name }/>
          <CopyToClipboard text={ data.from.hash }/>
        </Address>
      </DetailsInfoItem>
      <DetailsInfoItem
        title={ data.to.is_contract ? 'Interacted with contract' : 'To' }
        hint="Address (external or contract) receiving the transaction."
        flexWrap={{ base: 'wrap', lg: 'nowrap' }}
      >
        <Address mr={ 3 }>
          <AddressIcon hash={ data.to.hash }/>
          <AddressLink ml={ 2 } hash={ data.to.hash } alias={ data.to.name }/>
          <CopyToClipboard text={ data.to.hash }/>
        </Address>
        { /* todo_tom Nikita should add to api later */ }
        { /* <Tag colorScheme="orange" variant="solid" flexShrink={ 0 }>SANA</Tag> */ }
        { /* <Tooltip label="Contract execution completed">
          <chakra.span display="inline-flex">
            <Icon as={ successIcon } boxSize={ 4 } ml={ 2 } color="green.500" cursor="pointer"/>
          </chakra.span>
        </Tooltip> */ }
        { /* <Tooltip label="Error occured during contract execution">
          <chakra.span display="inline-flex">
            <Icon as={ errorIcon } boxSize={ 4 } ml={ 2 } color="red.500" cursor="pointer"/>
          </chakra.span>
        </Tooltip> */ }
        { /* <TokenSnippet symbol="UP" name="User Pay" hash="0xA17ed5dFc62D0a3E74D69a0503AE9FdA65d9f212" ml={ 3 }/> */ }
      </DetailsInfoItem>
      { (data.token_transfers?.length || 0) > 0 && (
        <DetailsInfoItem
          title="Token transferred"
          hint="List of token transferred in the transaction."
        >
          <Flex flexDirection="column" alignItems="flex-start" rowGap={ 5 } w="100%">
            { data.token_transfers?.map((item, index) => <TokenTransfer key={ index } { ...item }/>) }
          </Flex>
        </DetailsInfoItem>
      ) }
      <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 3, lg: 8 }}/>
      <DetailsInfoItem
        title="Value"
        hint="Value sent in the native token (and USD) if applicable."
      >
        <CurrencyValue value={ String(data.value) } currency={ selectedNetwork?.currency } exchangeRate={ data.exchange_rate }/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Transaction fee"
        hint="Total transaction fee."
      >
        <CurrencyValue value={ String(data.fee.value) } currency={ selectedNetwork?.currency } exchangeRate={ data.exchange_rate }/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Gas price"
        hint="Price per unit of gas specified by the sender. Higher gas prices can prioritize transaction inclusion during times of high usage."
      >
        <Text mr={ 1 }>{ BigNumber(data.gas_price).dividedBy(WEI).toFixed() } { selectedNetwork?.currency }</Text>
        <Text variant="secondary">({ BigNumber(data.gas_price).dividedBy(WEI_IN_GWEI).toFixed() } Gwei)</Text>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Gas limit & usage by txn"
        hint="Actual gas amount used by the transaction."
      >
        <Text>{ BigNumber(data.gas_used || 0).toFormat() }</Text>
        <TextSeparator/>
        <Text >{ BigNumber(data.gas_limit).toFormat() }</Text>
        <Utilization ml={ 4 } value={ BigNumber(data.gas_used || 0).dividedBy(BigNumber(data.gas_limit)).toNumber() }/>
      </DetailsInfoItem>
      { (data.base_fee_per_gas || data.max_fee_per_gas || data.max_priority_fee_per_gas) && (
        <DetailsInfoItem
          title="Gas fees (Gwei)"
          // eslint-disable-next-line max-len
          hint="Base Fee refers to the network Base Fee at the time of the block, while Max Fee & Max Priority Fee refer to the max amount a user is willing to pay for their tx & to give to the miner respectively."
        >
          { data.base_fee_per_gas && (
            <Box>
              <Text as="span" fontWeight="500">Base: </Text>
              <Text fontWeight="600" as="span">{ BigNumber(data.base_fee_per_gas).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
            </Box>
          ) }
          { data.max_fee_per_gas && (
            <Box>
              <TextSeparator/>
              <Text as="span" fontWeight="500">Max: </Text>
              <Text fontWeight="600" as="span">{ BigNumber(data.max_fee_per_gas).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
            </Box>
          ) }
          { data.max_priority_fee_per_gas && (
            <Box>
              <TextSeparator/>
              <Text as="span" fontWeight="500">Max priority: </Text>
              <Text fontWeight="600" as="span">{ BigNumber(data.max_priority_fee_per_gas).dividedBy(WEI_IN_GWEI).toFixed() }</Text>
            </Box>
          ) }
        </DetailsInfoItem>
      ) }
      { data.tx_burnt_fee && (
        <DetailsInfoItem
          title="Burnt fees"
          hint={ `Amount of ${ selectedNetwork?.currency } burned for this transaction. Equals Block Base Fee per Gas * Gas Used.` }
        >
          <Icon as={ flameIcon } mr={ 1 } boxSize={ 5 } color="gray.500"/>
          <CurrencyValue value={ String(data.tx_burnt_fee) } currency={ selectedNetwork?.currency } exchangeRate={ data.exchange_rate }/>
        </DetailsInfoItem>
      ) }
      <GridItem colSpan={{ base: undefined, lg: 2 }}>
        <Element name="TxDetails__cutLink">
          <Link
            mt={ 6 }
            display="inline-block"
            fontSize="sm"
            textDecorationLine="underline"
            textDecorationStyle="dashed"
            onClick={ handleCutClick }
          >
            { isExpanded ? 'Hide details' : 'View details' }
          </Link>
        </Element>
      </GridItem>
      { isExpanded && (
        <>
          <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>
          <DetailsInfoItem
            title="Other"
            hint="Other data related to this transaction."
          >
            {
              [
                typeof data.type === 'number' && (
                  <Box key="type">
                    <Text as="span" fontWeight="500">Txn type: </Text>
                    <Text fontWeight="600" as="span">{ data.type }</Text>
                    { data.type === 2 && <Text fontWeight="400" as="span" ml={ 1 } variant="secondary">(EIP-1559)</Text> }
                  </Box>
                ),
                <Box key="nonce">
                  <Text as="span" fontWeight="500">Nonce: </Text>
                  <Text fontWeight="600" as="span">{ data.nonce }</Text>
                </Box>,
                data.position !== null && (
                  <Box key="position">
                    <Text as="span" fontWeight="500">Position: </Text>
                    <Text fontWeight="600" as="span">{ data.position }</Text>
                  </Box>
                ),
              ]
                .filter(Boolean)
                .map((item, index) => (
                  <>
                    { index !== 0 && <TextSeparator/> }
                    { item }
                  </>
                ))
            }
          </DetailsInfoItem>
          <DetailsInfoItem
            title="Raw input"
            hint="Binary data included with the transaction. See logs tab for additional info."
          >
            <RawInputData hex={ data.raw_input }/>
          </DetailsInfoItem>
          { data.decoded_input && (
            <DetailsInfoItem
              title="Decoded input data"
              hint="Decoded input data"
            >
              <TxDecodedInputData data={ data.decoded_input }/>
            </DetailsInfoItem>
          ) }
        </>
      ) }
    </Grid>
  );
};

export default TxDetails;

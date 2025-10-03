import { Box, Flex, Text, Separator } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';

import config from 'configs/app';
import essentialDappsChains from 'configs/essentialDappsChains';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { useQueryParams } from 'lib/router/useQueryParams';
import useWeb3Wallet from 'lib/web3/useWallet';
import { Badge } from 'toolkit/chakra/badge';
import { Button } from 'toolkit/chakra/button';
import { Heading } from 'toolkit/chakra/heading';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import EmptySearchResult from 'ui/shared/EmptySearchResult';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import IconSvg from 'ui/shared/IconSvg';

import Approvals from './components/Approvals';
import ChainSelect from './components/ChainSelect';
import SearchInput from './components/SearchInput';
import StartScreen from './components/StartScreen';
import useApprovalsQuery from './hooks/useApprovalsQuery';
import useCoinBalanceQuery from './hooks/useCoinBalanceQuery';

const feature = config.features.marketplace;
const dappConfig = feature.isEnabled ? feature.essentialDapps?.revoke : undefined;

const defaultChainId = (
  dappConfig?.chains.includes(config.chain.id as string) ?
    config.chain.id :
    dappConfig?.chains[0]
) as string;

const Revoke = () => {
  const router = useRouter();
  const { updateQuery } = useQueryParams();
  const chainIdFromQuery = getQueryParamString(router.query.chainId);
  const addressFromQuery = getQueryParamString(router.query.address);
  const [ selectedChainId, setSelectedChainId ] = useState<number>(Number(chainIdFromQuery || defaultChainId));
  const { address: connectedAddress } = useAccount();
  const [ searchAddress, setSearchAddress ] = useState(addressFromQuery || '');
  const [ searchInputValue, setSearchInputValue ] = useState(searchAddress || '');
  const approvalsQuery = useApprovalsQuery(selectedChainId, searchAddress);
  const coinBalanceQuery = useCoinBalanceQuery(selectedChainId, searchAddress);
  const web3Wallet = useWeb3Wallet({ source: 'Revoke' });
  const isMobile = useIsMobile();

  const isValidAddress = useMemo(
    () => isAddress(searchAddress.toLowerCase()),
    [ searchAddress ],
  );

  const isAddressMatch = useMemo(
    () => searchAddress.toLowerCase() === connectedAddress?.toLowerCase(),
    [ searchAddress, connectedAddress ],
  );

  const totalValueAtRiskUsd = useMemo(() => {
    if (approvalsQuery.isPlaceholderData || !approvalsQuery.data) return 0;

    const maxValues: Record<`0x${ string }`, number> = {};

    approvalsQuery.data.forEach((item) => {
      const { address, valueAtRiskUsd } = item;

      if (!valueAtRiskUsd) return;

      if (
        maxValues[address] === undefined ||
        valueAtRiskUsd > maxValues[address]
      ) {
        maxValues[address] = valueAtRiskUsd;
      }
    });

    const sum = Object.values(maxValues).reduce((sum, val) => sum + val, 0);

    return Number(sum.toFixed(2)).toLocaleString();
  }, [ approvalsQuery ]);

  const handleChainChange = useCallback((chainId: number) => {
    setSelectedChainId(chainId);
    updateQuery({ chainId: chainId.toString() }, true);
  }, [ updateQuery ]);

  const handleSearch = useCallback((address: string) => {
    // if (address.endsWith('.eth')) {
    //   const ensAddress = await getEnsAddress(wagmiAdapter.wagmiConfig, {
    //     chainId: mainnet.id,
    //     name: normalize(address),
    //   });
    //   if (ensAddress) {
    //     setSearchAddress(ensAddress.toLowerCase());
    //     return;
    //   }
    // }
    setSearchAddress(address);
    setSearchInputValue(address);
    if (isAddress(address.toLowerCase())) {
      updateQuery({ address }, true);
    }
  }, [ updateQuery ]);

  const handleAddressClick = useCallback(
    (address: string) => () => {
      handleSearch(address);
    },
    [ handleSearch ],
  );

  useEffect(() => {
    if (connectedAddress && !searchAddress) {
      handleSearch(connectedAddress);
    }
  }, [ connectedAddress, handleSearch, searchAddress ]);

  let content = <StartScreen/>;

  if (searchAddress && selectedChainId) {
    content = isValidAddress ? (
      <Flex flexDir="column" w="full">
        <Flex
          flexDir={{ base: 'column', lg: 'row' }}
          gap={ 2 }
          mt={ -2 }
          pt={ 2 }
          pb={ 6 }
          position={ !isMobile && approvalsQuery.data?.length ? 'sticky' : 'unset' }
          top={ 0 }
          zIndex="1"
          bg={{ _light: 'white', _dark: 'black' }}
        >
          <Flex
            flexDir="column"
            alignItems="flex-start"
            flex={ 1 }
            bg={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
            gap={ 3 }
            p={ 6 }
            borderRadius="base"
          >
            <Flex
              flexDir={{ base: 'column', md: 'row' }}
              gap={ 3 }
              alignItems={{ base: 'flex-start', md: 'center' }}
              justifyContent={{ base: 'flex-start', md: 'space-between' }}
              w="full"
              flexWrap="wrap"
            >
              <Flex gap={ 2 } alignItems="center">
                <AddressEntity
                  address={{ hash: searchAddress }}
                  truncation="constant"
                  textStyle={{ base: 'heading.sm', lg: 'heading.md' }}
                  fontWeight="500"
                  variant={ isMobile ? undefined : 'heading' }
                  noLink
                />
                <Badge colorPalette={ isAddressMatch ? 'green' : 'gray' }>
                  { isAddressMatch ? 'Connected' : 'Not connected' }
                </Badge>
              </Flex>
            </Flex>
            <Flex gap={ 3 } alignItems="center" flexWrap="wrap">
              <Skeleton
                loading={ coinBalanceQuery.isPlaceholderData }
                as={ Flex }
                gap={ 3 }
              >
                { (coinBalanceQuery.isPlaceholderData ||
                  coinBalanceQuery.data) && (
                  <>
                    <Flex gap={ 2 } alignItems="center" ml={{ base: 0, lg: '5px' }}>
                      <Image
                        src={ coinBalanceQuery.data?.coinImage }
                        alt={ coinBalanceQuery.data?.symbol }
                        boxSize={ 5 }
                        fallback={ (
                          <IconSvg
                            name="token-placeholder"
                            bgColor={{ _light: 'gray.200', _dark: 'gray.600' }}
                            color={{ _light: 'gray.400', _dark: 'gray.200' }}
                            borderRadius="full"
                          />
                        ) }
                      />
                      <Text textStyle="sm" fontWeight="500">
                        { coinBalanceQuery.data?.balance }{ ' ' }
                        { coinBalanceQuery.data?.symbol }
                      </Text>
                    </Flex>
                    <Text textStyle="sm" fontWeight="500" color="text.secondary">
                      ${ coinBalanceQuery.data?.balanceUsd }
                    </Text>
                  </>
                ) }
              </Skeleton>
              <Link
                href={ `${ essentialDappsChains[selectedChainId] }/address/${ searchAddress }` }
                external
                textStyle="sm"
                fontWeight="500"
                noIcon
              >
                View details
              </Link>
            </Flex>
          </Flex>
          <Flex
            w={{ base: 'full', lg: '400px' }}
            bg={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
            p={ 6 }
            borderRadius="base"
          >
            <Flex
              flexDir="column"
              flex={ 1 }
              justifyContent="center"
              alignItems="center"
              gap={ 2 }
            >
              <Text textStyle="sm" fontWeight="500" color="text.secondary">
                Total approvals
              </Text>
              <Skeleton
                loading={ approvalsQuery.isPlaceholderData }
                minW="40px"
                textAlign="center"
              >
                <Heading level="3">
                  { approvalsQuery.data?.length || 0 }
                </Heading>
              </Skeleton>
            </Flex>
            <Separator
              orientation="vertical"
              borderColor="border.divider"
              mx={{ base: 4, md: 8 }}
            />
            <Flex
              flexDir="column"
              flex={ 1 }
              justifyContent="center"
              alignItems="center"
              gap={ 2 }
            >
              <Text textStyle="sm" fontWeight="500" color="text.secondary">
                Total value at risk
              </Text>
              <Skeleton
                loading={ approvalsQuery.isPlaceholderData }
                minW="40px"
                textAlign="center"
              >
                <Heading level="3">
                  ${ totalValueAtRiskUsd }
                </Heading>
              </Skeleton>
            </Flex>
          </Flex>
        </Flex>
        <Approvals
          selectedChainId={ selectedChainId }
          approvals={ approvalsQuery.data || [] }
          isLoading={ approvalsQuery.isPlaceholderData }
          isAddressMatch={ isAddressMatch }
        />
      </Flex>
    ) : (
      <EmptySearchResult text="Enter a correct 0x address to search"/>
    );
  }

  return (
    <Flex flexDir="column" w="full" gap={{ base: 6, lg: 12 }}>
      <Flex flexDir="column" w="full" gap={ 3 }>
        <SearchInput
          value={ searchInputValue }
          onChange={ setSearchInputValue }
          onSubmit={ handleSearch }
        />
        <Flex flexDir={{ base: 'column', md: 'row' }} gap={ 3 } justifyContent="space-between">
          <Flex
            gap={ 3 }
            alignItems="center"
            h="32px"
            overflowX="auto"
            css={{
              '-ms-overflow-style': 'none',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <Text textStyle="sm" fontWeight="500" color="text.secondary">
              Examples
            </Text>
            { [
              '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
              '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
              '0xf6B6F07862A02C85628B3A9688beae07fEA9C863',
            ].slice(0, isMobile ? 2 : undefined).map((address) => (
              <Box key={ address } onClick={ handleAddressClick(address) } cursor="pointer">
                <AddressEntity
                  address={{ hash: address }}
                  truncation="constant"
                  noTooltip
                  noLink
                  noCopy
                  textStyle="sm"
                  fontWeight="600"
                />
              </Box>
            )) }
          </Flex>
          <Flex gap={ 2 } w={{ base: 'full', md: 'auto' }}>
            <Button
              size="sm"
              variant={ connectedAddress ? 'header' : 'outline' }
              selected={ Boolean(connectedAddress) }
              onClick={ connectedAddress ? handleAddressClick(connectedAddress) : web3Wallet.connect }
              loading={ !connectedAddress && web3Wallet.isOpen }
              loadingText="Connect wallet"
            >
              { connectedAddress ? (
                <AddressEntity
                  address={{ hash: connectedAddress }}
                  truncation="constant"
                  noTooltip
                  noLink
                  noCopy
                />
              ) : 'Connect wallet' }
            </Button>
            <ChainSelect
              selectedChainId={ selectedChainId }
              changeChain={ handleChainChange }
            />
          </Flex>
        </Flex>
      </Flex>
      { content }
    </Flex>
  );
};

export default Revoke;

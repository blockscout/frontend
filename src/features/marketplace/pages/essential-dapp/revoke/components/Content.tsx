// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Text, Separator } from '@chakra-ui/react';
import React, { useCallback, useMemo } from 'react';

import type { EssentialDappsChainConfig } from 'src/features/marketplace/types/client';
import type { PaginationParams } from 'src/shared/pagination/types';

import TokenLogoPlaceholder from 'src/slices/token/components/icon/TokenIconPlaceholder';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import { route } from 'src/shared/router/routes';

import { Badge } from 'src/toolkit/chakra/badge';
import { Heading } from 'src/toolkit/chakra/heading';
import { Image } from 'src/toolkit/chakra/image';
import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

import { APPROVALS_PAGE_SIZE } from '../constants';
import type useApprovalsQuery from '../hooks/useApprovalsQuery';
import type useCoinBalanceQuery from '../hooks/useCoinBalanceQuery';
import formatUsdValue from '../lib/formatUsdValue';
import AddressEntity from './AddressEntity';
import Approvals from './Approvals';

type Props = {
  searchAddress: string;
  selectedChain: EssentialDappsChainConfig | undefined;
  isAddressMatch: boolean;
  coinBalanceQuery: ReturnType<typeof useCoinBalanceQuery>;
  approvalsQuery: ReturnType<typeof useApprovalsQuery>;
  approvalsPage: number;
  setApprovalsPage: React.Dispatch<React.SetStateAction<number>>;
};

const Content = ({
  searchAddress,
  selectedChain,
  isAddressMatch,
  coinBalanceQuery,
  approvalsQuery,
  approvalsPage,
  setApprovalsPage,
}: Props) => {
  const isMobile = useIsMobile();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const actionBarRef = React.useRef<HTMLDivElement>(null);
  const approvals = approvalsQuery.data.items;

  const totalValueAtRiskUsd = useMemo(() => {
    if (approvalsQuery.isPlaceholderData) return '$0';

    return formatUsdValue(approvalsQuery.data.totalValueAtRiskUsd) || '$0';
  }, [ approvalsQuery.data.totalValueAtRiskUsd, approvalsQuery.isPlaceholderData ]);

  const scrollToResultsTop = useCallback(() => {
    const target = isMobile ? actionBarRef.current : scrollRef.current;

    if (!target || target.getBoundingClientRect().top >= 0) {
      return;
    }

    target.scrollIntoView(true);
  }, [ isMobile ]);

  const pagination = useMemo<PaginationParams>(() => ({
    page: approvalsPage,
    onNextPageClick: () => {
      setApprovalsPage((page) => page + 1);
      scrollToResultsTop();
    },
    onPrevPageClick: () => {
      setApprovalsPage((page) => Math.max(page - 1, 1));
      scrollToResultsTop();
    },
    resetPage: () => {
      setApprovalsPage(1);
      scrollToResultsTop();
    },
    hasPages: approvalsQuery.data.total > APPROVALS_PAGE_SIZE,
    hasNextPage: approvalsPage * APPROVALS_PAGE_SIZE < approvalsQuery.data.total,
    canGoBackwards: approvalsPage > 1,
    isLoading: approvalsQuery.isPlaceholderData,
    isVisible: approvalsQuery.data.total > 0 && !approvalsQuery.isError,
  }), [ approvalsPage, approvalsQuery.data.total, approvalsQuery.isError, approvalsQuery.isPlaceholderData, scrollToResultsTop, setApprovalsPage ]);

  return (
    <Flex ref={ scrollRef } flexDir="column" w="full">
      <Flex
        flexDir={{ base: 'column', lg: 'row' }}
        gap={ 2 }
        mt={ -2 }
        pt={ 2 }
        position={ !isMobile && approvals?.length ? 'sticky' : 'unset' }
        top={ 0 }
        zIndex="3"
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
                icon={{ size: isMobile ? undefined : 30 }}
                noLink
              />
              <Tooltip content="Connect a wallet to revoke approvals" disabled={ isAddressMatch } disableOnMobile>
                <Badge colorPalette={ isAddressMatch ? 'green' : 'gray' }>
                  { isAddressMatch ? 'Connected' : 'Not connected' }
                </Badge>
              </Tooltip>
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
                      src={ coinBalanceQuery.data.coinImage }
                      alt={ coinBalanceQuery.data.symbol }
                      boxSize={ 5 }
                      fallback={ <TokenLogoPlaceholder/> }
                    />
                    <Text textStyle="sm" fontWeight="500">
                      { coinBalanceQuery.data.balance }{ ' ' }
                      { coinBalanceQuery.data.symbol }
                    </Text>
                  </Flex>
                  <Text textStyle="sm" fontWeight="500" color="text.secondary">
                    ${ coinBalanceQuery.data.balanceUsd }
                  </Text>
                </>
              ) }
            </Skeleton>
            <Link
              href={ route({ pathname: '/address/[hash]', query: { hash: searchAddress } }, { chain: selectedChain, external: true }) }
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
                { approvalsQuery.data.total }
              </Heading>
            </Skeleton>
          </Flex>
          <Separator
            orientation="vertical"
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
                { totalValueAtRiskUsd }
              </Heading>
            </Skeleton>
          </Flex>
        </Flex>
      </Flex>
      <Approvals
        selectedChain={ selectedChain }
        approvals={ approvals || [] }
        isLoading={ approvalsQuery.isPlaceholderData }
        isError={ approvalsQuery.isError }
        isAddressMatch={ isAddressMatch }
        hideApproval={ approvalsQuery.hideApproval }
        pagination={ pagination }
        actionBarRef={ actionBarRef }
      />
    </Flex>
  );
};

export default Content;

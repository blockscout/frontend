/* eslint-disable */
import {
  Box,
  Flex,
  Select,
  Tooltip,
  Text,
  Grid,
  Button,
  Input,
  TableContainer,
  Tr,
  Td,
  Th,
  Table,
  Thead,
  Tbody,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { FaRegQuestionCircle, FaRegEye, FaRegCopy } from "react-icons/fa";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { IoDocumentTextOutline, IoFilter } from "react-icons/io5";
import { TbFileTypeCsv } from "react-icons/tb";

import type { SocketMessage } from "lib/socket/types";
import type { TokenInfo } from "types/api/token";
import type { PaginationParams } from "ui/shared/pagination/types";
import type { RoutedTab } from "ui/shared/Tabs/types";

import config from "configs/app";
import useApiQuery, { getResourceKey } from "lib/api/useApiQuery";
import { useAppContext } from "lib/contexts/app";
import useContractTabs from "lib/hooks/useContractTabs";
import useIsMobile from "lib/hooks/useIsMobile";
import * as metadata from "lib/metadata";
import getQueryParamString from "lib/router/getQueryParamString";
import useSocketChannel from "lib/socket/useSocketChannel";
import useSocketMessage from "lib/socket/useSocketMessage";
import { NFT_TOKEN_TYPE_IDS } from "lib/token/tokenTypes";
import * as addressStubs from "stubs/address";
import * as tokenStubs from "stubs/token";
import { getTokenHoldersStub } from "stubs/token";
import { generateListStub } from "stubs/utils";
import AddressContract from "ui/address/AddressContract";
import AddressQrCode from "ui/address/details/AddressQrCode";
import AccountActionsMenu from "ui/shared/AccountActionsMenu/AccountActionsMenu";
import AddressAddToWallet from "ui/shared/address/AddressAddToWallet";
import AddressEntity from "ui/shared/entities/address/AddressEntity";
import EntityTags from "ui/shared/EntityTags";
import IconSvg from "ui/shared/IconSvg";
import NetworkExplorers from "ui/shared/NetworkExplorers";
import useQueryWithPages from "ui/shared/pagination/useQueryWithPages";
import TokenHolders from "ui/token/TokenHolders/TokenHolders";
import TokenInventory from "ui/token/TokenInventory";
import TokenTransfer from "ui/token/TokenTransfer/TokenTransfer";
import TokenVerifiedInfo from "ui/token/TokenVerifiedInfo";

import BWButton from "../shared/BWbutton";
import TokenDetails from "ui/token/TokenDetails";
import TabsSkeleton from "ui/shared/Tabs/TabsSkeleton";
import RoutedTabs from "ui/shared/Tabs/RoutedTabs";
import Pagination from "ui/shared/pagination/Pagination";

export type TokenTabs = "token_transfers" | "holders" | "inventory";

interface TableAreaButtonProps {
  children: React.ReactNode;
  display?: any;
}

const TokenPageContent = () => {
  const [isQueryEnabled, setIsQueryEnabled] = React.useState(false);
  const [totalSupplySocket, setTotalSupplySocket] = React.useState<number>();
  const router = useRouter();
  const isMobile = useIsMobile();

  const appProps = useAppContext();

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const hashString = getQueryParamString(router.query.hash);
  const tab = getQueryParamString(router.query.tab);
  const ownerFilter = getQueryParamString(router.query.holder_address_hash) || undefined;

  const queryClient = useQueryClient();

  const tokenQuery = useApiQuery("token", {
    pathParams: { hash: hashString },
    queryOptions: {
      enabled: Boolean(router.query.hash),
      placeholderData: tokenStubs.TOKEN_INFO_ERC_20,
    },
  });

  const contractQuery = useApiQuery("address", {
    pathParams: { hash: hashString },
    queryOptions: {
      enabled: isQueryEnabled && Boolean(router.query.hash),
      placeholderData: addressStubs.ADDRESS_INFO,
    },
  });

  React.useEffect(() => {
    if (tokenQuery.data && totalSupplySocket) {
      queryClient.setQueryData(
        getResourceKey('token', { pathParams: { hash: hashString } }),
        (prevData: TokenInfo | undefined) => {
          if (prevData) {
            return { ...prevData, total_supply: totalSupplySocket.toString() };
          }
        },
      );
    }
  }, [tokenQuery.data, totalSupplySocket, hashString, queryClient]);

  const handleTotalSupplyMessage: SocketMessage.TokenTotalSupply['handler'] = React.useCallback(
      (payload) => {
        const prevData = queryClient.getQueryData(
          getResourceKey('token', { pathParams: { hash: hashString } }),
        );
        if (!prevData) {
          setTotalSupplySocket(payload.total_supply);
        }
        queryClient.setQueryData(
          getResourceKey('token', { pathParams: { hash: hashString } }),
          (prevData: TokenInfo | undefined) => {
            if (prevData) {
              return {
                ...prevData,
                total_supply: payload.total_supply.toString(),
              };
            }
          },
        );
      },
      [ queryClient, hashString ],
    );

  const enableQuery = React.useCallback(() => setIsQueryEnabled(true), []);

  const channel = useSocketChannel({
    topic: `tokens:${hashString?.toLowerCase()}`,
    isDisabled: !hashString,
    onJoin: enableQuery,
    onSocketError: enableQuery,
  });
  useSocketMessage({
    channel,
    event: "total_supply",
    handler: handleTotalSupplyMessage,
  });

  useEffect(() => {
    if (tokenQuery.data && !tokenQuery.isPlaceholderData) {
      metadata.update(
        { pathname: '/token/[hash]', query: { hash: tokenQuery.data.address } },
        { symbol: tokenQuery.data.symbol ?? '' },
      );
    }
  }, [tokenQuery.data, tokenQuery.isPlaceholderData]);

  const hasData = tokenQuery.data && !tokenQuery.isPlaceholderData && contractQuery.data && !contractQuery.isPlaceholderData;
  const hasInventoryTab = tokenQuery.data?.type && NFT_TOKEN_TYPE_IDS.includes(tokenQuery.data.type);

  const transfersQuery = useQueryWithPages({
    resourceName: "token_transfers",
    pathParams: { hash: hashString },
    scrollRef,
    options: {
      enabled: Boolean(
        hasData &&
          hashString &&
          ((!hasInventoryTab && !tab) || tab === 'token_transfers'),
      ),
      placeholderData: tokenStubs.getTokenTransfersStub(tokenQuery.data?.type),
    },
  });

  const inventoryQuery = useQueryWithPages({
    resourceName: "token_inventory",
    pathParams: { hash: hashString },
    filters: ownerFilter ? { holder_address_hash: ownerFilter } : {},
    scrollRef,
    options: {
      enabled: Boolean(
        hasData &&
          hashString &&
          ((hasInventoryTab && !tab) || tab === 'inventory'),
      ),
      placeholderData: generateListStub<'token_inventory'>(
        tokenStubs.TOKEN_INSTANCE,
        50,
        { next_page_params: { unique_token: 1 } },
      ),
    },
  });

  const holdersQuery = useQueryWithPages({
    resourceName: "token_holders",
    pathParams: { hash: hashString },
    scrollRef,
    options: {
      enabled: Boolean(hashString && tab === "holders" && hasData),
      placeholderData: getTokenHoldersStub(tokenQuery.data?.type, null),
    },
  });

  const verifiedInfoQuery = useApiQuery("token_verified_info", {
    pathParams: { hash: hashString, chainId: config.chain.id },
    queryOptions: {
      enabled:
        Boolean(tokenQuery.data) && config.features.verifiedTokens.isEnabled,
    },
  });

  const contractTabs = useContractTabs(contractQuery.data);

  // eslint-disable-next-line no-unused-vars
  const tabs: Array<RoutedTab> = [
    hasInventoryTab ?
      {
        id: 'inventory',
        title: 'Inventory',
        component: (
          <TokenInventory
            inventoryQuery={ inventoryQuery }
            tokenQuery={ tokenQuery }
            ownerFilter={ ownerFilter }
          />
        ),
      } :
      undefined,
    {
      id: 'token_transfers',
      title: 'Token transfers',
      component: (
        <TokenTransfer
          transfersQuery={ transfersQuery }
          token={ tokenQuery.data }
        />
      ),
    },
    contractQuery.data?.is_contract ?
      {
        id: 'contract',
        title: () => {
          if (contractQuery.data?.is_verified) {
            return (
              <>
                <span>Contract</span>
                <IconSvg
                  name="status/success"
                  boxSize="14px"
                  color="green.500"
                  ml={ 1 }
                />
              </>
            );
          }

          return 'Contract';
        },
        component: <AddressContract tabs={ contractTabs }/>,
        subTabs: contractTabs.map((tab) => tab.id),
      } :
      undefined,
    {
      id: 'holders',
      title: 'Holders',
      component: (
        <TokenHolders token={ tokenQuery.data } holdersQuery={ holdersQuery }/>
      ),
    },
  ].filter(Boolean);

  let pagination: PaginationParams | undefined;

  // default tab for erc-20 is token transfers
  if (
    (tokenQuery.data?.type === 'ERC-20' && !tab) ||
    tab === 'token_transfers'
  ) {
    pagination = transfersQuery.pagination;
  }

  if (router.query.tab === "holders") {
    pagination = holdersQuery.pagination;
  }

  // default tab for nfts is token inventory
  if ((hasInventoryTab && !tab) || tab === "inventory") {
    // eslint-disable-next-line no-unused-vars
    pagination = inventoryQuery.pagination;
  }

  // eslint-disable-next-line no-unused-vars
  const tokenSymbolText = tokenQuery.data?.symbol
    ? ` (${tokenQuery.data.symbol})`
    : "";

  // eslint-disable-next-line no-unused-vars
  const tabListProps = React.useCallback(
    ({
      isSticky,
      activeTabIndex,
    }: {
      isSticky: boolean;
      activeTabIndex: number;
    }) => {
      if (isMobile) {
        return { mt: 8 };
      }

      return {
        mt: 3,
        py: 5,
        marginBottom: 0,
        boxShadow: activeTabIndex === 2 && isSticky ? "action_bar" : "none",
      };
    },
    [isMobile],
  );

  // eslint-disable-next-line no-unused-vars
  const backLink = React.useMemo(() => {
    const hasGoBackLink =
      appProps.referrer && appProps.referrer.includes("/tokens");

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: "Back to tokens list",
      url: appProps.referrer,
    };
  }, [appProps.referrer]);

  const titleContentAfter = (
    <>
      {verifiedInfoQuery.data?.tokenAddress && (
        <Tooltip
          label={`Information on this token has been verified by ${config.chain.name}`}
        >
          <Box boxSize={6}>
            <IconSvg
              name="verified_token"
              color="green.500"
              boxSize={6}
              cursor="pointer"
            />
          </Box>
        </Tooltip>
      )}
      <EntityTags
        data={contractQuery.data}
        isLoading={
          tokenQuery.isPlaceholderData || contractQuery.isPlaceholderData
        }
        tagsBefore={[
          tokenQuery.data
            ? {
                label: tokenQuery.data?.type,
                display_name: tokenQuery.data?.type,
              }
            : undefined,
          config.features.bridgedTokens.isEnabled && tokenQuery.data?.is_bridged
            ? {
                label: "bridged",
                display_name: "Bridged",
                colorScheme: "blue",
                variant: "solid",
              }
            : undefined,
        ]}
        tagsAfter={
          verifiedInfoQuery.data?.projectSector
            ? [
                {
                  label: verifiedInfoQuery.data.projectSector,
                  display_name: verifiedInfoQuery.data.projectSector,
                },
              ]
            : undefined
        }
        flexGrow={1}
      />
    </>
  );

  const isLoading = tokenQuery.isPlaceholderData || contractQuery.isPlaceholderData;

  // eslint-disable-next-line no-unused-vars
  const titleSecondRow = (
    // <Flex
    //   alignItems="center"
    //   w="100%"
    //   minW={0}
    //   columnGap={2}
    //   rowGap={2}
    //   flexWrap={{ base: "wrap", lg: "nowrap" }}
    // >
    //   <AddressEntity
    //     address={{ ...contractQuery.data, name: "" }}
    //     isLoading={isLoading}
    //     fontFamily="heading"
    //     fontSize="lg"
    //     fontWeight={500}
    //   />
    //   {!isLoading && tokenQuery.data && (
    //     <AddressAddToWallet token={tokenQuery.data} variant="button" />
    //   )}
    //   <AddressQrCode address={contractQuery.data} isLoading={isLoading} />
    //   <AccountActionsMenu isLoading={isLoading} />
    //   <Flex
    //     ml={{ base: 0, lg: "auto" }}
    //     columnGap={2}
    //     flexGrow={{ base: 1, lg: 0 }}
    //   >
    //     <TokenVerifiedInfo verifiedInfoQuery={verifiedInfoQuery} />
    //     <NetworkExplorers
    //       type="token"
    //       pathParam={hashString}
    //       ml={{ base: "auto", lg: 0 }}
    //     />
    //   </Flex>
    // </Flex>
    <AddressEntity
      address={{ ...contractQuery.data, name: '' }}
      fontSize="lg"
    />
  );

  const OverviewBox = () => {
    return (
      <Flex
        borderRadius="1.5em"
        border="1px"
        padding="1.5em"
        flexDirection="column"
        gap={6}
        maxW="400px"
        borderColor="#7272728A"
        background="linear-gradient(300.97deg, #F4F4F4 -153.4%, rgba(142, 142, 142, 0) 23.1%)"
      >
        <Text fontWeight="800">OVERVIEW</Text>
        <Box>
          <Text color="#1E1E1E66" fontWeight="500" mb={1}>
            Max Supply
          </Text>
          <Text fontWeight="700">1,152,997,574 FET</Text>
        </Box>
        <Box>
          <Text color="#1E1E1E66" fontWeight="500" mb={1}>
            Holders
          </Text>
          <Text fontWeight="700">74,292</Text>
        </Box>
        <Box>
          <Text color="#1E1E1E66" fontWeight="500" mb={1}>
            Total Transfer
          </Text>
          <Text fontWeight="700">683,427</Text>
        </Box>
      </Flex>
    );
  };

  const TableAreaButton: React.FC<TableAreaButtonProps> = ({
    children,
    ...props
  }) => {
    return (
      <Button
        bg="transparent"
        border="1px"
        borderColor="#7272728A"
        color="black"
        fontWeight="400"
        fontSize={{
          base: 12,
          md: 14,
        }}
        padding={{
          base: "5px",
          md: "1em",
        }}
        {...props}
      >
        {children}
      </Button>
    );
  };

  // @ts-ignore
  // @ts-ignore
  return (
    <>
      <Flex
        justifyContent="space-between"
        padding={{ base: "1em", md: "2.5em" }}
        flexDirection={{ base: "column", md: "row" }}
        gap={{ base: "20px", md: "0" }} // Adding gap only in mobile view
      >
        <Flex gap="10px">
          {tokenQuery?.data?.icon_url && (
            <img
              src={tokenQuery.data.icon_url}
              height="80"
              width="80"
              alt="crypto logo"
            />
          )}
          <Box>
            <Text fontSize="22px" color="#29292969">
              Token
            </Text>
            <Text fontSize="24px" fontWeight="800">
              {tokenQuery.data?.name}
            </Text>
          </Box>
        </Flex>
        <Flex>
          <Select placeholder="BUY" backgroundColor="white" borderRadius="2em">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
          <Select
            placeholder="Exchange"
            backgroundColor="white"
            borderRadius="2em"
          >
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
          <Select placeholder="Play" backgroundColor="white" borderRadius="2em">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
        </Flex>
      </Flex>
      <Box
        bg="white"
        borderTopRadius="2.5em"
        padding={{
          base: "1.5em",
          md: "3em",
        }}
        paddingY="3em"
        // w="100vw"
        // maxW="100vw"
      >
        <TokenDetails tokenQuery={ tokenQuery } address={ titleSecondRow }/>

        {/* <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }} // Responsive grid columns
          gap={6}
          maxW="1400px"
          mx="auto" // Center the grid horizontally on all screen sizes
        >
          <OverviewBox />
          <OverviewBox />
          <OverviewBox />
        </Grid> */}
        {/* <Box overflowX="auto">
          <Flex py="2em" gap={3} minWidth="1000px">
            <BWButton active={true}>TRANSACTIONS (50)</BWButton>
            <BWButton>TOKEN TRANSFER</BWButton>
            <BWButton>TOKENS</BWButton>
            <BWButton>INTERNAL TNXS</BWButton>
            <BWButton>COIN BALANCE HISTORY</BWButton>
            <BWButton>LOGS</BWButton>
            <BWButton>CONTRACT</BWButton>
          </Flex>
        </Box> */}
        {isLoading ? (
          <TabsSkeleton tabs={tabs} />
        ) : (
          <RoutedTabs
            tabs={tabs}
            type="parent_tabs"
            tabListProps={tabListProps}
            rightSlot={
              !isMobile && pagination?.isVisible ? (
                <Pagination {...pagination} />
              ) : null
            }
            stickyEnabled={!isMobile}
          />
        )}
      </Box>
    </>
  );
};

export default TokenPageContent;

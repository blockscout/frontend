import type { GridProps } from "@chakra-ui/react";
import { Box, Grid, Flex, Text, Link, VStack, Skeleton } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";

import type { CustomLinksGroup } from "types/footerLinks";

import config from "configs/app";
import type { ResourceError } from "lib/api/resources";
import useApiQuery from "lib/api/useApiQuery";
import useFetch from "lib/hooks/useFetch";
import useIssueUrl from "lib/hooks/useIssueUrl";
import NetworkAddToWallet from "ui/shared/NetworkAddToWallet";

import FooterLinkItem from "./FooterLinkItem";
import IntTxsIndexingStatus from "./IntTxsIndexingStatus";
import getApiVersionUrl from "./utils/getApiVersionUrl";
import NetworkLogo from "../networkMenu/NetworkLogo";
import Button from "theme/components/Button/Button";
import IconSvg from "ui/shared/IconSvg";
import { WALLETS_INFO } from "lib/web3/wallets";
import useToast from "lib/hooks/useToast";
import useProvider from "lib/web3/useProvider";
import useAddOrSwitchChain from "lib/web3/useAddOrSwitchChain";
import * as mixpanel from "lib/mixpanel/index";
const MAX_LINKS_COLUMNS = 4;

const FRONT_VERSION_URL = `https://github.com/blockscout/frontend/tree/${config.UI.footer.frontendVersion}`;
const FRONT_COMMIT_URL = `https://github.com/blockscout/frontend/commit/${config.UI.footer.frontendCommit}`;

const Footer = () => {
  const { data: backendVersionData } = useApiQuery("config_backend_version", {
    queryOptions: {
      staleTime: Infinity,
    },
  });
  const apiVersionUrl = getApiVersionUrl(backendVersionData?.backend_version);
  const issueUrl = useIssueUrl(backendVersionData?.backend_version);
  const BLOCKSCOUT_LINKS = [
    {
      icon: "social/twitter_filled" as const,
      iconSize: "16px",
      text: "X (ex-Twitter)",
      url: "https://twitter.com/espentoofficial",
    },
    {
      icon: "social/telegram_filled" as const,
      iconSize: "20px",
      text: "Telegram",
      url: "https://espento.com/#:~:text=Twitter-,Telegram,-Reddit",
    },
    {
      icon: "social/reddit_filled" as const,
      iconSize: "18px",
      text: "Reddit",
      url: "https://www.reddit.com/r/espentoofficial/",
    },
    {
      icon: "social/medium_filled" as const,
      iconSize: "18px",
      text: "Medium",
      url: "https://medium.com/@espentoofficial",
    },
    {
      icon: "social/discord_filled" as const,
      iconSize: "24px",
      text: "Discord",
      url: "https://discord.com/invite/7BUJ9UTBgE",
    },
    {
      icon: "social/facebook_filled" as const,
      iconSize: "20px",
      text: "Facebook",
      url: "https://www.facebook.com/espentoofficial",
    },
    {
      icon: "social/instagram_filled" as const,
      iconSize: "20px",
      text: "Instagram",
      url: "https://www.instagram.com/espentoofficial",
    },
    {
      icon: "social/youtube_filled" as const,
      iconSize: "20px",
      text: "Youtube",
      url: "https://www.youtube.com/@espentoofficial",
    },
    {
      icon: "social/github_filled" as const,
      iconSize: "20px",
      text: "Github",
      url: "https://github.com/espentoofficial",
    },
  ];

  const frontendLink = (() => {
    if (config.UI.footer.frontendVersion) {
      return (
        <Link href={FRONT_VERSION_URL} target="_blank">
          {config.UI.footer.frontendVersion}
        </Link>
      );
    }

    if (config.UI.footer.frontendCommit) {
      return (
        <Link href={FRONT_COMMIT_URL} target="_blank">
          {config.UI.footer.frontendCommit}
        </Link>
      );
    }

    return null;
  })();

  const fetch = useFetch();

  const { isPlaceholderData, data: linksData } = useQuery<
    unknown,
    ResourceError<unknown>,
    Array<CustomLinksGroup>
  >({
    queryKey: ["footer-links"],
    queryFn: async () => fetch(config.UI.footer.links || "", undefined, { resource: "footer-links" }),
    enabled: Boolean(config.UI.footer.links),
    staleTime: Infinity,
    placeholderData: [],
  });

  const colNum = isPlaceholderData ? 1 : Math.min(linksData?.length || Infinity, MAX_LINKS_COLUMNS) + 1;
  const toast = useToast();
  const { provider, wallet } = useProvider();
  const addOrSwitchChain = useAddOrSwitchChain();

  const handleClick = React.useCallback(async () => {
    if (!wallet || !provider) {
      return;
    }

    try {
      await addOrSwitchChain();

      toast({
        position: "top-right",
        title: "Success",
        description: "Successfully added network to your wallet",
        status: "success",
        variant: "subtle",
        isClosable: true,
      });

      mixpanel.logEvent(mixpanel.EventTypes.ADD_TO_WALLET, {
        Target: "network",
        Wallet: wallet,
      });
    } catch (error) {
      toast({
        position: "top-right",
        title: "Error",
        description: (error as Error)?.message || "Something went wrong",
        status: "error",
        variant: "subtle",
        isClosable: true,
      });
    }
  }, [addOrSwitchChain, provider, toast, wallet]);
  const renderNetworkInfo = React.useCallback((gridArea?: GridProps["gridArea"]) => {
    return (
      <Flex
        gridArea={gridArea}
        flexWrap="wrap"
        columnGap={8}
        rowGap={6}
        mb={{ base: 5, lg: 10 }}
        _empty={{ display: "none" }}
      >
        {!config.UI.indexingAlert.intTxs.isHidden && <IntTxsIndexingStatus />}
        <NetworkAddToWallet />
      </Flex>
    );
  }, []);

  const renderProjectInfo = React.useCallback(
    (gridArea?: GridProps["gridArea"]) => {
      return (
        <Box gridArea={gridArea}>
          <NetworkLogo />

          <div>
            <Text mt={3} fontSize="xs">
              Espento is a fast, secure and scalable L1 blockchain. Enjoy almost instant transactions with
              extremely low fees.
            </Text>
            <Text mt={2} fontSize="xs">
              © 2024 Espento Foundation. All rights reserved.
            </Text>
          </div>
          <VStack spacing={1} mt={6} alignItems="start">
            {apiVersionUrl && (
              <Text fontSize="xs">
                Backend:{" "}
                <Link href={apiVersionUrl} target="_blank">
                  {backendVersionData?.backend_version}
                </Link>
              </Text>
            )}
            {frontendLink && <Text fontSize="xs">Frontend: {frontendLink}</Text>}
          </VStack>
        </Box>
      );
    },
    [apiVersionUrl, backendVersionData?.backend_version, frontendLink]
  );

  const containerProps: GridProps = {
    as: "footer",
    px: { base: 4, lg: 12 },
    py: { base: 4, lg: 9 },
    borderTop: "1px solid",
    borderColor: "divider",
    gridTemplateColumns: { base: "1fr", lg: "minmax(auto, 470px) 1fr" },
    columnGap: { lg: "32px", xl: "100px" },
  };

  if (config.UI.footer.links) {
    return (
      <Grid {...containerProps}>
        <div>
          {renderNetworkInfo()}
          {renderProjectInfo()}
        </div>

        <Grid
          gap={{ base: 6, lg: colNum === MAX_LINKS_COLUMNS + 1 ? 2 : 8, xl: 12 }}
          gridTemplateColumns={{
            base: "repeat(auto-fill, 160px)",
            lg: `repeat(${colNum}, 135px)`,
            xl: `repeat(${colNum}, 160px)`,
          }}
          justifyContent={{ lg: "flex-end" }}
          mt={{ base: 8, lg: 0 }}
        >
          {[{ title: "Blockscout", links: BLOCKSCOUT_LINKS }, ...(linksData || [])]
            .slice(0, colNum)
            .map((linkGroup) => (
              <Box key={linkGroup.title}>
                <Skeleton fontWeight={500} mb={3} display="inline-block" isLoaded={!isPlaceholderData}>
                  {linkGroup.title}
                </Skeleton>
                <VStack spacing={1} alignItems="start">
                  {linkGroup.links.map((link) => (
                    <FooterLinkItem {...link} key={link.text} isLoading={isPlaceholderData} />
                  ))}
                </VStack>
              </Box>
            ))}
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid
      {...containerProps}
      gridTemplateAreas={{
        lg: `
          "network links-top"
          "info links-bottom"
        `,
      }}
    >
      {renderNetworkInfo({ lg: "network" })}
      {renderProjectInfo({ lg: "info" })}

      <Grid
        gridArea={{ lg: "links-bottom" }}
        gap={1}
        gridTemplateColumns={{
          base: "repeat(auto-fill, 160px)",
          lg: "repeat(3, 160px)",
          xl: "repeat(4, 160px)",
        }}
        gridTemplateRows={{
          base: "auto",
          lg: "repeat(3, auto)",
          xl: "repeat(2, auto)",
        }}
        gridAutoFlow={{ base: "row", lg: "column" }}
        alignContent="start"
        justifyContent={{ lg: "flex-end" }}
        mt={{ base: 8, lg: 0 }}
      >
        {BLOCKSCOUT_LINKS.map((link) => (
          <FooterLinkItem {...link} key={link.text} />
        ))}
      </Grid>
    </Grid>
  );
};

export default React.memo(Footer);

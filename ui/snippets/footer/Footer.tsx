import {
  Box,
  Grid,
  Flex,
  Text,
  Link,
  VStack,
  Skeleton,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";

import type { CustomLinksGroup } from "types/footerLinks";

import config from "configs/app";
// import discussionsIcon from "icons/discussions.svg";
// import donateIcon from "icons/donate.svg";
// import editIcon from "icons/edit.svg";
// import cannyIcon from "icons/social/canny.svg";
// import discordIcon from "icons/social/discord.svg";
// import gitIcon from "icons/social/git.svg";
// import twitterIcon from "icons/social/tweet.svg";
import discordIcon from "icons/edexaSocial/discord.svg";
import facebookIcon from "icons/edexaSocial/facebook.svg";
import instagramIcon from "icons/edexaSocial/instagram.svg";
import linkedInIcon from "icons/edexaSocial/linkedln.svg";
import redditIcon from "icons/edexaSocial/reddit.svg";
import spotifyIcon from "icons/edexaSocial/spotify.svg";
import telegramIcon from "icons/edexaSocial/telegram.svg";
import twitterIcon from "icons/edexaSocial/twitter.svg";
import type { ResourceError } from "lib/api/resources";
import useApiQuery from "lib/api/useApiQuery";
import useFetch from "lib/hooks/useFetch";
import useIssueUrl from "lib/hooks/useIssueUrl";
import NetworkAddToWallet from "ui/shared/NetworkAddToWallet";

import ColorModeToggler from "../header/ColorModeToggler";
import FooterLinkItem from "./FooterLinkItem";
import IntTxsIndexingStatus from "./IntTxsIndexingStatus";
import getApiVersionUrl from "./utils/getApiVersionUrl";

const MAX_LINKS_COLUMNS = 4;

// const FRONT_VERSION_URL = `https://github.com/blockscout/frontend/tree/${config.UI.footer.frontendVersion}`;
// const FRONT_COMMIT_URL = `https://github.com/blockscout/frontend/commit/${config.UI.footer.frontendCommit}`;

const Footer = () => {
  // const { data: backendVersionData } = useApiQuery("config_backend_version", {
  //   queryOptions: {
  //     staleTime: Infinity,
  //   },
  // });
  // const apiVersionUrl = getApiVersionUrl(backendVersionData?.backend_version);
  // const issueUrl = useIssueUrl(backendVersionData?.backend_version);
  const BLOCKSCOUT_LINKS: any = [
    {
      icon: linkedInIcon,
      iconSize: "20px",
      text: "LinkedIn",
      url: "https://www.linkedin.com/company/edexablockchain/",
    },
    {
      icon: discordIcon,
      iconSize: "20px",
      text: "Discrord",
      url: "https://discord.com/invite/TKBQS9tZJY",
    },
    {
      icon: facebookIcon,
      iconSize: "20px",
      text: "Facebook",
      url: "https://www.facebook.com/EDEXA-302612773660046/",
    },
    {
      icon: twitterIcon,
      iconSize: "20px",
      text: "X",
      url: "https://twitter.com/edexablockchain",
    },
    {
      icon: instagramIcon,
      iconSize: "20px",
      text: "Instagram",
      url: "https://www.instagram.com/edexa_blockchain/",
    },
    {
      icon: spotifyIcon,
      iconSize: "20px",
      text: "Spotify",
      url: "https://open.spotify.com/show/0zaRr0AAvszhWyDGx4ZVUO?si=7daf4877a7914b7e&nd=1&dlsi=e73ea03729614927",
    },
    {
      icon: telegramIcon,
      iconSize: "20px",
      text: "Telegram",
      url: "https://t.me/edeXa",
    },
    {
      icon: redditIcon,
      iconSize: "20px",
      text: "Reddit",
      url: "https://www.reddit.com/user/edexa_blockchain",
    },
  ];

  // const frontendLink = (() => {
  //   if (config.UI.footer.frontendVersion) {
  //     return (
  //       <Link href={FRONT_VERSION_URL} target="_blank">
  //         {config.UI.footer.frontendVersion}
  //       </Link>
  //     );
  //   }

  //   if (config.UI.footer.frontendCommit) {
  //     return (
  //       <Link href={FRONT_COMMIT_URL} target="_blank">
  //         {config.UI.footer.frontendCommit}
  //       </Link>
  //     );
  //   }

  //   return null;
  // })();

  const fetch = useFetch();

  const { isPending, data: linksData } = useQuery<
    unknown,
    ResourceError<unknown>,
    Array<CustomLinksGroup>
  >({
    queryKey: ["footer-links"],
    queryFn: async () =>
      fetch(config.UI.footer.links || "", undefined, {
        resource: "footer-links",
      }),
    enabled: Boolean(config.UI.footer.links),
    staleTime: Infinity,
  });

  const colNum = Math.min(linksData?.length || Infinity, MAX_LINKS_COLUMNS) + 1;
  const darkModeFilter = { filter: "brightness(0) invert(1)" };
  const logoStyle = useColorModeValue(
    {},
    !config.UI.sidebar.logo.dark ? darkModeFilter : {}
  );
  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      px={{ base: 4, lg: 12 }}
      py={{ base: 4, lg: 9 }}
      borderTop="1px solid"
      borderColor="divider"
      as="footer"
      columnGap={{ lg: "32px", xl: "100px" }}
    >
      <Box flexGrow="1" mb={{ base: 8, lg: 0 }} minW="195px">
        <Flex flexWrap="wrap" columnGap={8} rowGap={6}>
          <ColorModeToggler />
          {!config.UI.indexingAlert.intTxs.isHidden && <IntTxsIndexingStatus />}
          <NetworkAddToWallet />
        </Flex>
        <Box mt={{ base: 5, lg: "44px" }}>
          {/* <Link fontSize="xs" href="https://www.blockscout.com">
            blockscout.com
          </Link> */}
          <Image
            w="14%"
            h="100%"
            src="https://edexa-general.s3.ap-south-1.amazonaws.com/logo.svg"
            style={logoStyle}
            alt={`${config.chain.name} network logo`}
          />
        </Box>
        <Text mt={3} maxW={{ base: "unset", lg: "470px" }} fontSize="xs">
          edeXa Business Blockchain, private and public ecosystem built to
          enable scalable and business- oriented dApps for the world.
        </Text>
        {/* <VStack spacing={ 1 } mt={ 6 } alignItems="start">
          { apiVersionUrl && (
            <Text fontSize="xs">
                Backend: <Link href={ apiVersionUrl } target="_blank">{ backendVersionData?.backend_version }</Link>
            </Text>
          ) }
          { frontendLink && (
            <Text fontSize="xs">
              Frontend: { frontendLink }
            </Text>
          ) }
        </VStack> */}
      </Box>
      <Grid
        gap={{
          base: 6,
          lg:
            config.UI.footer.links && colNum === MAX_LINKS_COLUMNS + 1 ? 2 : 8,
          xl: 12,
        }}
        gridTemplateColumns={
          config.UI.footer.links
            ? {
                base: "repeat(auto-fill, 160px)",
                lg: `repeat(${colNum}, 135px)`,
                xl: `repeat(${colNum}, 160px)`,
              }
            : "auto"
        }
      >
        <Box>
          {config.UI.footer.links && (
            <Text fontWeight={500} mb={3}>
              Blockscout
            </Text>
          )}
          <Grid
            gap={1}
            gridTemplateColumns={
              config.UI.footer.links
                ? "1fr"
                : {
                    base: "repeat(auto-fill, 160px)",
                    lg: "repeat(3, 160px)",
                    xl: "repeat(4, 160px)",
                  }
            }
            gridTemplateRows={{
              base: "auto",
              lg: config.UI.footer.links ? "auto" : "repeat(3, auto)",
              xl: config.UI.footer.links ? "auto" : "repeat(2, auto)",
            }}
            gridAutoFlow={{
              base: "row",
              lg: config.UI.footer.links ? "row" : "column",
            }}
            mt={{ base: 0, lg: config.UI.footer.links ? 0 : "100px" }}
          >
            {BLOCKSCOUT_LINKS.map((link: any) => (
              <FooterLinkItem {...link} key={link.text} />
            ))}
          </Grid>
        </Box>
        {config.UI.footer.links &&
          isPending &&
          Array.from(Array(3)).map((i, index) => (
            <Box key={index}>
              <Skeleton w="100%" h="20px" mb={6} />
              <VStack spacing={5} alignItems="start" mb={2}>
                {Array.from(Array(5)).map((i, index) => (
                  <Skeleton w="100%" h="14px" key={index} />
                ))}
              </VStack>
            </Box>
          ))}
        {config.UI.footer.links &&
          linksData &&
          linksData.slice(0, MAX_LINKS_COLUMNS).map((linkGroup: any) => (
            <Box key={linkGroup.title}>
              <Text fontWeight={500} mb={3}>
                {linkGroup.title}
              </Text>
              <VStack spacing={1} alignItems="start">
                {linkGroup.links.map((link: any) => (
                  <FooterLinkItem {...link} key={link.text} />
                ))}
              </VStack>
            </Box>
          ))}
      </Grid>
    </Flex>
  );
};

export default Footer;

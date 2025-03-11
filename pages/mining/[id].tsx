import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useEffect, useState } from 'react';

import useMarketplaceApps from '../../ui/marketplace/useMarketplaceApps';
import GptLongMining from '../../ui/mining/decentral-gpt/long-mining';
import GptShortMining from '../../ui/mining/decentral-gpt/short-mining';
import DeepLinkLongMining from '../../ui/mining/deep-link/long-mining';
import DeepLinkShortMining from '../../ui/mining/deep-link/short-mining';
import CpuMining from '../../ui/mining/deep-link/cpu-mining';
import { useTranslation } from 'next-i18next';

interface MiningAppDetail {
  id: string;
  title: string;
  logo: string;
  description: string;
  miningInfo: {
    dailyReward: string;
    gpuCount: string;
    totalMiners: string;
    hashRate: string;
  };
  tokenInfo: {
    symbol: string;
    price: string;
    priceChange: string;
    marketCap: string;
    volume24h: string;
  };
}

export default function MiningAppDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [appData, setAppData] = useState<MiningAppDetail | null>(null);
  const { asPath } = router;
  const { gpuMiningData } = useMarketplaceApps('', 'all');
  const { t, i18n } = useTranslation('common');

  useEffect(() => {
    console.log(router, 'routerrouter');
    if (id && gpuMiningData) {
      const matchedApp = gpuMiningData.find((app) => app.id === id || app.title === id);

      if (matchedApp) {
        setAppData({
          id: matchedApp.id,
          title: matchedApp.title,
          logo: matchedApp.logo,
          description: matchedApp.description,
          miningInfo: {
            dailyReward: matchedApp.miningInfo?.dailyReward || '0',
            gpuCount: matchedApp.miningInfo?.gpuCount || '0',
            totalMiners: matchedApp.miningInfo?.totalMiners || '0',
            hashRate: matchedApp.miningInfo?.hashRate || '0',
          },
          tokenInfo: {
            symbol: matchedApp.tokenInfo?.symbol || '',
            price: matchedApp.tokenInfo?.price || '0',
            priceChange: matchedApp.tokenInfo?.priceChange || '0',
            marketCap: matchedApp.tokenInfo?.marketCap || '0',
            volume24h: matchedApp.tokenInfo?.volume24h || '0',
          },
        });
      }
      setIsLoading(false);
    }
  }, [id, gpuMiningData]);

  return (
    <Container maxW="container.xl" py={4}>
      <Flex direction="column" gap={4}>
        <Flex gap={6} align="start">
          <Skeleton isLoaded={!isLoading} w="80px" h="80px" borderRadius="xl">
            <Image
              src={appData?.logo}
              alt={`${appData?.title} logo`}
              w="80px"
              h="80px"
              borderRadius="xl"
              objectFit="cover"
            />
          </Skeleton>

          <Flex direction="column" gap={3} flex={1}>
            <Skeleton isLoaded={!isLoading}>
              <Text fontSize="3xl" fontWeight="bold">
                {appData?.title || 'DeepLink'}
              </Text>
            </Skeleton>
          </Flex>
        </Flex>

        <Box>
          <Tabs>
            <TabList>
              <Tab>{t('long-mining')} </Tab>
              <Tab> {asPath === '/mining/DeepLink' ? t('short-mining') : t('free-mining')}</Tab>
              {asPath === '/mining/DeepLink' && <Tab>{t('cpu-mining')} </Tab>}
            </TabList>

            <TabPanels>
              <TabPanel>{asPath === '/mining/DeepLink' ? <DeepLinkLongMining /> : <GptLongMining />}</TabPanel>

              <TabPanel>
                <Text>{asPath === '/mining/DeepLink' ? <DeepLinkShortMining /> : <GptShortMining />}</Text>
              </TabPanel>
              <TabPanel>
                <Text>
                  <CpuMining />
                </Text>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Container>
  );
}
export { marketplace as getServerSideProps } from 'nextjs/getServerSideProps';

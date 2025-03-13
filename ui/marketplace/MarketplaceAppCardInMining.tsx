import { Box, Flex, Image, Skeleton, useColorModeValue, chakra, Text, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { MouseEvent } from 'react';
import React, { useEffect } from 'react';
import stakingAbi from '../../lib/hooks/useDeepLink/stakingAbi.json';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem'; // 使用 viem 的格式化工具

interface Props {
  id: string;
  url: string;
  title: string;
  logo: string;
  miningInfo: {
    dailyReward: string;
    gpuCount: string;
  };
  tokenInfo: {
    symbol: string;
    price: string;
    priceChange: string;
  };
  isLoading: boolean;
  onAppClick: (event: MouseEvent, id: string) => void;
  className?: string;
}

const MarketplaceAppCard = ({
  id,
  url,
  title,
  logo,
  miningInfo,
  tokenInfo,
  isLoading,
  onAppClick,
  className,
}: Props) => {
  const href = {
    pathname: '/mining/[id]' as const,
    query: { id },
  };

  const STAKING_CONTRACT_ADDRESS = '0x59bb02e28e8335c38a275eb0efd158f0065a447d';

  // 读取 dailyRewardAmount

  const { data: dailyRewardAmount, isLoading: rewardLoading } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi: stakingAbi,
    functionName: 'dailyRewardAmount',
  });

  // 格式化 dailyRewardAmount（确保是 bigint 类型）
  const formattedReward =
    dailyRewardAmount && typeof dailyRewardAmount === 'bigint'
      ? Number(formatUnits(dailyRewardAmount, 18)).toFixed(2) // 从 wei 转换为 ETH，保留 2 位小数
      : '0.00';

  const { data: totalStakingGpuCount, isLoading: gpuLoading } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi: stakingAbi,
    functionName: 'totalStakingGpuCount',
  });
  // 格式化 totalStakingGpuCount
  const formattedGpuCount =
    totalStakingGpuCount !== undefined && typeof totalStakingGpuCount === 'bigint'
      ? Number(totalStakingGpuCount).toString()
      : '0.00';

  useEffect(() => {
    console.log('deeplink每日总的奖励数量', formattedReward, formattedGpuCount);
  }, [formattedReward, formattedGpuCount]);

  return (
    <NextLink href={href} passHref legacyBehavior>
      <Link
        as="article"
        className={className}
        _hover={{
          boxShadow: isLoading ? 'none' : 'lg',
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out',
          textDecoration: 'none',
        }}
        borderRadius="lg"
        padding={6}
        border="1px"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
        bg={useColorModeValue('white', 'gray.800')}
        onClick={(e) => onAppClick(e, id)}
        display="block"
      >
        <Flex direction="column" gap={4}>
          <Flex justify="space-between" align="start">
            <Skeleton isLoaded={!isLoading} w="80px" h="80px" borderRadius="lg" flexShrink={0}>
              <Image src={logo} alt={`${title} logo`} borderRadius="lg" w="80px" h="80px" objectFit="cover" />
            </Skeleton>

            <Flex direction="column" gap={1}>
              <Skeleton isLoaded={!isLoading}>
                <Box
                  border="1px"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  borderRadius="md"
                  px={2}
                  py={1}
                >
                  <Text fontSize="md" fontWeight="medium">
                    ${tokenInfo?.symbol}:{tokenInfo?.price}
                  </Text>
                </Box>
              </Skeleton>
              <Skeleton isLoaded={!isLoading}>
                <Text color="green.500" fontWeight="medium" fontSize="sm">
                  {tokenInfo?.priceChange}
                </Text>
              </Skeleton>
            </Flex>
          </Flex>

          <Skeleton isLoaded={!isLoading}>
            <Text fontSize="xl" fontWeight="bold">
              {title}
            </Text>
          </Skeleton>

          <Skeleton isLoaded={!isLoading}>
            <Flex direction="column" gap={2} bg={useColorModeValue('gray.50', 'gray.700')} p={3} borderRadius="md">
              <Text fontSize="sm" fontWeight="medium">
                Daily Mining Reward: <Skeleton isLoaded={!rewardLoading}>{formattedReward}</Skeleton>
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                GPU Count: <Skeleton isLoaded={!gpuLoading}>{formattedGpuCount}</Skeleton>
              </Text>
            </Flex>
          </Skeleton>
        </Flex>
      </Link>
    </NextLink>
  );
};

export default React.memo(chakra(MarketplaceAppCard));

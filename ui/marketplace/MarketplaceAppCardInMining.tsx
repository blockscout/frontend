import { Box, Flex, Image, Skeleton, useColorModeValue, chakra, Text, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { MouseEvent } from 'react';
import React from 'react';

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

  return (
    <NextLink href={ href } passHref legacyBehavior>
      <Link
        as="article"
        className={ className }
        _hover={{
          boxShadow: isLoading ? 'none' : 'lg',
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out',
          textDecoration: 'none',
        }}
        borderRadius="lg"
        padding={ 6 }
        border="1px"
        borderColor={ useColorModeValue('gray.200', 'gray.600') }
        bg={ useColorModeValue('white', 'gray.800') }
        onClick={ (e) => onAppClick(e, id) }
        display="block"
      >
        <Flex direction="column" gap={ 4 }>
          <Flex justify="space-between" align="start">
            <Skeleton isLoaded={ !isLoading } w="80px" h="80px" borderRadius="lg" flexShrink={ 0 }>
              <Image src={ logo } alt={ `${ title } logo` } borderRadius="lg" w="80px" h="80px" objectFit="cover"/>
            </Skeleton>

            <Flex direction="column" gap={ 1 }>
              <Skeleton isLoaded={ !isLoading }>
                <Box
                  border="1px"
                  borderColor={ useColorModeValue('gray.200', 'gray.600') }
                  borderRadius="md"
                  px={ 2 }
                  py={ 1 }
                >
                  <Text fontSize="md" fontWeight="medium">
                    ${ tokenInfo?.symbol }:{ tokenInfo?.price }
                  </Text>
                </Box>
              </Skeleton>
              <Skeleton isLoaded={ !isLoading }>
                <Text color="green.500" fontWeight="medium" fontSize="sm">
                  { tokenInfo?.priceChange }
                </Text>
              </Skeleton>
            </Flex>
          </Flex>

          <Skeleton isLoaded={ !isLoading }>
            <Text fontSize="xl" fontWeight="bold">
              { title }
            </Text>
          </Skeleton>

          <Skeleton isLoaded={ !isLoading }>
            <Flex direction="column" gap={ 2 } bg={ useColorModeValue('gray.50', 'gray.700') } p={ 3 } borderRadius="md">
              <Text fontSize="sm" fontWeight="medium">
                Daily Mining Reward: { miningInfo?.dailyReward }
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                GPU Count: { miningInfo?.gpuCount }
              </Text>
            </Flex>
          </Skeleton>
        </Flex>
      </Link>
    </NextLink>
  );
};

export default React.memo(chakra(MarketplaceAppCard));

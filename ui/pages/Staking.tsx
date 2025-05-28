import { Text, Box, VStack, HStack, Badge, Button, Divider, SimpleGrid, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import router from 'next/router';
import React, { useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';

import { useUserStakes } from 'lib/getUserStakes';
import useToastModified from 'lib/hooks/useToast';
import { useStakingMethods } from 'lib/useStakingMethods';
import ContentLoader from 'ui/shared/ContentLoader';

// Component to display user stakes
const UserStakesSection = () => {
  const { address: userAddress } = useAccount();
  const { data, totalStaked, totalRewards, loading, error, refetch } = useUserStakes(userAddress as string);

  const {
    claimRewards,
    undelegate,
    isLoading,
    error: stakingError,
    success,
    clearMessages,
  } = useStakingMethods();

  const toast = useToastModified();

  // Handle success/error messages with toast notifications
  useEffect(() => {
    if (success) {
      toast({
        title: 'Transaction Successful',
        description: `Transaction Hash: ${ success }`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Refetch stakes after successful transaction
      setTimeout(() => {
        refetch();
      }, 2000);
    }
  }, [ success, toast, refetch ]);

  useEffect(() => {
    if (stakingError) {
      toast({
        title: 'Transaction Failed',
        description: stakingError,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [ stakingError, toast ]);

  const handleClaimRewards = useCallback(async(validatorId: number) => {
    clearMessages();
    try {
      await claimRewards(validatorId);
    } catch (err) {
      // Handle error appropriately - could use toast or other error handling
      toast({
        title: 'Error',
        description: 'Failed to claim rewards',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [ claimRewards, clearMessages, toast ]);

  const handleUnstake = useCallback(async(validatorId: number, amount: string) => {
    clearMessages();
    try {
      await undelegate(validatorId, amount);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to unstake',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [ undelegate, clearMessages, toast ]);

  const handleClaimRewardsForStake = (validatorId: number) => () => {
    handleClaimRewards(validatorId);
  };

  const handleUnstakeForStake = (validatorId: number, amount: string) => () => {
    handleUnstake(validatorId, amount);
  };

  const handleRefresh = useCallback(() => {
    refetch();
  }, [ refetch ]);

  const handleAddStake = useCallback(() => {
    router.push('/add-delegation');
  }, []);

  if (!userAddress) {
    return (
      <Box p={ 4 } bg="gray.50" borderRadius="md">
        <Text color="gray.600">Connect wallet to view your stakes</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={ 4 } bg="red.50" borderRadius="md" borderColor="red.200" borderWidth={ 1 }>
        <Text color="red.600" mb={ 2 }>Error loading stakes</Text>
        <Button size="sm" colorScheme="red" variant="outline" onClick={ handleRefresh }>
          Retry
        </Button>
      </Box>
    );
  }

  if (loading) {
    return <ContentLoader/>;
  }

  return (
    <VStack spacing={ 6 } align="stretch">
      { /* Summary Stats */ }
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={ 6 }>
        <Stat>
          <StatLabel>Total Staked</StatLabel>
          <StatNumber color="blue.600">{ totalStaked } RWA</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total Rewards</StatLabel>
          <StatNumber color="green.600">{ totalRewards } RWA</StatNumber>
        </Stat>
      </SimpleGrid>

      <Divider/>

      { /* Stakes List */ }
      { data.length === 0 ? (
        <Box p={ 4 } bg="gray.50" borderRadius="md" textAlign="center">
          <Text color="gray.600">No active stakes found</Text>
        </Box>
      ) : (
        <VStack spacing={ 4 } align="stretch">
          <HStack justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="semibold">Your Stakes</Text>
            <HStack justify="flex-end">
              <Button
                variant="solid"
                size="md"
                bgColor="whiteAlpha.100"
                width="150px"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={ handleRefresh }>
                Refresh
              </Button>
              <Button
                variant="solid"
                size="md"
                bgColor="whiteAlpha.100"
                width="150px"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={ handleAddStake }>
                Add stake
              </Button>
            </HStack>
          </HStack>

          { data.map((stake) => (
            <Box
              key={ `${ stake.validator }-${ stake.id }` }
              p={ 4 }
              bg="dark"
              borderRadius="md"
              borderWidth={ 2 }
              borderColor="solid"
              _hover={{ borderColor: 'blue.300', shadow: 'sm' }}
            >
              <HStack justify="space-between" align="start" spacing={ 4 }>
                <VStack align="start" spacing={ 2 } flex={ 1 }>
                  <HStack>
                    <Badge colorScheme="blue" variant="subtle">
                      { stake.stakingName }
                    </Badge>
                    <Text fontSize="sm" color="gray.600">
                      Validator #{ stake.validator }
                    </Text>
                  </HStack>

                  <HStack spacing={ 6 }>
                    <VStack align="start" spacing={ 0 }>
                      <Text fontSize="xs" color="gray.500">Staked Amount</Text>
                      <Text fontWeight="semibold" color="blue.600">
                        { stake.amount } RWA
                      </Text>
                    </VStack>

                    <VStack align="start" spacing={ 0 }>
                      <Text fontSize="xs" color="gray.500">Pending Rewards</Text>
                      <Text fontWeight="semibold" color="green.600">
                        { stake.rewards } RWA
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>

                <VStack spacing={ 2 }>
                  { parseFloat(stake.rewards) > 0 && (
                    <Button
                      variant="solid"
                      size="md"
                      width="150px"
                      isLoading={ isLoading(stake.validator, 'claim') }
                      loadingText="Claiming..."
                      onClick={ handleClaimRewardsForStake(stake.validator) }
                      _hover={{ bg: 'green.400' }}
                    >
                      { stake.claim }
                    </Button>
                  ) }

                  { parseFloat(stake.amount) > 0 && (
                    <Button
                      variant="solid"
                      size="md"
                      width="150px"
                      isLoading={ isLoading(stake.validator, 'unstake') }
                      loadingText="Unstaking..."
                      onClick={ handleUnstakeForStake(stake.validator, stake.amount) }
                      _hover={{ bg: 'red.400' }}
                    >
                      Unstake
                    </Button>
                  ) }
                </VStack>
              </HStack>
            </Box>
          )) }
        </VStack>
      ) }
    </VStack>
  );
};

export default UserStakesSection;

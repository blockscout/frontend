import { Text, Box, Flex, useColorModeValue, Button } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import IconSvg from 'ui/shared/IconSvg';

import AvailableSoonLabel from '../AvailableSoonLabel';
import CopyField from '../CopyField';
import useReferrals from '../useReferrals';

const CongratsStepContent = () => {
  const referralsQuery = useReferrals();
  return (
    <>
      <Flex
        flexDirection="column"
        background="linear-gradient(254.96deg, #9CD8FF 9.09%, #D0EFFF 88.45%)"
        borderRadius="md"
        padding={ 2 }
        pt={ 6 }
        mb={ 8 }
      >
        <Flex alignItems="center" pl={ 2 } mb={ 4 }>
          <IconSvg name="merits_colored" boxSize={ 16 }/>
          <Text fontSize="30px" fontWeight="700" color="blue.700">
            +250
          </Text>
        </Flex>
        <Flex
          flexDirection="column"
          backgroundColor={ useColorModeValue('white', 'gray.900') }
          borderRadius="8px"
          padding={ 4 }
          gap={ 2 }
        >
          <Flex alignItems="center" gap={ 2 }>
            <Text fontSize="lg" fontWeight="500">
              Pre-staking
            </Text>
            <AvailableSoonLabel/>
          </Flex>
          <Text fontSize="sm">Support your favorite networks and earn 10% APR</Text>
        </Flex>
      </Flex>
      <Flex flexDirection="column" alignItems="flex-start" px={ 3 } mb={ 8 }>
        <Flex alignItems="center" gap={ 2 }>
          <Box w={ 8 } h={ 8 } p={ 1.5 } borderRadius="8px" backgroundColor="blue.50">
            <IconSvg name="profile" boxSize={ 5 } color="blue.500"/>
          </Box>
          <Text fontSize="lg" fontWeight="500">
            Referral program
          </Text>
        </Flex>
        <Text fontSize="md" mt={ 2 }>
          Receive a 10% bonus on all merits earned by your referrals
        </Text>
        <CopyField
          label="Referral link"
          value={ referralsQuery.data?.link || '' }
          isLoading={ referralsQuery.isLoading }
          mt={ 3 }
        />
        <Button mt={ 6 } isLoading={ referralsQuery.isLoading }>
          Share on <IconSvg name="social/twitter" boxSize={ 6 } ml={ 1 }/>
        </Button>
      </Flex>
      <Flex flexDirection="column" alignItems="flex-start" px={ 3 }>
        <Flex alignItems="center" gap={ 2 }>
          <Box w={ 8 } h={ 8 } p={ 1 } borderRadius="8px" backgroundColor="blue.50">
            <IconSvg name="stats" boxSize={ 6 } color="blue.500"/>
          </Box>
          <Text fontSize="lg" fontWeight="500">
            Dashboard
          </Text>
        </Flex>
        <Text fontSize="md" mt={ 2 }>
          Explore your current merits balance, find activities to boost your merits,
          and view your capybara NFT badge collection on the dashboard
        </Text>
        <Button mt={ 3 } as="a" href={ route({ pathname: '/account/rewards' }) }>
          Open
        </Button>
      </Flex>
    </>
  );
};

export default CongratsStepContent;

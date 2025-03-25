import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import Skeleton from 'ui/shared/chakra/Skeleton';
import HintPopover from 'ui/shared/HintPopover';

import MeritsIcon from '../MeritsIcon';

type Props = {
  label?: string;
  value: number | string | undefined;
  withIcon?: boolean;
  hint?: string | React.ReactNode;
  isLoading?: boolean;
  bottomText?: string;
};

const RewardsDashboardCard = ({ label, value, withIcon, hint, isLoading, bottomText }: Props) => (
  <Flex key={ label } flexDirection="column" alignItems="center" gap={ 2 }>
    { label && (
      <Flex alignItems="center" gap={ 1 }>
        { hint && (
          <HintPopover
            label={ hint }
            popoverContentProps={{ maxW: { base: 'calc(100vw - 8px)', lg: '400px' } }}
            popoverBodyProps={{ textAlign: 'center' }}
          />
        ) }
        <Text fontSize="xs" fontWeight="500" variant="secondary">
          { label }
        </Text>
      </Flex>
    ) }
    <Skeleton
      isLoaded={ !isLoading }
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={ 2 }
      minW="100px"
    >
      { withIcon && <MeritsIcon boxSize={ 8 }/> }
      <Text fontSize={{ base: '24px', md: '32px' }} lineHeight={{ base: '24px', md: 1.5 }} fontWeight="500">
        { value }
      </Text>
    </Skeleton>
    { bottomText && (
      <Skeleton isLoaded={ !isLoading }>
        <Text fontSize="xs" fontWeight="500" variant="secondary">
          { bottomText }
        </Text>
      </Skeleton>
    ) }
  </Flex>
);

export default RewardsDashboardCard;

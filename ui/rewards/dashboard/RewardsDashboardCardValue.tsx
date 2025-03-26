import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import Hint from 'ui/shared/Hint';

import MeritsIcon from '../MeritsIcon';

type Props = {
  label?: string;
  value: number | string | undefined;
  withIcon?: boolean;
  hint?: string | React.ReactNode;
  isLoading?: boolean;
};

const RewardsDashboardCard = ({ label, value, withIcon, hint, isLoading }: Props) => (
  <Flex key={ label } flexDirection="column" alignItems="center" gap={ 2 }>
    { label && (
      <Flex alignItems="center" gap={ 1 }>
        { hint && (
          <Hint label={ hint }/>
        ) }
        <Text fontSize="xs" fontWeight="500" color="text.secondary">
          { label }
        </Text>
      </Flex>
    ) }
    <Skeleton
      loading={ isLoading }
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
  </Flex>
);

export default RewardsDashboardCard;

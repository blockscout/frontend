import { Flex, Text, Icon } from '@chakra-ui/react';
import React from 'react';

// This icon doesn't work properly when it is in the sprite
// Probably because of the gradient
// eslint-disable-next-line no-restricted-imports
import meritsIcon from 'icons/merits_colored.svg';
import HintPopover from 'ui/shared/HintPopover';

type Props = {
  label: string;
  value: number | string | undefined;
  withIcon?: boolean;
  hint?: string | React.ReactNode;
}

const RewardsDashboardCard = ({ label, value, withIcon, hint }: Props) => {
  return (
    <Flex key={ label } flexDirection="column" alignItems="center" gap={ 2 }>
      <Flex alignItems="center" gap={ 1 }>
        { hint && (
          <HintPopover
            label={ hint }
            popoverContentProps={{ maxW: { base: 'calc(100vw - 8px)', lg: '210px' } }}
            popoverBodyProps={{ textAlign: 'center' }}
          />
        ) }
        <Text fontSize="xs" fontWeight="500" variant="secondary">
          { label }
        </Text>
      </Flex>
      <Flex alignItems="center">
        { withIcon && (
          <Icon as={ meritsIcon } boxSize={ 12 } mt={ -2 } mb={ -2.5 }/>
        ) }
        <Text fontSize={{ base: '24px', md: '32px' }} lineHeight={{ base: '24px', md: 1.5 }} fontWeight="500">
          { value }
        </Text>
      </Flex>
    </Flex>
  );
};

export default RewardsDashboardCard;

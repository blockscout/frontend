import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import HintPopover from 'ui/shared/HintPopover';
import IconSvg from 'ui/shared/IconSvg';

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
          <IconSvg
            name="merits_colored"
            boxSize={ 12 }
            mb={ -0.5 }
            filter="drop-shadow(0px 4px 3px rgba(21, 57, 103, 0.1))"
          />
        ) }
        <Text fontSize="32px" fontWeight="500">
          { value }
        </Text>
      </Flex>
    </Flex>
  );
};

export default RewardsDashboardCard;

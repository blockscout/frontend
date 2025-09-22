import { Box, Flex } from '@chakra-ui/react';

import type { AllowanceType } from '../lib/types';

import EmptySearchResult from 'ui/shared/EmptySearchResult';

import ApprovalsListItem from './ApprovalsListItem';
import ApprovalsTable from './ApprovalsTable';

type Props = {
  selectedNetwork: number;
  approvals: Array<AllowanceType>;
  isLoading?: boolean;
  isAddressMatch?: boolean;
};

export default function Approvals({
  selectedNetwork,
  approvals,
  isLoading,
  isAddressMatch,
}: Props) {
  return (
    <>
      <Box hideFrom="lg">
        <Flex flexDirection="column">
          { approvals.map((approval, index) => (
            <ApprovalsListItem
              key={ index }
              selectedNetwork={ selectedNetwork }
              approval={ approval }
              isLoading={ isLoading }
              isAddressMatch={ isAddressMatch }
            />
          )) }
          { !isLoading && !approvals.length && (
            <EmptySearchResult text="No approvals found"/>
          ) }
        </Flex>
      </Box>
      <Box hideBelow="lg">
        <ApprovalsTable
          selectedNetwork={ selectedNetwork }
          approvals={ approvals }
          isLoading={ isLoading }
          isAddressMatch={ isAddressMatch }
        />
      </Box>
    </>
  );
}

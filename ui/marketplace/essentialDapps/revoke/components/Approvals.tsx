import { Box, Flex } from '@chakra-ui/react';

import type { AllowanceType } from '../lib/types';

import EmptySearchResult from 'ui/shared/EmptySearchResult';

import ApprovalsListItem from './ApprovalsListItem';
import ApprovalsTable from './ApprovalsTable';

type Props = {
  selectedChainId: number;
  approvals: Array<AllowanceType>;
  isLoading?: boolean;
  isAddressMatch?: boolean;
};

export default function Approvals({
  selectedChainId,
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
              selectedChainId={ selectedChainId }
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
          selectedChainId={ selectedChainId }
          approvals={ approvals }
          isLoading={ isLoading }
          isAddressMatch={ isAddressMatch }
        />
      </Box>
    </>
  );
}

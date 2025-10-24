import { Box, Flex } from '@chakra-ui/react';

import type { AllowanceType } from 'types/client/revoke';
import type { ChainConfig } from 'types/multichain';

import DataListDisplay from 'ui/shared/DataListDisplay';

import ApprovalsListItem from './ApprovalsListItem';
import ApprovalsTable from './ApprovalsTable';

type Props = {
  selectedChain: ChainConfig | undefined;
  approvals: Array<AllowanceType>;
  isLoading?: boolean;
  isAddressMatch?: boolean;
  hideApproval: (approval: AllowanceType) => void;
};

export default function Approvals({
  selectedChain,
  approvals,
  isLoading,
  isAddressMatch,
  hideApproval,
}: Props) {
  const content = (
    <>
      <Flex hideFrom="lg" flexDirection="column">
        { approvals.map((approval, index) => (
          <ApprovalsListItem
            key={ index }
            selectedChain={ selectedChain }
            approval={ approval }
            isLoading={ isLoading }
            isAddressMatch={ isAddressMatch }
            hideApproval={ hideApproval }
          />
        )) }
      </Flex>
      <Box hideBelow="lg">
        <ApprovalsTable
          selectedChain={ selectedChain }
          approvals={ approvals }
          isLoading={ isLoading }
          isAddressMatch={ isAddressMatch }
          hideApproval={ hideApproval }
        />
      </Box>
    </>
  );

  return (
    <DataListDisplay
      itemsNum={ approvals.length }
      isError={ false }
      filterProps={{
        emptyFilteredText: 'No approvals found',
        hasActiveFilters: true,
      }}
    >
      { content }
    </DataListDisplay>
  );
}

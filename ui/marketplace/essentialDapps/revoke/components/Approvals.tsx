import { Box, Flex } from '@chakra-ui/react';

import type { EssentialDappsChainConfig } from 'types/client/marketplace';
import type { AllowanceType } from 'types/client/revoke';

import EmptySearchResult from 'ui/shared/EmptySearchResult';

import ApprovalsListItem from './ApprovalsListItem';
import ApprovalsTable from './ApprovalsTable';

type Props = {
  selectedChain: EssentialDappsChainConfig | undefined;
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
  return (
    <>
      <Box hideFrom="lg">
        <Flex flexDirection="column">
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
          { !isLoading && !approvals.length && (
            <EmptySearchResult text="No approvals found"/>
          ) }
        </Flex>
      </Box>
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
}

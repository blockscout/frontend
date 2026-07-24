// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { AllowanceType } from '../types';
import type { EssentialDappsChainConfig } from 'src/features/marketplace/types/client';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import ApprovalsListItem from './ApprovalsListItem';

type Props = {
  selectedChain: EssentialDappsChainConfig | undefined;
  approvals: Array<AllowanceType>;
  isLoading?: boolean;
  isAddressMatch?: boolean;
  hideApproval: (approval: AllowanceType) => void;
  resetKey?: string;
};

export default function ApprovalsList({
  selectedChain,
  approvals,
  isLoading,
  isAddressMatch,
  hideApproval,
  resetKey,
}: Props) {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: approvals, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Flex flexDirection="column">
        { approvals.slice(0, renderedItemsNum).map((approval, index) => (
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
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
}

// SPDX-License-Identifier: LicenseRef-Blockscout

import ERC20Artifact from '@openzeppelin/contracts/build/contracts/ERC20.json';
import NftArtifact from '@openzeppelin/contracts/build/contracts/ERC721.json';

import type { AllowanceType } from '../types';

import { ZERO_ADDRESS } from 'src/toolkit/utils/consts';

export function getRevokeContractCall(approval: AllowanceType) {
  const isErc20 = approval.type === 'ERC-20';
  const isLimitedNft = approval.type !== 'ERC-20' && Boolean(approval.tokenId);

  if (isErc20) {
    return {
      abi: ERC20Artifact.abi,
      functionName: 'approve',
      args: [ approval.spender, 0 ],
    };
  }

  if (isLimitedNft) {
    return {
      abi: NftArtifact.abi,
      functionName: 'approve',
      args: [ ZERO_ADDRESS, BigInt(approval.tokenId as string) ],
    };
  }

  return {
    abi: NftArtifact.abi,
    functionName: 'setApprovalForAll',
    args: [ approval.spender, false ],
  };
}

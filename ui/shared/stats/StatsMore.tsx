/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-restricted-imports */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { Link } from '@chakra-ui/react';
import { cover, loop, pipe } from '@hairy/utils';
import { moonchain, moonchainGeneva } from '@moonchain/metadata';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import gql from 'graphql-tag';
import { useEffect } from 'react';
import { createPublicClient, getContract, http } from 'viem';
import { arbitrum, arbitrumSepolia } from 'viem/chains';

import config from 'configs/app';
import { Hint } from 'toolkit/components/Hint/Hint';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const fragments = {
  l1: [
    {
      type: 'function',
      name: 'acceptOwnership',
      inputs: [],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'addressManager',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'address',
          internalType: 'address',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'bondBalanceOf',
      inputs: [
        {
          name: '_user',
          type: 'address',
          internalType: 'address',
        },
      ],
      outputs: [
        {
          name: '',
          type: 'uint256',
          internalType: 'uint256',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'depositBond',
      inputs: [
        {
          name: '_amount',
          type: 'uint256',
          internalType: 'uint256',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'getBlock',
      inputs: [
        {
          name: '_blockId',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      outputs: [
        {
          name: 'blk_',
          type: 'tuple',
          internalType: 'struct TaikoData.Block',
          components: [
            {
              name: 'metaHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'assignedProver',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'livenessBond',
              type: 'uint96',
              internalType: 'uint96',
            },
            {
              name: 'blockId',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'proposedAt',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'proposedIn',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'nextTransitionId',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'verifiedTransitionId',
              type: 'uint32',
              internalType: 'uint32',
            },
          ],
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getBlockV2',
      inputs: [
        {
          name: '_blockId',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      outputs: [
        {
          name: 'blk_',
          type: 'tuple',
          internalType: 'struct TaikoData.BlockV2',
          components: [
            {
              name: 'metaHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'assignedProver',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'livenessBond',
              type: 'uint96',
              internalType: 'uint96',
            },
            {
              name: 'blockId',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'proposedAt',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'proposedIn',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'nextTransitionId',
              type: 'uint24',
              internalType: 'uint24',
            },
            {
              name: 'livenessBondReturned',
              type: 'bool',
              internalType: 'bool',
            },
            {
              name: 'verifiedTransitionId',
              type: 'uint24',
              internalType: 'uint24',
            },
          ],
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getConfig',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'tuple',
          internalType: 'struct TaikoData.Config',
          components: [
            {
              name: 'chainId',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'blockMaxProposals',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'blockRingBufferSize',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'maxBlocksToVerify',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'blockMaxGasLimit',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'livenessBond',
              type: 'uint96',
              internalType: 'uint96',
            },
            {
              name: 'stateRootSyncInternal',
              type: 'uint8',
              internalType: 'uint8',
            },
            {
              name: 'maxAnchorHeightOffset',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'baseFeeConfig',
              type: 'tuple',
              internalType: 'struct TaikoData.BaseFeeConfig',
              components: [
                {
                  name: 'adjustmentQuotient',
                  type: 'uint8',
                  internalType: 'uint8',
                },
                {
                  name: 'sharingPctg',
                  type: 'uint8',
                  internalType: 'uint8',
                },
                {
                  name: 'gasIssuancePerSecond',
                  type: 'uint32',
                  internalType: 'uint32',
                },
                {
                  name: 'minGasExcess',
                  type: 'uint64',
                  internalType: 'uint64',
                },
                {
                  name: 'maxGasIssuancePerBlock',
                  type: 'uint32',
                  internalType: 'uint32',
                },
              ],
            },
            {
              name: 'ontakeForkHeight',
              type: 'uint64',
              internalType: 'uint64',
            },
          ],
        },
      ],
      stateMutability: 'pure',
    },
    {
      type: 'function',
      name: 'getLastSyncedBlock',
      inputs: [],
      outputs: [
        {
          name: 'blockId_',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: 'blockHash_',
          type: 'bytes32',
          internalType: 'bytes32',
        },
        {
          name: 'stateRoot_',
          type: 'bytes32',
          internalType: 'bytes32',
        },
        {
          name: 'verifiedAt_',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getLastVerifiedBlock',
      inputs: [],
      outputs: [
        {
          name: 'blockId_',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: 'blockHash_',
          type: 'bytes32',
          internalType: 'bytes32',
        },
        {
          name: 'stateRoot_',
          type: 'bytes32',
          internalType: 'bytes32',
        },
        {
          name: 'verifiedAt_',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getStateVariables',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'tuple',
          internalType: 'struct TaikoData.SlotA',
          components: [
            {
              name: 'genesisHeight',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'genesisTimestamp',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'lastSyncedBlockId',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'lastSynecdAt',
              type: 'uint64',
              internalType: 'uint64',
            },
          ],
        },
        {
          name: '',
          type: 'tuple',
          internalType: 'struct TaikoData.SlotB',
          components: [
            {
              name: 'numBlocks',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'lastVerifiedBlockId',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'provingPaused',
              type: 'bool',
              internalType: 'bool',
            },
            {
              name: '__reservedB1',
              type: 'uint8',
              internalType: 'uint8',
            },
            {
              name: '__reservedB2',
              type: 'uint16',
              internalType: 'uint16',
            },
            {
              name: '__reservedB3',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'lastUnpausedAt',
              type: 'uint64',
              internalType: 'uint64',
            },
          ],
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getTransition',
      inputs: [
        {
          name: '_blockId',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: '_tid',
          type: 'uint32',
          internalType: 'uint32',
        },
      ],
      outputs: [
        {
          name: '',
          type: 'tuple',
          internalType: 'struct TaikoData.TransitionState',
          components: [
            {
              name: 'key',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'blockHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'stateRoot',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'prover',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'validityBond',
              type: 'uint96',
              internalType: 'uint96',
            },
            {
              name: 'contester',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'contestBond',
              type: 'uint96',
              internalType: 'uint96',
            },
            {
              name: 'timestamp',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'tier',
              type: 'uint16',
              internalType: 'uint16',
            },
            {
              name: '__reserved1',
              type: 'uint8',
              internalType: 'uint8',
            },
          ],
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getTransition',
      inputs: [
        {
          name: '_blockId',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: '_parentHash',
          type: 'bytes32',
          internalType: 'bytes32',
        },
      ],
      outputs: [
        {
          name: '',
          type: 'tuple',
          internalType: 'struct TaikoData.TransitionState',
          components: [
            {
              name: 'key',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'blockHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'stateRoot',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'prover',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'validityBond',
              type: 'uint96',
              internalType: 'uint96',
            },
            {
              name: 'contester',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'contestBond',
              type: 'uint96',
              internalType: 'uint96',
            },
            {
              name: 'timestamp',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'tier',
              type: 'uint16',
              internalType: 'uint16',
            },
            {
              name: '__reserved1',
              type: 'uint8',
              internalType: 'uint8',
            },
          ],
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getVerifiedBlockProver',
      inputs: [
        {
          name: '_blockId',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      outputs: [
        {
          name: 'prover_',
          type: 'address',
          internalType: 'address',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'impl',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'address',
          internalType: 'address',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'inNonReentrant',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'bool',
          internalType: 'bool',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'init',
      inputs: [
        {
          name: '_owner',
          type: 'address',
          internalType: 'address',
        },
        {
          name: '_rollupAddressManager',
          type: 'address',
          internalType: 'address',
        },
        {
          name: '_genesisBlockHash',
          type: 'bytes32',
          internalType: 'bytes32',
        },
        {
          name: '_toPause',
          type: 'bool',
          internalType: 'bool',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'init2',
      inputs: [],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'lastUnpausedAt',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'owner',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'address',
          internalType: 'address',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'pause',
      inputs: [],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'pauseProving',
      inputs: [
        {
          name: '_pause',
          type: 'bool',
          internalType: 'bool',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'paused',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'bool',
          internalType: 'bool',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'pendingOwner',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'address',
          internalType: 'address',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'proposeBlock',
      inputs: [
        {
          name: '_params',
          type: 'bytes',
          internalType: 'bytes',
        },
        {
          name: '_txList',
          type: 'bytes',
          internalType: 'bytes',
        },
      ],
      outputs: [
        {
          name: 'meta_',
          type: 'tuple',
          internalType: 'struct TaikoData.BlockMetadata',
          components: [
            {
              name: 'l1Hash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'difficulty',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'blobHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'extraData',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'depositsHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'coinbase',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'id',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'gasLimit',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'timestamp',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'l1Height',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'minTier',
              type: 'uint16',
              internalType: 'uint16',
            },
            {
              name: 'blobUsed',
              type: 'bool',
              internalType: 'bool',
            },
            {
              name: 'parentMetaHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'sender',
              type: 'address',
              internalType: 'address',
            },
          ],
        },
        {
          name: 'deposits_',
          type: 'tuple[]',
          internalType: 'struct TaikoData.EthDeposit[]',
          components: [
            {
              name: 'recipient',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'amount',
              type: 'uint96',
              internalType: 'uint96',
            },
            {
              name: 'id',
              type: 'uint64',
              internalType: 'uint64',
            },
          ],
        },
      ],
      stateMutability: 'payable',
    },
    {
      type: 'function',
      name: 'proposeBlockV2',
      inputs: [
        {
          name: '_params',
          type: 'bytes',
          internalType: 'bytes',
        },
        {
          name: '_txList',
          type: 'bytes',
          internalType: 'bytes',
        },
      ],
      outputs: [
        {
          name: 'meta_',
          type: 'tuple',
          internalType: 'struct TaikoData.BlockMetadataV2',
          components: [
            {
              name: 'anchorBlockHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'difficulty',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'blobHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'extraData',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'coinbase',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'id',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'gasLimit',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'timestamp',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'anchorBlockId',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'minTier',
              type: 'uint16',
              internalType: 'uint16',
            },
            {
              name: 'blobUsed',
              type: 'bool',
              internalType: 'bool',
            },
            {
              name: 'parentMetaHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'proposer',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'livenessBond',
              type: 'uint96',
              internalType: 'uint96',
            },
            {
              name: 'proposedAt',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'proposedIn',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'blobTxListOffset',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'blobTxListLength',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'blobIndex',
              type: 'uint8',
              internalType: 'uint8',
            },
            {
              name: 'baseFeeConfig',
              type: 'tuple',
              internalType: 'struct TaikoData.BaseFeeConfig',
              components: [
                {
                  name: 'adjustmentQuotient',
                  type: 'uint8',
                  internalType: 'uint8',
                },
                {
                  name: 'sharingPctg',
                  type: 'uint8',
                  internalType: 'uint8',
                },
                {
                  name: 'gasIssuancePerSecond',
                  type: 'uint32',
                  internalType: 'uint32',
                },
                {
                  name: 'minGasExcess',
                  type: 'uint64',
                  internalType: 'uint64',
                },
                {
                  name: 'maxGasIssuancePerBlock',
                  type: 'uint32',
                  internalType: 'uint32',
                },
              ],
            },
          ],
        },
      ],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'proposeBlocksV2',
      inputs: [
        {
          name: '_paramsArr',
          type: 'bytes[]',
          internalType: 'bytes[]',
        },
        {
          name: '_txListArr',
          type: 'bytes[]',
          internalType: 'bytes[]',
        },
      ],
      outputs: [
        {
          name: 'metaArr_',
          type: 'tuple[]',
          internalType: 'struct TaikoData.BlockMetadataV2[]',
          components: [
            {
              name: 'anchorBlockHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'difficulty',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'blobHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'extraData',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'coinbase',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'id',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'gasLimit',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'timestamp',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'anchorBlockId',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'minTier',
              type: 'uint16',
              internalType: 'uint16',
            },
            {
              name: 'blobUsed',
              type: 'bool',
              internalType: 'bool',
            },
            {
              name: 'parentMetaHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'proposer',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'livenessBond',
              type: 'uint96',
              internalType: 'uint96',
            },
            {
              name: 'proposedAt',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'proposedIn',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'blobTxListOffset',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'blobTxListLength',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'blobIndex',
              type: 'uint8',
              internalType: 'uint8',
            },
            {
              name: 'baseFeeConfig',
              type: 'tuple',
              internalType: 'struct TaikoData.BaseFeeConfig',
              components: [
                {
                  name: 'adjustmentQuotient',
                  type: 'uint8',
                  internalType: 'uint8',
                },
                {
                  name: 'sharingPctg',
                  type: 'uint8',
                  internalType: 'uint8',
                },
                {
                  name: 'gasIssuancePerSecond',
                  type: 'uint32',
                  internalType: 'uint32',
                },
                {
                  name: 'minGasExcess',
                  type: 'uint64',
                  internalType: 'uint64',
                },
                {
                  name: 'maxGasIssuancePerBlock',
                  type: 'uint32',
                  internalType: 'uint32',
                },
              ],
            },
          ],
        },
      ],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'proveBlock',
      inputs: [
        {
          name: '_blockId',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: '_input',
          type: 'bytes',
          internalType: 'bytes',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'proveBlocks',
      inputs: [
        {
          name: '_blockIds',
          type: 'uint64[]',
          internalType: 'uint64[]',
        },
        {
          name: '_inputs',
          type: 'bytes[]',
          internalType: 'bytes[]',
        },
        {
          name: '_batchProof',
          type: 'bytes',
          internalType: 'bytes',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'proxiableUUID',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'bytes32',
          internalType: 'bytes32',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'renounceOwnership',
      inputs: [],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'resolve',
      inputs: [
        {
          name: '_chainId',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: '_name',
          type: 'bytes32',
          internalType: 'bytes32',
        },
        {
          name: '_allowZeroAddress',
          type: 'bool',
          internalType: 'bool',
        },
      ],
      outputs: [
        {
          name: '',
          type: 'address',
          internalType: 'address',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'resolve',
      inputs: [
        {
          name: '_name',
          type: 'bytes32',
          internalType: 'bytes32',
        },
        {
          name: '_allowZeroAddress',
          type: 'bool',
          internalType: 'bool',
        },
      ],
      outputs: [
        {
          name: '',
          type: 'address',
          internalType: 'address',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'state',
      inputs: [],
      outputs: [
        {
          name: '__reserve1',
          type: 'bytes32',
          internalType: 'bytes32',
        },
        {
          name: 'slotA',
          type: 'tuple',
          internalType: 'struct TaikoData.SlotA',
          components: [
            {
              name: 'genesisHeight',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'genesisTimestamp',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'lastSyncedBlockId',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'lastSynecdAt',
              type: 'uint64',
              internalType: 'uint64',
            },
          ],
        },
        {
          name: 'slotB',
          type: 'tuple',
          internalType: 'struct TaikoData.SlotB',
          components: [
            {
              name: 'numBlocks',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'lastVerifiedBlockId',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'provingPaused',
              type: 'bool',
              internalType: 'bool',
            },
            {
              name: '__reservedB1',
              type: 'uint8',
              internalType: 'uint8',
            },
            {
              name: '__reservedB2',
              type: 'uint16',
              internalType: 'uint16',
            },
            {
              name: '__reservedB3',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'lastUnpausedAt',
              type: 'uint64',
              internalType: 'uint64',
            },
          ],
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'transferOwnership',
      inputs: [
        {
          name: 'newOwner',
          type: 'address',
          internalType: 'address',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'unpause',
      inputs: [],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'upgradeTo',
      inputs: [
        {
          name: 'newImplementation',
          type: 'address',
          internalType: 'address',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'upgradeToAndCall',
      inputs: [
        {
          name: 'newImplementation',
          type: 'address',
          internalType: 'address',
        },
        {
          name: 'data',
          type: 'bytes',
          internalType: 'bytes',
        },
      ],
      outputs: [],
      stateMutability: 'payable',
    },
    {
      type: 'function',
      name: 'verifyBlocks',
      inputs: [
        {
          name: '_maxBlocksToVerify',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'withdrawBond',
      inputs: [
        {
          name: '_amount',
          type: 'uint256',
          internalType: 'uint256',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'event',
      name: 'AdminChanged',
      inputs: [
        {
          name: 'previousAdmin',
          type: 'address',
          indexed: false,
          internalType: 'address',
        },
        {
          name: 'newAdmin',
          type: 'address',
          indexed: false,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'BeaconUpgraded',
      inputs: [
        {
          name: 'beacon',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'BlockProposed',
      inputs: [
        {
          name: 'blockId',
          type: 'uint256',
          indexed: true,
          internalType: 'uint256',
        },
        {
          name: 'assignedProver',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'livenessBond',
          type: 'uint96',
          indexed: false,
          internalType: 'uint96',
        },
        {
          name: 'meta',
          type: 'tuple',
          indexed: false,
          internalType: 'struct TaikoData.BlockMetadata',
          components: [
            {
              name: 'l1Hash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'difficulty',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'blobHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'extraData',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'depositsHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'coinbase',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'id',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'gasLimit',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'timestamp',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'l1Height',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'minTier',
              type: 'uint16',
              internalType: 'uint16',
            },
            {
              name: 'blobUsed',
              type: 'bool',
              internalType: 'bool',
            },
            {
              name: 'parentMetaHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'sender',
              type: 'address',
              internalType: 'address',
            },
          ],
        },
        {
          name: 'depositsProcessed',
          type: 'tuple[]',
          indexed: false,
          internalType: 'struct TaikoData.EthDeposit[]',
          components: [
            {
              name: 'recipient',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'amount',
              type: 'uint96',
              internalType: 'uint96',
            },
            {
              name: 'id',
              type: 'uint64',
              internalType: 'uint64',
            },
          ],
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'BlockProposedV2',
      inputs: [
        {
          name: 'blockId',
          type: 'uint256',
          indexed: true,
          internalType: 'uint256',
        },
        {
          name: 'meta',
          type: 'tuple',
          indexed: false,
          internalType: 'struct TaikoData.BlockMetadataV2',
          components: [
            {
              name: 'anchorBlockHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'difficulty',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'blobHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'extraData',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'coinbase',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'id',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'gasLimit',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'timestamp',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'anchorBlockId',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'minTier',
              type: 'uint16',
              internalType: 'uint16',
            },
            {
              name: 'blobUsed',
              type: 'bool',
              internalType: 'bool',
            },
            {
              name: 'parentMetaHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'proposer',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'livenessBond',
              type: 'uint96',
              internalType: 'uint96',
            },
            {
              name: 'proposedAt',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'proposedIn',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'blobTxListOffset',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'blobTxListLength',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'blobIndex',
              type: 'uint8',
              internalType: 'uint8',
            },
            {
              name: 'baseFeeConfig',
              type: 'tuple',
              internalType: 'struct TaikoData.BaseFeeConfig',
              components: [
                {
                  name: 'adjustmentQuotient',
                  type: 'uint8',
                  internalType: 'uint8',
                },
                {
                  name: 'sharingPctg',
                  type: 'uint8',
                  internalType: 'uint8',
                },
                {
                  name: 'gasIssuancePerSecond',
                  type: 'uint32',
                  internalType: 'uint32',
                },
                {
                  name: 'minGasExcess',
                  type: 'uint64',
                  internalType: 'uint64',
                },
                {
                  name: 'maxGasIssuancePerBlock',
                  type: 'uint32',
                  internalType: 'uint32',
                },
              ],
            },
          ],
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'BlockVerified',
      inputs: [
        {
          name: 'blockId',
          type: 'uint256',
          indexed: true,
          internalType: 'uint256',
        },
        {
          name: 'prover',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'blockHash',
          type: 'bytes32',
          indexed: false,
          internalType: 'bytes32',
        },
        {
          name: 'stateRoot',
          type: 'bytes32',
          indexed: false,
          internalType: 'bytes32',
        },
        {
          name: 'tier',
          type: 'uint16',
          indexed: false,
          internalType: 'uint16',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'BlockVerified',
      inputs: [
        {
          name: 'blockId',
          type: 'uint256',
          indexed: true,
          internalType: 'uint256',
        },
        {
          name: 'prover',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'blockHash',
          type: 'bytes32',
          indexed: false,
          internalType: 'bytes32',
        },
        {
          name: 'stateRoot',
          type: 'bytes32',
          indexed: false,
          internalType: 'bytes32',
        },
        {
          name: 'tier',
          type: 'uint16',
          indexed: false,
          internalType: 'uint16',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'BlockVerifiedV2',
      inputs: [
        {
          name: 'blockId',
          type: 'uint256',
          indexed: true,
          internalType: 'uint256',
        },
        {
          name: 'prover',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'blockHash',
          type: 'bytes32',
          indexed: false,
          internalType: 'bytes32',
        },
        {
          name: 'tier',
          type: 'uint16',
          indexed: false,
          internalType: 'uint16',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'BlockVerifiedV2',
      inputs: [
        {
          name: 'blockId',
          type: 'uint256',
          indexed: true,
          internalType: 'uint256',
        },
        {
          name: 'prover',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'blockHash',
          type: 'bytes32',
          indexed: false,
          internalType: 'bytes32',
        },
        {
          name: 'tier',
          type: 'uint16',
          indexed: false,
          internalType: 'uint16',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'BondCredited',
      inputs: [
        {
          name: 'user',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'amount',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'BondDebited',
      inputs: [
        {
          name: 'user',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'amount',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'CalldataTxList',
      inputs: [
        {
          name: 'blockId',
          type: 'uint256',
          indexed: true,
          internalType: 'uint256',
        },
        {
          name: 'txList',
          type: 'bytes',
          indexed: false,
          internalType: 'bytes',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Initialized',
      inputs: [
        {
          name: 'version',
          type: 'uint8',
          indexed: false,
          internalType: 'uint8',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'OwnershipTransferStarted',
      inputs: [
        {
          name: 'previousOwner',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'newOwner',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'OwnershipTransferred',
      inputs: [
        {
          name: 'previousOwner',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'newOwner',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Paused',
      inputs: [
        {
          name: 'account',
          type: 'address',
          indexed: false,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'ProvingPaused',
      inputs: [
        {
          name: 'paused',
          type: 'bool',
          indexed: false,
          internalType: 'bool',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'ProvingPaused',
      inputs: [
        {
          name: 'paused',
          type: 'bool',
          indexed: false,
          internalType: 'bool',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'StateVariablesUpdated',
      inputs: [
        {
          name: 'slotB',
          type: 'tuple',
          indexed: false,
          internalType: 'struct TaikoData.SlotB',
          components: [
            {
              name: 'numBlocks',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'lastVerifiedBlockId',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'provingPaused',
              type: 'bool',
              internalType: 'bool',
            },
            {
              name: '__reservedB1',
              type: 'uint8',
              internalType: 'uint8',
            },
            {
              name: '__reservedB2',
              type: 'uint16',
              internalType: 'uint16',
            },
            {
              name: '__reservedB3',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'lastUnpausedAt',
              type: 'uint64',
              internalType: 'uint64',
            },
          ],
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'TransitionContested',
      inputs: [
        {
          name: 'blockId',
          type: 'uint256',
          indexed: true,
          internalType: 'uint256',
        },
        {
          name: 'tran',
          type: 'tuple',
          indexed: false,
          internalType: 'struct TaikoData.Transition',
          components: [
            {
              name: 'parentHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'blockHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'stateRoot',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'graffiti',
              type: 'bytes32',
              internalType: 'bytes32',
            },
          ],
        },
        {
          name: 'contester',
          type: 'address',
          indexed: false,
          internalType: 'address',
        },
        {
          name: 'contestBond',
          type: 'uint96',
          indexed: false,
          internalType: 'uint96',
        },
        {
          name: 'tier',
          type: 'uint16',
          indexed: false,
          internalType: 'uint16',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'TransitionContestedV2',
      inputs: [
        {
          name: 'blockId',
          type: 'uint256',
          indexed: true,
          internalType: 'uint256',
        },
        {
          name: 'tran',
          type: 'tuple',
          indexed: false,
          internalType: 'struct TaikoData.Transition',
          components: [
            {
              name: 'parentHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'blockHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'stateRoot',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'graffiti',
              type: 'bytes32',
              internalType: 'bytes32',
            },
          ],
        },
        {
          name: 'contester',
          type: 'address',
          indexed: false,
          internalType: 'address',
        },
        {
          name: 'contestBond',
          type: 'uint96',
          indexed: false,
          internalType: 'uint96',
        },
        {
          name: 'tier',
          type: 'uint16',
          indexed: false,
          internalType: 'uint16',
        },
        {
          name: 'proposedIn',
          type: 'uint64',
          indexed: false,
          internalType: 'uint64',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'TransitionProved',
      inputs: [
        {
          name: 'blockId',
          type: 'uint256',
          indexed: true,
          internalType: 'uint256',
        },
        {
          name: 'tran',
          type: 'tuple',
          indexed: false,
          internalType: 'struct TaikoData.Transition',
          components: [
            {
              name: 'parentHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'blockHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'stateRoot',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'graffiti',
              type: 'bytes32',
              internalType: 'bytes32',
            },
          ],
        },
        {
          name: 'prover',
          type: 'address',
          indexed: false,
          internalType: 'address',
        },
        {
          name: 'validityBond',
          type: 'uint96',
          indexed: false,
          internalType: 'uint96',
        },
        {
          name: 'tier',
          type: 'uint16',
          indexed: false,
          internalType: 'uint16',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'TransitionProvedV2',
      inputs: [
        {
          name: 'blockId',
          type: 'uint256',
          indexed: true,
          internalType: 'uint256',
        },
        {
          name: 'tran',
          type: 'tuple',
          indexed: false,
          internalType: 'struct TaikoData.Transition',
          components: [
            {
              name: 'parentHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'blockHash',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'stateRoot',
              type: 'bytes32',
              internalType: 'bytes32',
            },
            {
              name: 'graffiti',
              type: 'bytes32',
              internalType: 'bytes32',
            },
          ],
        },
        {
          name: 'prover',
          type: 'address',
          indexed: false,
          internalType: 'address',
        },
        {
          name: 'validityBond',
          type: 'uint96',
          indexed: false,
          internalType: 'uint96',
        },
        {
          name: 'tier',
          type: 'uint16',
          indexed: false,
          internalType: 'uint16',
        },
        {
          name: 'proposedIn',
          type: 'uint64',
          indexed: false,
          internalType: 'uint64',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Unpaused',
      inputs: [
        {
          name: 'account',
          type: 'address',
          indexed: false,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Upgraded',
      inputs: [
        {
          name: 'implementation',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    {
      type: 'error',
      name: 'FUNC_NOT_IMPLEMENTED',
      inputs: [],
    },
    {
      type: 'error',
      name: 'INVALID_PAUSE_STATUS',
      inputs: [],
    },
    {
      type: 'error',
      name: 'L1_FORK_ERROR',
      inputs: [],
    },
    {
      type: 'error',
      name: 'L1_INVALID_BLOCK_ID',
      inputs: [],
    },
    {
      type: 'error',
      name: 'L1_INVALID_GENESIS_HASH',
      inputs: [],
    },
    {
      type: 'error',
      name: 'L1_INVALID_PARAMS',
      inputs: [],
    },
    {
      type: 'error',
      name: 'L1_INVALID_PAUSE_STATUS',
      inputs: [],
    },
    {
      type: 'error',
      name: 'L1_PROVING_PAUSED',
      inputs: [],
    },
    {
      type: 'error',
      name: 'L1_TRANSITION_NOT_FOUND',
      inputs: [],
    },
    {
      type: 'error',
      name: 'L1_UNEXPECTED_TRANSITION_ID',
      inputs: [],
    },
    {
      type: 'error',
      name: 'REENTRANT_CALL',
      inputs: [],
    },
    {
      type: 'error',
      name: 'RESOLVER_DENIED',
      inputs: [],
    },
    {
      type: 'error',
      name: 'RESOLVER_INVALID_MANAGER',
      inputs: [],
    },
    {
      type: 'error',
      name: 'RESOLVER_UNEXPECTED_CHAINID',
      inputs: [],
    },
    {
      type: 'error',
      name: 'RESOLVER_ZERO_ADDR',
      inputs: [
        {
          name: 'chainId',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: 'name',
          type: 'bytes32',
          internalType: 'bytes32',
        },
      ],
    },
    {
      type: 'error',
      name: 'ZERO_ADDRESS',
      inputs: [],
    },
    {
      type: 'error',
      name: 'ZERO_VALUE',
      inputs: [],
    },
  ] as const,
  l2: [
    {
      type: 'function',
      name: 'FORK_HEIGHT',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint256',
          internalType: 'uint256',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'GOLDEN_TOUCH_ADDRESS',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'address',
          internalType: 'address',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'acceptOwnership',
      inputs: [],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'addressManager',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'address',
          internalType: 'address',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'adjustExcess',
      inputs: [
        {
          name: '_currGasExcess',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: '_currGasTarget',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: '_newGasTarget',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      outputs: [
        {
          name: 'newGasExcess_',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      stateMutability: 'pure',
    },
    {
      type: 'function',
      name: 'anchor',
      inputs: [
        {
          name: '',
          type: 'bytes32',
          internalType: 'bytes32',
        },
        {
          name: '_l1StateRoot',
          type: 'bytes32',
          internalType: 'bytes32',
        },
        {
          name: '_l1BlockId',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: '_parentGasUsed',
          type: 'uint32',
          internalType: 'uint32',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'anchorV2',
      inputs: [
        {
          name: '_anchorBlockId',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: '_anchorStateRoot',
          type: 'bytes32',
          internalType: 'bytes32',
        },
        {
          name: '_parentGasUsed',
          type: 'uint32',
          internalType: 'uint32',
        },
        {
          name: '_baseFeeConfig',
          type: 'tuple',
          internalType: 'struct TaikoData.BaseFeeConfig',
          components: [
            {
              name: 'adjustmentQuotient',
              type: 'uint8',
              internalType: 'uint8',
            },
            {
              name: 'sharingPctg',
              type: 'uint8',
              internalType: 'uint8',
            },
            {
              name: 'gasIssuancePerSecond',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'minGasExcess',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'maxGasIssuancePerBlock',
              type: 'uint32',
              internalType: 'uint32',
            },
          ],
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'calculateBaseFee',
      inputs: [
        {
          name: '_baseFeeConfig',
          type: 'tuple',
          internalType: 'struct TaikoData.BaseFeeConfig',
          components: [
            {
              name: 'adjustmentQuotient',
              type: 'uint8',
              internalType: 'uint8',
            },
            {
              name: 'sharingPctg',
              type: 'uint8',
              internalType: 'uint8',
            },
            {
              name: 'gasIssuancePerSecond',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'minGasExcess',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'maxGasIssuancePerBlock',
              type: 'uint32',
              internalType: 'uint32',
            },
          ],
        },
        {
          name: '_blocktime',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: '_parentGasExcess',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: '_parentGasUsed',
          type: 'uint32',
          internalType: 'uint32',
        },
      ],
      outputs: [
        {
          name: 'basefee_',
          type: 'uint256',
          internalType: 'uint256',
        },
        {
          name: 'parentGasExcess_',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      stateMutability: 'pure',
    },
    {
      type: 'function',
      name: 'getBasefee',
      inputs: [
        {
          name: '_anchorBlockId',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: '_parentGasUsed',
          type: 'uint32',
          internalType: 'uint32',
        },
      ],
      outputs: [
        {
          name: 'basefee_',
          type: 'uint256',
          internalType: 'uint256',
        },
        {
          name: 'parentGasExcess_',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getBlockHash',
      inputs: [
        {
          name: '_blockId',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      outputs: [
        {
          name: '',
          type: 'bytes32',
          internalType: 'bytes32',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getConfig',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'tuple',
          internalType: 'struct LibL2Config.Config',
          components: [
            {
              name: 'gasTargetPerL1Block',
              type: 'uint32',
              internalType: 'uint32',
            },
            {
              name: 'basefeeAdjustmentQuotient',
              type: 'uint8',
              internalType: 'uint8',
            },
          ],
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'impl',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'address',
          internalType: 'address',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'inNonReentrant',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'bool',
          internalType: 'bool',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'init',
      inputs: [
        {
          name: '_owner',
          type: 'address',
          internalType: 'address',
        },
        {
          name: '_rollupAddressManager',
          type: 'address',
          internalType: 'address',
        },
        {
          name: '_l1ChainId',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: '_initialGasExcess',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'init2',
      inputs: [
        {
          name: '_initialGasExcess',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'l1ChainId',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'l2Hashes',
      inputs: [
        {
          name: 'blockId',
          type: 'uint256',
          internalType: 'uint256',
        },
      ],
      outputs: [
        {
          name: 'blockHash',
          type: 'bytes32',
          internalType: 'bytes32',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'lastSyncedBlock',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'lastUnpausedAt',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'ontakeForkHeight',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      stateMutability: 'pure',
    },
    {
      type: 'function',
      name: 'owner',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'address',
          internalType: 'address',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'parentGasExcess',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'parentGasTarget',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'parentTimestamp',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'pause',
      inputs: [],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'paused',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'bool',
          internalType: 'bool',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'pendingOwner',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'address',
          internalType: 'address',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'proxiableUUID',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'bytes32',
          internalType: 'bytes32',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'publicInputHash',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'bytes32',
          internalType: 'bytes32',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'renounceOwnership',
      inputs: [],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'resolve',
      inputs: [
        {
          name: '_chainId',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: '_name',
          type: 'bytes32',
          internalType: 'bytes32',
        },
        {
          name: '_allowZeroAddress',
          type: 'bool',
          internalType: 'bool',
        },
      ],
      outputs: [
        {
          name: '',
          type: 'address',
          internalType: 'address',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'resolve',
      inputs: [
        {
          name: '_name',
          type: 'bytes32',
          internalType: 'bytes32',
        },
        {
          name: '_allowZeroAddress',
          type: 'bool',
          internalType: 'bool',
        },
      ],
      outputs: [
        {
          name: '',
          type: 'address',
          internalType: 'address',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'skipFeeCheck',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'bool',
          internalType: 'bool',
        },
      ],
      stateMutability: 'pure',
    },
    {
      type: 'function',
      name: 'transferOwnership',
      inputs: [
        {
          name: 'newOwner',
          type: 'address',
          internalType: 'address',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'unpause',
      inputs: [],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'upgradeTo',
      inputs: [
        {
          name: 'newImplementation',
          type: 'address',
          internalType: 'address',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'upgradeToAndCall',
      inputs: [
        {
          name: 'newImplementation',
          type: 'address',
          internalType: 'address',
        },
        {
          name: 'data',
          type: 'bytes',
          internalType: 'bytes',
        },
      ],
      outputs: [],
      stateMutability: 'payable',
    },
    {
      type: 'function',
      name: 'withdraw',
      inputs: [
        {
          name: '_token',
          type: 'address',
          internalType: 'address',
        },
        {
          name: '_to',
          type: 'address',
          internalType: 'address',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'event',
      name: 'AdminChanged',
      inputs: [
        {
          name: 'previousAdmin',
          type: 'address',
          indexed: false,
          internalType: 'address',
        },
        {
          name: 'newAdmin',
          type: 'address',
          indexed: false,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Anchored',
      inputs: [
        {
          name: 'parentHash',
          type: 'bytes32',
          indexed: false,
          internalType: 'bytes32',
        },
        {
          name: 'parentGasExcess',
          type: 'uint64',
          indexed: false,
          internalType: 'uint64',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'BeaconUpgraded',
      inputs: [
        {
          name: 'beacon',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Initialized',
      inputs: [
        {
          name: 'version',
          type: 'uint8',
          indexed: false,
          internalType: 'uint8',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'OwnershipTransferStarted',
      inputs: [
        {
          name: 'previousOwner',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'newOwner',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'OwnershipTransferred',
      inputs: [
        {
          name: 'previousOwner',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'newOwner',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Paused',
      inputs: [
        {
          name: 'account',
          type: 'address',
          indexed: false,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Unpaused',
      inputs: [
        {
          name: 'account',
          type: 'address',
          indexed: false,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Upgraded',
      inputs: [
        {
          name: 'implementation',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    {
      type: 'error',
      name: 'EIP1559_INVALID_PARAMS',
      inputs: [],
    },
    {
      type: 'error',
      name: 'ETH_TRANSFER_FAILED',
      inputs: [],
    },
    {
      type: 'error',
      name: 'FUNC_NOT_IMPLEMENTED',
      inputs: [],
    },
    {
      type: 'error',
      name: 'INVALID_PAUSE_STATUS',
      inputs: [],
    },
    {
      type: 'error',
      name: 'L2_BASEFEE_MISMATCH',
      inputs: [],
    },
    {
      type: 'error',
      name: 'L2_FORK_ERROR',
      inputs: [],
    },
    {
      type: 'error',
      name: 'L2_INVALID_L1_CHAIN_ID',
      inputs: [],
    },
    {
      type: 'error',
      name: 'L2_INVALID_L2_CHAIN_ID',
      inputs: [],
    },
    {
      type: 'error',
      name: 'L2_INVALID_PARAM',
      inputs: [],
    },
    {
      type: 'error',
      name: 'L2_INVALID_SENDER',
      inputs: [],
    },
    {
      type: 'error',
      name: 'L2_PUBLIC_INPUT_HASH_MISMATCH',
      inputs: [],
    },
    {
      type: 'error',
      name: 'L2_TOO_LATE',
      inputs: [],
    },
    {
      type: 'error',
      name: 'REENTRANT_CALL',
      inputs: [],
    },
    {
      type: 'error',
      name: 'RESOLVER_DENIED',
      inputs: [],
    },
    {
      type: 'error',
      name: 'RESOLVER_INVALID_MANAGER',
      inputs: [],
    },
    {
      type: 'error',
      name: 'RESOLVER_UNEXPECTED_CHAINID',
      inputs: [],
    },
    {
      type: 'error',
      name: 'RESOLVER_ZERO_ADDR',
      inputs: [
        {
          name: 'chainId',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: 'name',
          type: 'bytes32',
          internalType: 'bytes32',
        },
      ],
    },
    {
      type: 'error',
      name: 'ZERO_ADDRESS',
      inputs: [],
    },
    {
      type: 'error',
      name: 'ZERO_VALUE',
      inputs: [],
    },
  ] as const,
};

const queries = {
  burn: gql`
    {
        bundle(id: 1) {
            burn
        }
        mxcdayDatas(first: 1000) {
            id
            date
            burn
        }
    }
  `,
};

const configs = {
  testnet: {
    graph: 'https://geneva-graph-node.moonchain.com/subgraphs/name/mxczkevm/mxc-graph',
    clients: {
      moonchain: createPublicClient({ chain: moonchainGeneva, transport: http() }),
      arbitrum: createPublicClient({ chain: arbitrumSepolia, transport: http() }),
    },
    addresses: {
      l1: { arbitrum: '0x6a5c9E342d5FB5f5EF8a799f0cAAB2678C939b0B' },
      l2: { moonchain: '0x1000777700000000000000000000000000000001' },
    },
  },
  mainnet: {
    graph: 'https://graph-node.moonchain.com/subgraphs/name/mxczkevm/mxc-graph',
    clients: {
      moonchain: createPublicClient({ chain: moonchain, transport: http() }),
      arbitrum: createPublicClient({ chain: arbitrum, transport: http() }),
    },
    addresses: {
      l1: { arbitrum: '0x54D8864e8855A7B66eE42B8F2Eaa0F2E06bd641a' },
      l2: { moonchain: '0x1000777700000000000000000000000000000001' },
    },
  },
} as const;

const getOptions = {
  mainnet: () => ({
    graph: new ApolloClient({
      link: new HttpLink({ uri: configs.mainnet.graph }),
      cache: new InMemoryCache(),
    }),
    clients: configs.mainnet.clients,
    addresses: configs.mainnet.addresses,
    contracts: {
      l1: getContract({
        abi: fragments.l1,
        address: configs.mainnet.addresses.l1.arbitrum,
        client: configs.mainnet.clients.arbitrum,
      }),
      l2: getContract({
        abi: fragments.l2,
        address: configs.mainnet.addresses.l2.moonchain,
        client: configs.mainnet.clients.arbitrum,
      }),
    },
    chains: {
      arbitrum: arbitrum,
      moonchain: moonchain,
    },
  }),
  testnet: () => ({
    graph: new ApolloClient({
      link: new HttpLink({ uri: configs.testnet.graph }),
      cache: new InMemoryCache(),
    }),
    clients: configs.testnet.clients,
    addresses: configs.testnet.addresses,
    contracts: {
      l1: getContract({
        abi: fragments.l1,
        address: configs.testnet.addresses.l1.arbitrum,
        client: configs.testnet.clients.arbitrum,
      }),
      l2: getContract({
        abi: fragments.l2,
        address: configs.testnet.addresses.l2.moonchain,
        client: configs.testnet.clients.moonchain,
      }),
    },
    chains: {
      arbitrum: arbitrumSepolia,
      moonchain: moonchainGeneva,
    },
  }),
} as const;

const { contracts, graph, clients, chains } = config.chain.id === '5167004' ?
  getOptions.testnet() :
  getOptions.mainnet();

function StatsMoreViem({ icon = true }: { icon?: boolean } = {}) {
  const l2latestSyncedHeader = useQuery({
    queryKey: [ 'statsMore_l2latestSyncedHeader' ],
    queryFn: async() => {
      const [ _, blockHash ] = await contracts.l1.read.getLastSyncedBlock();
      return blockHash;
    },
  });
  const l1latestSyncedHeader = useQuery({
    queryKey: [ 'statsMore_l2latestSyncedHeader' ],
    queryFn: async() => {
      // 获取 moonchain lastSyncedBlock
      const lastSyncedBlock = await contracts.l2.read.lastSyncedBlock();
      // 获取 arbitrum 对应的 blockHash
      const block = await clients.arbitrum.getBlock({ blockNumber: lastSyncedBlock });
      return block.hash;
    },
  });
  const lastVerifiedBlock = useQuery({
    queryKey: [ 'statsMore_lastVerifiedBlock' ],
    queryFn: async() => {
      const [ blockId ] = await contracts.l1.read.getLastVerifiedBlock();
      return blockId;
    },
  });
  const unverifiedBlocks = useQuery({
    queryKey: [ 'statsMore_unverifiedBlocks' ],
    queryFn: async() => {
      const [ lastVerifiedBlock ] = await contracts.l1.read.getLastVerifiedBlock();
      const lastBlock = await clients.moonchain.getBlockNumber();
      return lastBlock - lastVerifiedBlock;
    },
  });
  const availableSlots = useQuery({
    queryKey: [ 'statsMore_availableSlots' ],
    queryFn: async() => {
      const [ lastVerifiedBlock ] = await contracts.l1.read.getLastVerifiedBlock();
      const lastBlock = await clients.moonchain.getBlockNumber();
      const config = await contracts.l1.read.getConfig();
      return config.blockRingBufferSize - (lastBlock - lastVerifiedBlock) % config.blockRingBufferSize;
    },
  });
  const latestProofTime = useQuery({
    queryKey: [ 'statsMore_latestProofTime' ],
    queryFn: async() => {
      const [ lastVerifiedBlock ] = await contracts.l1.read.getLastVerifiedBlock();
      const { verifiedTransitionId } = await contracts.l1.read.getBlockV2([ lastVerifiedBlock ]);
      const transition = await contracts.l1.read.getTransition([ lastVerifiedBlock, verifiedTransitionId ]) as any;
      return transition.timestamp;
    },
  });
  const burnsTotal = useQuery({
    queryKey: [ 'statsMore_burnsTotal' ],
    queryFn: pipe.promise(
      () => graph.query({ query: queries.burn }),
      result => result?.data?.bundle.burn || 0,
      burns => parseInt(burns),
    ),
  });

  useEffect(
    () => {
      const cancel = loop(async(next) => {
        await next(20000); // 20s
        l2latestSyncedHeader.refetch();
        l1latestSyncedHeader.refetch();
        lastVerifiedBlock.refetch();
        unverifiedBlocks.refetch();
        availableSlots.refetch();
        latestProofTime.refetch();
        burnsTotal.refetch();
      });
      return () => cancel();
    },
    [],
  );

  return (
    <>
      <StatsWidget
        icon={ icon ? 'burger' : undefined }
        label="L1 Latest Synced Header"
        value={ (
          <Link
            onClick={ () => {
              const explorer = chains.arbitrum.blockExplorers.default;
              window.open(`${ explorer.url }/block/${ l1latestSyncedHeader.data }`, '_blank');
            } }
          >
            { cover(l1latestSyncedHeader.data || '', [ 4, 4, 4 ]) }
          </Link>
        ) }
        isLoading={ l1latestSyncedHeader.isLoading }
        hint={ <Hint label="The most recent Layer 2 Header that has been synchronized with the MXCL1 smart contract."/> }
      />
      <StatsWidget
        icon={ icon ? 'burger' : undefined }
        label="L2 Latest Synced Header"
        value={ (
          <Link
            onClick={ () => {
              const explorer = chains.arbitrum.blockExplorers.default;
              window.open(`${ explorer.url }/block/${ l2latestSyncedHeader.data }`, '_blank');
            } }
          >
            { cover(l2latestSyncedHeader.data || '', [ 4, 4, 4 ]) }
          </Link>
        ) }
        isLoading={ l2latestSyncedHeader.isLoading }
        hint={ <Hint label="The most recent Layer 1 Header that has been synchronized with the MXCL2 smart contract. The headers are synchronized with every L2 block."/> }
      />
      <StatsWidget
        icon={ icon ? 'block' : undefined }
        label="Last Verified Block"
        value={ lastVerifiedBlock.data?.toString() }
        isLoading={ lastVerifiedBlock.isLoading }
        hint={ <Hint label="The latest block that has been verified."/> }
      />
      <StatsWidget
        icon={ icon ? 'block' : undefined }
        label="Unverified Blocks"
        value={ unverifiedBlocks.data?.toString() }
        isLoading={ unverifiedBlocks.isLoading }
        hint={ <Hint label="The number of blocks that have not been verified yet."/> }
      />
      <StatsWidget
        icon={ icon ? 'burger' : undefined }
        label="Available Slots"
        value={ availableSlots.data?.toString() }
        isLoading={ availableSlots.isLoading }
        hint={ <Hint label="The amount of slots for proposed blocks on the MXCL1 smart contract. When this number is 0, no blocks can be proposed until a block has been proven."/> }
      />
      <StatsWidget
        icon={ icon ? 'flame' : undefined }
        label="Total Burnt MXC"
        value={ burnsTotal.data }
        isLoading={ burnsTotal.isLoading }
        hint={ <Hint label="The total amount of burns."/> }
      />
      <StatsWidget
        icon={ icon ? 'ABI' : undefined }
        label="Latest Proof Time"
        value={ latestProofTime.data ? dayjs.unix(Number(latestProofTime.data)).format('YYYY-MM-DD HH:mm:ss') : '' }
        isLoading={ latestProofTime.isLoading }
        hint={ <Hint label="The time of the latest proof."/> }
      />
    </>
  );
}

export default StatsMoreViem;

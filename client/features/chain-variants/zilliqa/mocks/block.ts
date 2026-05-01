/* eslint-disable max-len */
import type { ZilliqaBlockData } from 'client/features/chain-variants/zilliqa/types/api';
import type { Block } from 'client/slices/block/types/api';

import { base } from 'client/slices/block/mocks/block';

export const zilliqaWithAggregateQuorumCertificate: Block = {
  ...base,
  zilliqa: {
    view: 1137735,
    aggregate_quorum_certificate: {
      signature: '0x82d29e8f06adc890f6574c3d0ae0c811de1db695b05ed2755ef384fe21bc44f6505b99e201f6000a65f38ff6a13e286306d0e380ef1b43a273eb9947b3f11f852e14b93c258c32b516f89696fcb1190b147364b789572ebdf85d79c4cf3cbbbb',
      view: 1137735,
      signers: [ 1, 2, 3, 8 ],
      nested_quorum_certificates: [
        {
          signature: '0xaeb3567577f9db68565c6f97c158b17522620a9684c6f6beaa78920951ad4cae0f287b630bdd034c4a4f89ada42e3dbe012985e976a6f64057d735a4531a26b4e46c182414eabbe625e5b15e6645be5b6522bdec113df408874f6d1e0d894dca',
          view: 1137732,
          proposed_by_validator_index: 1,
          signers: [ 3, 8 ],
        },
        {
          signature: '0xaeb3567577f9db68565c6f97c158b17522620a9684c6f6beaa78920951ad4cae0f287b630bdd034c4a4f89ada42e3dbe012985e976a6f64057d735a4531a26b4e46c182414eabbe625e5b15e6645be5b6522bdec113df408874f6d1e0d894dca',
          view: 1137732,
          proposed_by_validator_index: 2,
          signers: [ 0, 2 ],
        },
      ],
    },
    quorum_certificate: {
      signature: '0xaeb3567577f9db68565c6f97c158b17522620a9684c6f6beaa78920951ad4cae0f287b630bdd034c4a4f89ada42e3dbe012985e976a6f64057d735a4531a26b4e46c182414eabbe625e5b15e6645be5b6522bdec113df408874f6d1e0d894dca',
      view: 1137732,
      signers: [ 0, 2, 3, 8 ],
    },
  },
};

export const zilliqaWithoutAggregateQuorumCertificate: Block = {
  ...base,
  zilliqa: {
    ...zilliqaWithAggregateQuorumCertificate.zilliqa,
    aggregate_quorum_certificate: null,
  } as ZilliqaBlockData,
};

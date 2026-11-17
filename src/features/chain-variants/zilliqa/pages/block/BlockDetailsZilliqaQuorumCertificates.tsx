// SPDX-License-Identifier: LicenseRef-Blockscout

import { GridItem } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import BlockDetailsZilliqaQuorumCertificate from 'src/features/chain-variants/zilliqa/pages/block/BlockDetailsZilliqaQuorumCertificate';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

interface Props {
  data: Pick<schemas['BlockResponse'], 'zilliqa'>;
}

const BlockDetailsZilliqaQuorumCertificates = ({ data }: Props) => {
  const quorumCertificate = data.zilliqa?.quorum_certificate;
  const aggregateQuorumCertificate = data.zilliqa?.aggregate_quorum_certificate;

  if (!quorumCertificate && !aggregateQuorumCertificate) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemDivider/>
      { quorumCertificate && <BlockDetailsZilliqaQuorumCertificate data={ quorumCertificate }/> }
      { aggregateQuorumCertificate && (
        <>
          <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 2 }}/>
          <BlockDetailsZilliqaQuorumCertificate data={ aggregateQuorumCertificate }/>
        </>
      ) }
    </>
  );
};

export default React.memo(BlockDetailsZilliqaQuorumCertificates);

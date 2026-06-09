// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import PageTitle from 'src/shell/page/title/PageTitle';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import { useMultichainContext } from 'src/features/multichain/context';
import Sol2UmlDiagram from 'src/features/sol2uml/components/Sol2UmlDiagram';

import ChainIcon from 'src/shared/external-chains/ChainIcon';

const Sol2Uml = () => {
  const router = useRouter();
  const multichainContext = useMultichainContext();

  const addressHash = router.query.address?.toString() || '';

  const chainInfo = multichainContext?.chain ? (
    <Flex display="inline-flex" alignItems="center">
      <span>on</span>
      <ChainIcon data={ multichainContext.chain } ml={ 1 } mr={ 2 }/>
      <span>{ multichainContext.chain.app_config.chain.name }</span>
    </Flex>
  ) : null;

  return (
    <>
      <PageTitle title="Solidity UML diagram"/>
      <Flex mb={ 10 } flexWrap="wrap" columnGap={ 1 }>
        <span>For contract</span>
        <AddressEntity
          address={{ hash: addressHash, is_contract: true }}
          noCopy
        />
        { chainInfo }
      </Flex>
      <Sol2UmlDiagram addressHash={ addressHash }/>
    </>
  );
};

export default Sol2Uml;

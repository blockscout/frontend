import { Box, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/client/contract';

import config from 'configs/app';

import ContractVerificationFormCodeSnippet from '../ContractVerificationFormCodeSnippet';
import ContractVerificationFormRow from '../ContractVerificationFormRow';
import ContractVerificationMethod from '../ContractVerificationMethod';

const ContractVerificationSolidityHardhat = ({ config: formConfig }: { config: SmartContractVerificationConfig }) => {
  const chainNameSlug = config.chain.name?.toLowerCase().split(' ').join('-');
  const { watch } = useFormContext<FormFields>();
  const address = watch('address');

  const latestSolidityVersion = formConfig.solidity_compiler_versions.find((version) => !version.includes('nightly'))?.split('+')[0];

  const firstCodeSnippet = `const config: HardhatUserConfig = {
  solidity: "${ latestSolidityVersion || '0.8.24' }", // replace if necessary
  networks: {
    '${ chainNameSlug }': {
      url: '${ config.chain.rpcUrl || `${ config.api.endpoint }/api/eth-rpc` }'
    },
  },
  etherscan: {
    apiKey: {
      '${ chainNameSlug }': 'empty'
    },
    customChains: [
      {
        network: "${ chainNameSlug }",
        chainId: ${ config.chain.id },
        urls: {
          apiURL: "${ config.api.endpoint }/api",
          browserURL: "${ config.app.baseUrl }"
        }
      }
    ]
  }
};`;

  const secondCodeSnippet = `npx hardhat verify \\
  --network ${ chainNameSlug } \\
  ${ address || '<address>' } \\
  [...constructorArgs]`;

  return (
    <ContractVerificationMethod title="Contract verification via Solidity Hardhat plugin">
      <ContractVerificationFormRow>
        <Flex flexDir="column" rowGap={ 3 }>
          <ContractVerificationFormCodeSnippet code={ firstCodeSnippet }/>
          <ContractVerificationFormCodeSnippet code={ secondCodeSnippet }/>
        </Flex>
        <Box whiteSpace="pre-wrap">
          <span>Full tutorial about contract verification via Hardhat on Blockscout is available </span>
          <Link href="https://docs.blockscout.com/for-users/verifying-a-smart-contract/hardhat-verification-plugin" target="_blank">
            here
          </Link>
        </Box>
      </ContractVerificationFormRow>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationSolidityHardhat);

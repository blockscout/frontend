import { Box, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import config from 'configs/app';

import ContractVerificationFormCodeSnippet from '../ContractVerificationFormCodeSnippet';
import ContractVerificationFormRow from '../ContractVerificationFormRow';
import ContractVerificationMethod from '../ContractVerificationMethod';

const ContractVerificationSolidityFoundry = () => {
  const { watch } = useFormContext<FormFields>();
  const address = watch('address');

  const codeSnippet = `forge verify-contract \\
  --rpc-url ${ config.chain.rpcUrl || `${ config.api.endpoint }/api/eth-rpc` } \\
  --verifier blockscout \\
  --verifier-url '${ config.api.endpoint }/api/' \\
  ${ address || '<address>' } \\
  [contractFile]:[contractName]`;

  return (
    <ContractVerificationMethod title="Contract verification via Foundry">
      <ContractVerificationFormRow>
        <Flex flexDir="column">
          <ContractVerificationFormCodeSnippet code={ codeSnippet }/>
        </Flex>
        <Box whiteSpace="pre-wrap">
          <span>Full tutorial about contract verification via Foundry on Blockscout is available </span>
          <Link href="https://docs.blockscout.com/for-users/verifying-a-smart-contract/foundry-verification" target="_blank">
            here
          </Link>
        </Box>
      </ContractVerificationFormRow>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationSolidityFoundry);

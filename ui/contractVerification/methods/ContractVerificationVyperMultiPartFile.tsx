import { Link } from '@chakra-ui/react';
import React from 'react';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldEvmVersion from '../fields/ContractVerificationFieldEvmVersion';
import ContractVerificationFieldSources from '../fields/ContractVerificationFieldSources';

const MAIN_SOURCES_TYPES = [ '.vy' as const ];
const INTERFACE_TYPES = [ '.vy' as const, '.json' as const ];

const ContractVerificationVyperMultiPartFile = () => {

  const interfacesHint = (
    <>
      <span>Add any </span>
      <Link href="https://docs.vyperlang.org/en/stable/interfaces.html" target="_blank">required interfaces</Link>
      <span> for the main compiled contract.</span>
    </>
  );

  return (
    <ContractVerificationMethod title="Contract verification via Vyper (multi-part files)">
      <ContractVerificationFieldCompiler isVyper/>
      <ContractVerificationFieldEvmVersion isVyper/>
      <ContractVerificationFieldSources
        name="sources"
        fileTypes={ MAIN_SOURCES_TYPES }
        title="Upload main *.vy source"
        hint={ `
          Primary compiled Vyper contract. 
          Only add the main contract here whose bytecode has been deployed, all other files can be uploaded to the interfaces box below.
        ` }
        required
      />
      <ContractVerificationFieldSources
        name="interfaces"
        fileTypes={ INTERFACE_TYPES }
        multiple
        title="Interfaces (.vy or .json)"
        hint={ interfacesHint }
      />
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationVyperMultiPartFile);

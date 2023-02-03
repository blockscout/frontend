import React from 'react';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldSources from '../fields/ContractVerificationFieldSources';

const FILE_TYPES = [ '.json' as const ];

const ContractVerificationSourcify = () => {
  return (
    <ContractVerificationMethod title="New Smart Contract Verification">
      <ContractVerificationFieldSources
        fileTypes={ FILE_TYPES }
        multiple
        title="Sources and Metadata JSON" mt={ 0 }
        hint="Upload all Solidity contract source files and JSON metadata file(s) created during contract compilation."
      />
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationSourcify);

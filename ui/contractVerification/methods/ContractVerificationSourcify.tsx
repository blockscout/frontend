import React from 'react';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldContractIndex from '../fields/ContractVerificationFieldContractIndex';
import ContractVerificationFieldSources from '../fields/ContractVerificationFieldSources';

const FILE_TYPES = [ '.json' as const, '.sol' as const ];

const ContractVerificationSourcify = () => {
  return (
    <ContractVerificationMethod title="Contract verification via Solidity (Sourcify)">
      <ContractVerificationFieldSources
        fileTypes={ FILE_TYPES }
        multiple
        required
        title="Sources and Metadata JSON"
        hint="Upload all Solidity contract source files and JSON metadata file(s) created during contract compilation."
      />
      <ContractVerificationFieldContractIndex/>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationSourcify);

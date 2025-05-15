import { Box } from '@chakra-ui/react';
import React from 'react';

import type { MarketplaceAppSecurityReport } from 'types/client/marketplace';
import { ContractListTypes } from 'types/client/marketplace';

import { DialogBody, DialogContent, DialogHeader, DialogRoot } from 'toolkit/chakra/dialog';
import { apos } from 'toolkit/utils/htmlEntities';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import ContractSecurityReport from './ContractSecurityReport';

type Props = {
  onClose: () => void;
  onBack?: () => void;
  type: ContractListTypes;
  contracts?: MarketplaceAppSecurityReport['contractsData'];
};

const titles = {
  [ContractListTypes.ALL]: `All app${ apos }s smart contracts`,
  [ContractListTypes.ANALYZED]: 'Analyzed contracts',
  [ContractListTypes.VERIFIED]: 'Verified contracts',
};

const ContractListModal = ({ onClose, onBack, type, contracts }: Props) => {
  const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (!open) {
      onClose();
    }
  }, [ onClose ]);

  const displayedContracts = React.useMemo(() => {
    if (!contracts) {
      return [];
    }
    switch (type) {
      default:
      case ContractListTypes.ALL:
        return contracts.sort((a) => a.isVerified ? -1 : 1);
      case ContractListTypes.ANALYZED:
        return contracts
          .filter((contract) => Boolean(contract.solidityScanReport))
          .sort((a, b) =>
            (parseFloat(b.solidityScanReport?.scan_summary.score_v2 ?? '0')) - (parseFloat(a.solidityScanReport?.scan_summary.score_v2 ?? '0')),
          );
      case ContractListTypes.VERIFIED:
        return contracts.filter((contract) => contract.isVerified);
    }
  }, [ contracts, type ]);

  if (!contracts) {
    return null;
  }

  return (
    <DialogRoot
      open={ Boolean(type) }
      onOpenChange={ handleOpenChange }
      size={{ lgDown: 'full', lg: 'md' }}
    >
      <DialogContent>
        <DialogHeader display="flex" alignItems="center" mb={ 4 } onBackToClick={ onBack }>
          { titles[type] }
        </DialogHeader>
        <DialogBody
          maxH={{ base: 'max-content', lg: '352px' }}
          overflow="scroll"
          mb={ 0 }
          display="grid"
          gridTemplateColumns="max-content 1fr"
          rowGap={ 2 }
          columnGap={ type === ContractListTypes.ANALYZED ? 4 : 0 }
        >
          { displayedContracts.map((contract) => (
            <React.Fragment key={ contract.address }>
              { type === ContractListTypes.ANALYZED && (
                <Box gridColumn={ 1 }>
                  <ContractSecurityReport securityReport={ contract.solidityScanReport }/>
                </Box>
              ) }
              <AddressEntity
                address={{
                  hash: contract.address,
                  name: contract.solidityScanReport?.contractname,
                  is_contract: true,
                  is_verified: contract.isVerified,
                }}
                noCopy
                gridColumn={ 2 }
                height="32px"
              />
            </React.Fragment>
          )) }
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default ContractListModal;

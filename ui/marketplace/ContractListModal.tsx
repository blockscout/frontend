import {
  Box, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalHeader, ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';

import { ContractListTypes } from 'types/client/marketplace';

import useIsMobile from 'lib/hooks/useIsMobile';
import { apos } from 'lib/html-entities';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import ContractSecurityReport from './ContractSecurityReport';

type Props = {
  onClose: () => void;
  type: ContractListTypes;
  contracts: Array<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const titles = {
  [ContractListTypes.ALL]: `All app${ apos }s smart contracts`,
  [ContractListTypes.ANALYZED]: 'Analyzed contracts',
  [ContractListTypes.VERIFIED]: 'Verified contracts',
};

const ContractListModal = ({ onClose, type, contracts }: Props) => {
  const isMobile = useIsMobile();

  const displayedContracts = React.useMemo(() => {
    switch (type) {
      default:
      case ContractListTypes.ALL:
        return contracts;
      case ContractListTypes.ANALYZED:
        return contracts
          .filter((contract) => Boolean(contract.solidityScanReport))
          .sort((a, b) => b.solidityScanReport.scan_summary.score_v2 - a.solidityScanReport.scan_summary.score_v2);
      case ContractListTypes.VERIFIED:
        return contracts.filter((contract) => contract.isVerified);
    }
  }, [ contracts, type ]);

  return (
    <Modal
      isOpen={ Boolean(type) }
      onClose={ onClose }
      size={ isMobile ? 'full' : 'md' }
      isCentered
    >
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader fontWeight="500" textStyle="h3" mb={ 4 }>{ titles[type] }</ModalHeader>
        <ModalCloseButton/>
        <ModalBody
          maxH={ isMobile ? 'auto' : '352px' }
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ContractListModal;

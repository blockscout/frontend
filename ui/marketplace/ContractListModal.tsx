import {
  Grid, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalHeader, ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';

import { ContractListTypes } from 'types/client/marketplace';

import useIsMobile from 'lib/hooks/useIsMobile';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import ContractSecurityReport from './ContractSecurityReport';

type Props = {
  onClose: () => void;
  type: ContractListTypes;
  contracts: Array<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

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
        <ModalHeader fontWeight="500" textStyle="h3" mb={ 4 }>Contracts</ModalHeader>
        <ModalCloseButton/>
        <ModalBody maxH="352px" overflow="scroll" mb={ 0 } display="flex" flexDirection="column" gap={ 2 }>
          { displayedContracts.map((contract) => (
            <Grid key={ contract.address } height={ 8 } alignItems="center" gap={ 6 } templateColumns="max-content 1fr">
              { type === ContractListTypes.ANALYZED && (
                <ContractSecurityReport securityReport={ contract.solidityScanReport }/>
              ) }
              <AddressEntity
                address={{
                  hash: contract.address,
                  name: contract.solidityScanReport?.contractname,
                  is_contract: true,
                  is_verified: contract.isVerified,
                }}
                noCopy
              />
            </Grid>
          )) }
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ContractListModal;

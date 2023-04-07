import { Td, Tr, Link, Flex, Image, Tooltip, IconButton, Icon, chakra } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfoApplication, VerifiedAddress } from 'types/api/account';

import editIcon from 'icons/edit.svg';
import AddressLink from 'ui/shared/address/AddressLink';
import AddressSnippet from 'ui/shared/AddressSnippet';
import TokenLogoPlaceholder from 'ui/shared/TokenLogoPlaceholder';

interface Props {
  item: VerifiedAddress;
  application: TokenInfoApplication | undefined;
  onAdd: (address: string) => void;
  onEdit: (address: string) => void;
}

const VerifiedAddressesTableItem = ({ item, application, onAdd, onEdit }: Props) => {

  const handleAddClick = React.useCallback(() => {
    onAdd(item.contractAddress);
  }, [ item, onAdd ]);

  const handleEditClick = React.useCallback(() => {
    onEdit(item.contractAddress);
  }, [ item, onEdit ]);

  const status = (() => {
    switch (application?.status) {
      case 'IN_PROCESS': {
        return <chakra.span fontWeight={ 500 }>In progress</chakra.span>;
      }
      case 'APPROVED': {
        return <chakra.span fontWeight={ 500 } color="green.500">Approved</chakra.span>;
      }
      case 'UPDATE_REQUIRED': {
        return <chakra.span fontWeight={ 500 } color="orange.500">Waiting for update</chakra.span>;
      }
      case 'REJECTED': {
        return <chakra.span fontWeight={ 500 } color="red.500">Rejected</chakra.span>;
      }

      default:
        return null;
    }
  })();

  return (
    <Tr>
      <Td>
        <AddressSnippet address={{ hash: item.contractAddress, is_contract: true, implementation_name: null }}/>
      </Td>
      <Td fontSize="sm">
        { application ? (
          <Flex alignItems="center" columnGap={ 2 } w="100%">
            <Image
              borderRadius="base"
              boxSize={ 6 }
              objectFit="cover"
              src={ application.iconUrl }
              alt="Token logo"
              fallback={ <TokenLogoPlaceholder boxSize={ 6 }/> }
            />
            <AddressLink
              hash={ application.tokenAddress }
              alias={ application.projectName }
              type="token"
              isDisabled={ application.status === 'IN_PROCESS' }
              fontWeight={ 500 }
            />
            <Tooltip label="Edit">
              <IconButton
                aria-label="edit"
                variant="simple"
                boxSize={ 5 }
                borderRadius="none"
                flexShrink={ 0 }
                onClick={ handleEditClick }
                icon={ <Icon as={ editIcon }/> }
              />
            </Tooltip>
          </Flex>
        ) : (
          <Link onClick={ handleAddClick }>Add details</Link>
        ) }
      </Td>
      <Td fontSize="sm">{ status }</Td>
      <Td fontSize="sm"></Td>
    </Tr>
  );
};

export default React.memo(VerifiedAddressesTableItem);

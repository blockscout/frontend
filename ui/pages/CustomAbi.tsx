import { Box, Button, HStack, Skeleton, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { CustomAbi } from 'types/api/account';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import CustomAbiModal from 'ui/customAbi/CustomAbiModal/CustomAbiModal';
import CustomAbiListItem from 'ui/customAbi/CustomAbiTable/CustomAbiListItem';
import CustomAbiTable from 'ui/customAbi/CustomAbiTable/CustomAbiTable';
import DeleteCustomAbiModal from 'ui/customAbi/DeleteCustomAbiModal';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import SkeletonListAccount from 'ui/shared/skeletons/SkeletonListAccount';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';

const CustomAbiPage: React.FC = () => {
  const customAbiModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();
  const isMobile = useIsMobile();
  useRedirectForInvalidAuthToken();

  const [ customAbiModalData, setCustomAbiModalData ] = useState<CustomAbi>();
  const [ deleteModalData, setDeleteModalData ] = useState<CustomAbi>();

  const { data, isLoading, isError } = useApiQuery('custom_abi');

  const onEditClick = useCallback((data: CustomAbi) => {
    setCustomAbiModalData(data);
    customAbiModalProps.onOpen();
  }, [ customAbiModalProps ]);

  const onCustomAbiModalClose = useCallback(() => {
    setCustomAbiModalData(undefined);
    customAbiModalProps.onClose();
  }, [ customAbiModalProps ]);

  const onDeleteClick = useCallback((data: CustomAbi) => {
    setDeleteModalData(data);
    deleteModalProps.onOpen();
  }, [ deleteModalProps ]);

  const onDeleteModalClose = useCallback(() => {
    setDeleteModalData(undefined);
    deleteModalProps.onClose();
  }, [ deleteModalProps ]);

  const description = (
    <AccountPageDescription>
      Add custom ABIs for any contract and access when logged into your account. Helpful for debugging, functional testing and contract interaction.
    </AccountPageDescription>
  );

  const content = (() => {
    if (isLoading && !data) {
      const loader = isMobile ? <SkeletonListAccount/> : (
        <>
          <SkeletonTable columns={ [ '100%', '108px' ] }/>
          <Skeleton height="44px" width="156px" marginTop={ 8 }/>
        </>
      );

      return (
        <>
          { description }
          { loader }
        </>
      );
    }

    if (isError) {
      return <DataFetchAlert/>;
    }

    const list = isMobile ? (
      <Box>
        { data.map((item) => (
          <CustomAbiListItem
            item={ item }
            key={ item.id }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
          />
        )) }
      </Box>
    ) : (
      <CustomAbiTable
        data={ data }
        onDeleteClick={ onDeleteClick }
        onEditClick={ onEditClick }
      />
    );

    return (
      <>
        { description }
        { data.length > 0 && list }
        <HStack marginTop={ 8 } spacing={ 5 }>
          <Button
            size="lg"
            onClick={ customAbiModalProps.onOpen }
          >
            Add custom ABI
          </Button>
        </HStack>
        <CustomAbiModal { ...customAbiModalProps } onClose={ onCustomAbiModalClose } data={ customAbiModalData }/>
        { deleteModalData && <DeleteCustomAbiModal { ...deleteModalProps } onClose={ onDeleteModalClose } data={ deleteModalData }/> }
      </>
    );
  })();

  return (
    <Page>
      <Box h="100%">
        <PageTitle text="Custom ABI"/>
        { content }
      </Box>
    </Page>
  );
};

export default CustomAbiPage;

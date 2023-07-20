import { Box, Button, Skeleton, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { PublicTag } from 'types/api/account';

import useApiQuery from 'lib/api/useApiQuery';
import { PUBLIC_TAG } from 'stubs/account';
import PublicTagListItem from 'ui/publicTags/PublicTagTable/PublicTagListItem';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import DeletePublicTagModal from './DeletePublicTagModal';
import PublicTagTable from './PublicTagTable/PublicTagTable';

type Props = {
  changeToFormScreen: (data?: PublicTag) => void;
  onTagDelete: () => void;
}

const PublicTagsData = ({ changeToFormScreen, onTagDelete }: Props) => {
  const deleteModalProps = useDisclosure();
  const [ deleteModalData, setDeleteModalData ] = useState<PublicTag>();

  const { data, isPlaceholderData, isError } = useApiQuery('public_tags', {
    queryOptions: {
      placeholderData: Array(3).fill(PUBLIC_TAG),
    },
  });

  const onDeleteModalClose = useCallback(() => {
    setDeleteModalData(undefined);
    deleteModalProps.onClose();
  }, [ deleteModalProps ]);

  const changeToForm = useCallback(() => {
    changeToFormScreen();
  }, [ changeToFormScreen ]);

  const onItemEditClick = useCallback((item: PublicTag) => {
    changeToFormScreen(item);
  }, [ changeToFormScreen ]);

  const onItemDeleteClick = useCallback((item: PublicTag) => {
    setDeleteModalData(item);
    deleteModalProps.onOpen();
  }, [ deleteModalProps ]);

  const description = (
    <AccountPageDescription>
      You can request a public category tag which is displayed to all Blockscout users.
      Public tags may be added to contract or external addresses, and any associated transactions will inherit that tag.
      Clicking a tag opens a page with related information and helps provide context and data organization.
      Requests are sent to a moderator for review and approval. This process can take several days.
    </AccountPageDescription>
  );

  if (isError) {
    return <DataFetchAlert/>;
  }

  const list = (
    <>
      <Box display={{ base: 'block', lg: 'none' }}>
        { data?.map((item, index) => (
          <PublicTagListItem
            key={ item.id + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
            onDeleteClick={ onItemDeleteClick }
            onEditClick={ onItemEditClick }
          />
        )) }
      </Box>
      <Box display={{ base: 'none', lg: 'block' }}>
        <PublicTagTable data={ data } isLoading={ isPlaceholderData } onEditClick={ onItemEditClick } onDeleteClick={ onItemDeleteClick }/>
      </Box>
    </>
  );

  return (
    <>
      { description }
      { Boolean(data?.length) && list }
      <Skeleton mt={ 8 } isLoaded={ !isPlaceholderData } display="inline-block">
        <Button
          size="lg"
          onClick={ changeToForm }
        >
            Request to add public tag
        </Button>
      </Skeleton>
      { deleteModalData && (
        <DeletePublicTagModal
          { ...deleteModalProps }
          onClose={ onDeleteModalClose }
          data={ deleteModalData }
          onDeleteSuccess={ onTagDelete }
        />
      ) }
    </>
  );
};

export default PublicTagsData;

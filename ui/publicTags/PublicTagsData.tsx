import { Box, Text, Button, Skeleton, useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { PublicTags, PublicTag } from 'types/api/account';

import fetch from 'lib/client/fetch';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import SkeletonTable from 'ui/shared/SkeletonTable';

import DeletePublicTagModal from './DeletePublicTagModal';
import PublicTagTable from './PublicTagTable/PublicTagTable';

type Props = {
  changeToFormScreen: (data?: PublicTag) => void;
  onTagDelete: () => void;
}

const PublicTagsData = ({ changeToFormScreen, onTagDelete }: Props) => {
  const deleteModalProps = useDisclosure();
  const [ deleteModalData, setDeleteModalData ] = useState<PublicTag>();

  const { data, isLoading, isError } = useQuery<unknown, unknown, PublicTags>([ 'public-tags' ], async() => await fetch('/api/account/public-tags'));

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
    <Text marginBottom={ 12 }>
      You can request a public category tag which is displayed to all Blockscout users.
      Public tags may be added to contract or external addresses, and any associated transactions will inherit that tag.
      Clicking a tag opens a page with related information and helps provide context and data organization.
      Requests are sent to a moderator for review and approval. This process can take several days.
    </Text>
  );

  if (isLoading) {
    return (
      <>
        { description }
        <SkeletonTable columns={ [ '50%', '25%', '25%', '108px' ] }/>
        <Skeleton height="48px" width="270px" marginTop={ 8 }/>
      </>
    );
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  return (
    <>
      { description }
      { data.length > 0 && <PublicTagTable data={ data } onEditClick={ onItemEditClick } onDeleteClick={ onItemDeleteClick }/> }
      <Box marginTop={ 8 }>
        <Button
          variant="primary"
          size="lg"
          onClick={ changeToForm }
        >
            Request to add public tag
        </Button>
      </Box>
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

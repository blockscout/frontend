import { Box, Text, Button, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { TPublicTagItem, TPublicTag } from 'data/publicTags';
import { publicTags } from 'data/publicTags';
import PublicTagTable from './PublicTagTable/PublicTagTable';
import DeletePublicTagModal from './DeletePublicTagModal'

type Props = {
  changeToFormScreen: (data?: TPublicTagItem) => void;
  onTagDelete: () => void;
}

const PublicTagsData = ({ changeToFormScreen, onTagDelete }: Props) => {
  const deleteModalProps = useDisclosure();
  const [ deleteModalData, setDeleteModalData ] = useState<Array<TPublicTag>>([]);

  const onDeleteModalClose = useCallback(() => {
    setDeleteModalData([]);
    deleteModalProps.onClose();
  }, [ deleteModalProps ]);

  const changeToForm = useCallback(() => {
    changeToFormScreen();
  }, [ changeToFormScreen ]);

  const onItemEditClick = useCallback((item: TPublicTagItem) => {
    changeToFormScreen(item);
  }, [ changeToFormScreen ])

  const onItemDeleteClick = useCallback((item: TPublicTagItem) => {
    setDeleteModalData(item.tags);
    deleteModalProps.onOpen();
  }, [ deleteModalProps ]);

  return (
    <>
      <Text marginBottom={ 12 }>
        You can request a public category tag which is displayed to all Blockscout users.
        Public tags may be added to contract or external addresses, and any associated transactions will inherit that tag.
        Clicking a tag opens a page with related information and helps provide context and data organization.
        Requests are sent to a moderator for review and approval. This process can take several days.
      </Text>
      <PublicTagTable data={ publicTags } onEditClick={ onItemEditClick } onDeleteClick={ onItemDeleteClick }/>
      <Box marginTop={ 8 }>
        <Button
          variant="primary"
          size="lg"
          onClick={ changeToForm }
        >
            Request to add public tag
        </Button>
      </Box>
      <DeletePublicTagModal
        { ...deleteModalProps }
        onClose={ onDeleteModalClose }
        tags={ deleteModalData }
        onDeleteSuccess={ onTagDelete }
      />
    </>
  )
}

export default PublicTagsData;

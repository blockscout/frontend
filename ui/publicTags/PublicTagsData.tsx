import { Box, Button, Skeleton, useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { PublicTags, PublicTag } from 'types/api/account';
import { QueryKeys } from 'types/client/accountQueries';

import useFetch from 'lib/hooks/useFetch';
import useIsMobile from 'lib/hooks/useIsMobile';
import PublicTagListItem from 'ui/publicTags/PublicTagTable/PublicTagListItem';
import AccountPageDescription from 'ui/shared/AccountPageDescription';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import SkeletonAccountMobile from 'ui/shared/SkeletonAccountMobile';
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
  const isMobile = useIsMobile();
  const fetch = useFetch();

  const { data, isLoading, isError } = useQuery<unknown, unknown, PublicTags>([ QueryKeys.publicTags ], async() => await fetch('/api/account/public-tags'));

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

  if (isLoading) {
    const loader = isMobile ? <SkeletonAccountMobile/> : (
      <>
        <SkeletonTable columns={ [ '50%', '25%', '25%', '108px' ] }/>
        <Skeleton height="48px" width="270px" marginTop={ 8 }/>
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
        <PublicTagListItem
          item={ item }
          key={ item.id }
          onDeleteClick={ onItemDeleteClick }
          onEditClick={ onItemEditClick }
        />
      )) }
    </Box>
  ) : (
    <PublicTagTable data={ data } onEditClick={ onItemEditClick } onDeleteClick={ onItemDeleteClick }/>
  );

  return (
    <>
      { description }
      { data.length > 0 && list }
      <Box marginTop={ 8 }>
        <Button
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

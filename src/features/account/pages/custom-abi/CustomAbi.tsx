// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { CustomAbi } from 'src/features/account/types/api';

import useApiQuery from 'src/api/hooks/useApiQuery';

import PageTitle from 'src/shell/page/title/PageTitle';

import AccountPageDescription from 'src/features/account/components/AccountPageDescription';
import useRedirectForInvalidAuthToken from 'src/features/account/hooks/useRedirectForInvalidAuthToken';
import { CUSTOM_ABI } from 'src/features/account/stubs';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';

import { Button } from 'src/toolkit/chakra/button';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { useDisclosure } from 'src/toolkit/hooks/useDisclosure';

import CustomAbiModal from './CustomAbiModal/CustomAbiModal';
import CustomAbiListItem from './CustomAbiTable/CustomAbiListItem';
import CustomAbiTable from './CustomAbiTable/CustomAbiTable';
import DeleteCustomAbiModal from './DeleteCustomAbiModal';

const CustomAbiPage: React.FC = () => {
  const customAbiModalProps = useDisclosure();
  const deleteModalProps = useDisclosure();
  useRedirectForInvalidAuthToken();

  const [ customAbiModalData, setCustomAbiModalData ] = useState<CustomAbi>();
  const [ deleteModalData, setDeleteModalData ] = useState<CustomAbi>();

  const { data, isPlaceholderData, isError } = useApiQuery('core:custom_abi', {
    queryOptions: {
      placeholderData: Array(3).fill(CUSTOM_ABI),
    },
  });

  const onEditClick = useCallback((data: CustomAbi) => {
    setCustomAbiModalData(data);
    customAbiModalProps.onOpen();
  }, [ customAbiModalProps ]);

  const onCustomAbiModalOpenChange = useCallback(({ open }: { open: boolean }) => {
    !open && setCustomAbiModalData(undefined);
    customAbiModalProps.onOpenChange({ open });
  }, [ customAbiModalProps ]);

  const onDeleteClick = useCallback((data: CustomAbi) => {
    setDeleteModalData(data);
    deleteModalProps.onOpen();
  }, [ deleteModalProps ]);

  const onDeleteModalOpenChange = useCallback(({ open }: { open: boolean }) => {
    !open && setDeleteModalData(undefined);
    deleteModalProps.onOpenChange({ open });
  }, [ deleteModalProps ]);

  const description = (
    <AccountPageDescription>
      Add custom ABIs for any contract and access when logged into your account. Helpful for debugging, functional testing and contract interaction.
    </AccountPageDescription>
  );

  const content = (() => {
    if (isError) {
      return <ApiFetchAlert/>;
    }

    const list = (
      <>
        <Box display={{ base: 'block', lg: 'none' }}>
          { data?.map((item, index) => (
            <CustomAbiListItem
              key={ item.id + (isPlaceholderData ? String(index) : '') }
              item={ item }
              isLoading={ isPlaceholderData }
              onDeleteClick={ onDeleteClick }
              onEditClick={ onEditClick }
            />
          )) }
        </Box>
        <Box display={{ base: 'none', lg: 'block' }}>
          <CustomAbiTable
            data={ data }
            isLoading={ isPlaceholderData }
            onDeleteClick={ onDeleteClick }
            onEditClick={ onEditClick }
          />
        </Box>
      </>
    );

    return (
      <>
        { description }
        { Boolean(data?.length) && list }
        <Skeleton mt={ 8 } loading={ isPlaceholderData } display="inline-block">
          <Button
            onClick={ customAbiModalProps.onOpen }
          >
            Add custom ABI
          </Button>
        </Skeleton>
        <CustomAbiModal open={ customAbiModalProps.open } onOpenChange={ onCustomAbiModalOpenChange } data={ customAbiModalData }/>
        { deleteModalData && <DeleteCustomAbiModal open={ deleteModalProps.open } onOpenChange={ onDeleteModalOpenChange } data={ deleteModalData }/> }
      </>
    );
  })();

  return (
    <>
      <PageTitle title="Custom ABI"/>
      { content }
    </>
  );
};

export default CustomAbiPage;

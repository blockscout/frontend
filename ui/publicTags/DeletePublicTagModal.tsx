import { Box, Text, FormControl, FormLabel, Textarea, useColorModeValue } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import type { ChangeEvent } from 'react';

import type { PublicTags, PublicTag } from 'types/api/account';

import { resourceKey } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import DeleteModal from 'ui/shared/DeleteModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: PublicTag;
  onDeleteSuccess: () => void;
}

const DeletePublicTagModal: React.FC<Props> = ({ isOpen, onClose, data, onDeleteSuccess }) => {

  const [ reason, setReason ] = useState<string>('');

  const tags = data.tags.split(';');

  const queryClient = useQueryClient();
  const apiFetch = useApiFetch();
  const formBackgroundColor = useColorModeValue('white', 'gray.900');

  const deleteApiKey = useCallback(() => {
    const body = { remove_reason: reason };
    return apiFetch('public_tags', {
      pathParams: { id: String(data.id) },
      fetchParams: { method: 'DELETE', body },
    });
  }, [ data.id, apiFetch, reason ]);

  const onSuccess = useCallback(async() => {
    onDeleteSuccess();
    queryClient.setQueryData([ resourceKey('public_tags') ], (prevData: PublicTags | undefined) => {
      return prevData?.filter((item) => item.id !== data.id);
    });
  }, [ queryClient, data, onDeleteSuccess ]);

  const onFieldChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setReason(event.currentTarget.value);
  }, []);

  const renderContent = useCallback(() => {
    let text;
    if (tags.length === 1) {
      text = (
        <>
          <Text display="inline" as="span">Public tag</Text>
          <Text fontWeight="700" whiteSpace="pre" as="span">{ ` "${ tags[0] }" ` }</Text>
          <Text as="span">will be removed.</Text>
        </>
      );
    }
    if (tags.length > 1) {
      const tagsText: Array<JSX.Element | string> = [];
      tags.forEach((tag, index) => {
        if (index < tags.length - 2) {
          tagsText.push(<Text fontWeight="700" whiteSpace="pre" as="span">{ ` "${ tag }"` }</Text>);
          tagsText.push(',');
        }
        if (index === tags.length - 2) {
          tagsText.push(<Text fontWeight="700" whiteSpace="pre" as="span">{ ` "${ tag }" ` }</Text>);
          tagsText.push('and');
        }
        if (index === tags.length - 1) {
          tagsText.push(<Text fontWeight="700" whiteSpace="pre" as="span">{ ` "${ tag }" ` }</Text>);
        }
      });
      text = (
        <>
          <Text as="span">Public tags</Text>{ tagsText }<Text as="span">will be removed.</Text>
        </>
      );
    }
    return (
      <>
        <Box marginBottom={ 8 }>
          { text }
        </Box>
        <FormControl variant="floating" id="tag-delete" backgroundColor={ formBackgroundColor }>
          <Textarea
            size="lg"
            value={ reason }
            onChange={ onFieldChange }
          />
          <FormLabel>Why do you want to remove tags?</FormLabel>
        </FormControl>
      </>
    );
  }, [ tags, reason, onFieldChange, formBackgroundColor ]);

  return (
    <DeleteModal
      isOpen={ isOpen }
      onClose={ onClose }
      title="Request to remove a public tag"
      renderContent={ renderContent }
      mutationFn={ deleteApiKey }
      onSuccess={ onSuccess }
    />
  );
};

export default React.memo(DeletePublicTagModal);

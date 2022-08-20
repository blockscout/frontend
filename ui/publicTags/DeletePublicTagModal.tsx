import { Flex, Text, FormControl, FormLabel, Textarea } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import type { ChangeEvent } from 'react';

import type { PublicTag } from 'types/api/account';

import DeleteModal from 'ui/shared/DeleteModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: PublicTag;
  onDeleteSuccess: () => void;
}

const DeletePublicTagModal: React.FC<Props> = ({ isOpen, onClose, data, onDeleteSuccess }) => {

  const tags = data.tags.split(';');

  const onDelete = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('delete', data);
    onDeleteSuccess();
  }, [ data, onDeleteSuccess ]);

  const [ reason, setReason ] = useState<string>('');

  const onFieldChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setReason(event.currentTarget.value);
  }, []);

  const renderContent = useCallback(() => {
    let text;
    if (tags.length === 1) {
      text = (
        <>
          <Text display="flex">Public tag</Text>
          <Text fontWeight="600" whiteSpace="pre">{ ` "${ tags[0] }" ` }</Text>
          <Text>will be removed.</Text>
        </>
      );
    }
    if (tags.length > 1) {
      const tagsText: Array<JSX.Element | string> = [];
      tags.forEach((tag, index) => {
        if (index < tags.length - 2) {
          tagsText.push(<Text fontWeight="600" whiteSpace="pre">{ ` "${ tag }"` }</Text>);
          tagsText.push(',');
        }
        if (index === tags.length - 2) {
          tagsText.push(<Text fontWeight="600" whiteSpace="pre">{ ` "${ tag }" ` }</Text>);
          tagsText.push('and');
        }
        if (index === tags.length - 1) {
          tagsText.push(<Text fontWeight="600" whiteSpace="pre">{ ` "${ tag }" ` }</Text>);
        }
      });
      text = (
        <>
          <Text>Public tags</Text>{ tagsText }<Text>will be removed.</Text>
        </>
      );
    }
    return (
      <>
        <Flex marginBottom={ 12 }>
          { text }
        </Flex>
        <FormControl variant="floating" id="tag-delete">
          <Textarea
            size="lg"
            value={ reason }
            onChange={ onFieldChange }
          />
          <FormLabel>Why do you want to remove tags?</FormLabel>
        </FormControl>
      </>
    );
  }, [ tags, reason, onFieldChange ]);

  return (
    <DeleteModal
      isOpen={ isOpen }
      onClose={ onClose }
      onDelete={ onDelete }
      title="Request to remove a public tag"
      renderContent={ renderContent }
    />
  );
};

export default React.memo(DeletePublicTagModal);

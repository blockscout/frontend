import { Button, Checkbox, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea } from '@chakra-ui/react';
import type { PropsWithChildren, ReactNode } from 'react';
import React, { useCallback, useState } from 'react';

import ForumPersonalApi from 'lib/api/ylideApi/ForumPersonalApi';
import { useYlide } from 'lib/contexts/ylide';

interface ActionModalProps extends PropsWithChildren<NonNullable<unknown>> {
  title?: ReactNode;
  buttons?: ReactNode;
  onClose: () => void;
}

function ActionModal({ children, title, buttons, onClose }: ActionModalProps) {
  return (
    <Modal isOpen={ true } onClose={ onClose }>
      <ModalOverlay/>
      <ModalContent w={ 420 }>
        { title != null && <ModalHeader mb={ 2 }>{ title }</ModalHeader> }
        <ModalCloseButton top={ 1 } right={ 1 }/>
        { children != null && <ModalBody>{ children }</ModalBody> }
        { buttons != null && <ModalFooter gap={ 4 } flexDir="column" alignItems="stretch">{ buttons }</ModalFooter> }
      </ModalContent>
    </Modal>
  );
}

export interface CreateTopicModalProps {
  onClose: () => void;
}

export function CreateTopicModal({
  onClose,
}: CreateTopicModalProps): JSX.Element {
  const { accounts: { admins } } = useYlide();
  const [ topic, setTopic ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ adminOnly, setAdminOnly ] = useState(false);
  const createTopic = ForumPersonalApi.useCreateTopic((admins.length && admins[0].backendAuthKey) || '');

  const handleTopicChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  }, []);

  const handleAdminOnlyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminOnly(e.target.checked);
  }, []);

  const handleCreate = useCallback(async() => {
    await createTopic({
      title: topic,
      description,
      adminOnly,
    });
    onClose();
  }, [ onClose, createTopic, topic, description, adminOnly ]);

  const handleClose = useCallback(() => {
    onClose();
  }, [ onClose ]);

  return (
    <ActionModal
      title="Create topic"
      buttons={ (
        <>
          <Button onClick={ handleCreate }>Create</Button>
          <Button onClick={ handleClose } variant="outline">Cancel</Button>
        </>
      ) }
      onClose={ handleClose }
    >
      <Input placeholder="Topic name" mb={ 4 } value={ topic } onChange={ handleTopicChange }/>
      <Textarea placeholder="Topic description" mb={ 4 } value={ description } onChange={ handleDescriptionChange }/>
      <Checkbox isChecked={ adminOnly } onChange={ handleAdminOnlyChange }>Only admin can create threads</Checkbox>
    </ActionModal>
  );
}

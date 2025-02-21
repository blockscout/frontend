import {
  chakra,
  // Modal,
  // ModalContent,
  // ModalCloseButton,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  Flex,
  // useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

import type { InteropMessage } from 'types/api/interop';

import AdditionalInfoButton from 'ui/shared/AdditionalInfoButton';
import Popover from 'ui/shared/chakra/Popover';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

type Props = {
  payload: InteropMessage['payload'];
  // isMobile?: boolean;
  isLoading?: boolean;
  className?: string;
};

const InteropMessageAdditionalInfo = ({ payload, isLoading, className }: Props) => {
  // const InteropMessageAdditionalInfo = ({ payload, isMobile, isLoading, className }: Props) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();

  // const content = (
  //   <>
  //     <Text>Message payload</Text>
  //     <Text>
  //       { payload }
  //     </Text>
  //   </>
  // );

  // if (isMobile) {
  //   return (
  //     <>
  //       <AdditionalInfoButton onClick={ onOpen } isLoading={ isLoading } className={ className }/>
  //       <Modal isOpen={ isOpen } onClose={ onClose } size="full">
  //         <ModalContent paddingTop={ 4 }>
  //           <ModalCloseButton/>
  //           { content }
  //         </ModalContent>
  //       </Modal>
  //     </>
  //   );
  // }
  return (
    <Popover placement="right-start" openDelay={ 300 } isLazy>
      { ({ isOpen }) => (
        <>
          <PopoverTrigger>
            <AdditionalInfoButton isOpen={ isOpen } isLoading={ isLoading } className={ className }/>
          </PopoverTrigger>
          <PopoverContent border="1px solid" borderColor="divider">
            <PopoverBody fontWeight={ 400 } fontSize="sm">
              <Flex alignItems="center" justifyContent="space-between" mb={ 3 }>
                <Text color="text_secondary" fontWeight="600">Message payload</Text>
                <CopyToClipboard text={ payload }/>
              </Flex>
              <Text>
                { payload }
              </Text>
            </PopoverBody>
          </PopoverContent>
        </>
      ) }
    </Popover>
  );
};

export default React.memo(chakra(InteropMessageAdditionalInfo));

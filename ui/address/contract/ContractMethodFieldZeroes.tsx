import {
  chakra,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  IconButton,
  Button,
  List,
  ListItem,
  Icon,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

import iconEastMini from 'icons/arrows/east-mini.svg';
import iconCheck from 'icons/check.svg';
import { times } from 'lib/html-entities';

const ContractMethodFieldZeroes = () => {
  const [ selectedOption, setSelectedOption ] = React.useState<number>();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const handleOptionClick = React.useCallback((event: React.MouseEvent) => {
    const id = Number((event.currentTarget as HTMLDivElement).getAttribute('data-id'));
    if (!Object.is(id, NaN)) {
      setSelectedOption((prev) => prev === id ? undefined : id);
      onClose();
    }
  }, [ onClose ]);

  return (
    <>
      { selectedOption && (
        <Button
          px={ 1 }
          lineHeight={ 6 }
          h={ 6 }
          fontWeight={ 500 }
          ml={ 1 }
          variant="subtle"
          colorScheme="gray"
          display="inline"
          _hover={{ color: 'inherit' }}
          cursor="default"
        >
          { times }
          <chakra.span>10</chakra.span>
          <chakra.span fontSize="xs" lineHeight={ 4 } verticalAlign="super">{ selectedOption }</chakra.span>
        </Button>
      ) }
      <Popover placement="bottom-end" isLazy isOpen={ isOpen } onClose={ onClose }>
        <PopoverTrigger>
          <div>
            <IconButton
              transform={ isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' }
              transitionDuration="none"
              variant="subtle"
              colorScheme="gray"
              as={ iconEastMini }
              boxSize={ 6 }
              aria-label="Open menu"
              cursor="pointer"
              ml={ 1 }
              onClick={ onToggle }
            />
          </div>
        </PopoverTrigger>
        <Portal>
          <PopoverContent w="110px">
            <PopoverBody py={ 2 }>
              <List>
                { [ 8, 12, 16, 18, 20 ].map((id) => (
                  <ListItem
                    key={ id }
                    py={ 2 }
                    data-id={ id }
                    onClick={ handleOptionClick }
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    cursor="pointer"
                  >
                    <span>10*{ id }</span>
                    { selectedOption === id && <Icon as={ iconCheck } boxSize={ 6 } color="blue.600"/> }
                  </ListItem>
                )) }
              </List>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </>
  );
};

export default React.memo(ContractMethodFieldZeroes);

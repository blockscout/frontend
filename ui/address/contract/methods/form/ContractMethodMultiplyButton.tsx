import {
  chakra,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Button,
  List,
  ListItem,
  useDisclosure,
  Input,
} from '@chakra-ui/react';
import React from 'react';

import { times } from 'lib/html-entities';
import Popover from 'ui/shared/chakra/Popover';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  onClick: (power: number) => void;
  isDisabled?: boolean;
}

const ContractMethodMultiplyButton = ({ onClick, isDisabled }: Props) => {
  const [ selectedOption, setSelectedOption ] = React.useState<number | undefined>(18);
  const [ customValue, setCustomValue ] = React.useState<number>();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const handleOptionClick = React.useCallback((event: React.MouseEvent) => {
    const id = Number((event.currentTarget as HTMLDivElement).getAttribute('data-id'));
    if (!Object.is(id, NaN)) {
      setSelectedOption((prev) => prev === id ? undefined : id);
      setCustomValue(undefined);
      onClose();
    }
  }, [ onClose ]);

  const handleInputChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomValue(Number(event.target.value));
    setSelectedOption(undefined);
  }, []);

  const value = selectedOption || customValue;

  const handleButtonClick = React.useCallback(() => {
    value && onClick(value);
  }, [ onClick, value ]);

  return (
    <>
      { Boolean(value) && (
        <Button
          px={ 1 }
          lineHeight={ 6 }
          h={ 6 }
          fontWeight={ 500 }
          ml={ 1 }
          variant="subtle"
          colorScheme="gray"
          display="inline"
          onClick={ handleButtonClick }
          isDisabled={ isDisabled }
        >
          { times }
          <chakra.span>10</chakra.span>
          <chakra.span fontSize="xs" lineHeight={ 4 } verticalAlign="super">{ value }</chakra.span>
        </Button>
      ) }
      <Popover placement="bottom-end" isLazy isOpen={ isOpen } onClose={ onClose }>
        <PopoverTrigger>
          <Button
            variant="subtle"
            colorScheme="gray"
            size="xs"
            cursor="pointer"
            ml={ 1 }
            p={ 0 }
            onClick={ onToggle }
            isActive={ isOpen }
            isDisabled={ isDisabled }
          >
            <IconSvg
              name="arrows/east-mini"
              transitionDuration="fast"
              transitionProperty="transform"
              transitionTimingFunction="ease-in-out"
              transform={ isOpen ? 'rotate(90deg)' : 'rotate(-90deg)' }
              boxSize={ 6 }
            />
          </Button>
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
                    { selectedOption === id && <IconSvg name="check" boxSize={ 6 } color="blue.600"/> }
                  </ListItem>
                )) }
                <ListItem
                  py={ 2 }
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <span>10*</span>
                  <Input
                    type="number"
                    min={ 0 }
                    max={ 100 }
                    ml={ 3 }
                    size="xs"
                    onChange={ handleInputChange }
                    value={ customValue || '' }
                  />
                </ListItem>
              </List>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </>
  );
};

export default React.memo(ContractMethodMultiplyButton);

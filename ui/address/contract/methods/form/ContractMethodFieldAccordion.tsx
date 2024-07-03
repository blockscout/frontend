import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import ContractMethodArrayButton from './ContractMethodArrayButton';

export interface Props {
  label: string;
  level: number;
  children: React.ReactNode;
  onAddClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onRemoveClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  index?: number;
  isInvalid?: boolean;
}

const ContractMethodFieldAccordion = ({ label, level, children, onAddClick, onRemoveClick, index, isInvalid }: Props) => {
  const bgColorLevel0 = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const bgColor = useColorModeValue('whiteAlpha.700', 'blackAlpha.700');

  return (
    <Accordion allowToggle w="100%" bgColor={ level === 0 ? bgColorLevel0 : bgColor } borderRadius="base">
      <AccordionItem _first={{ borderTopWidth: 0 }} _last={{ borderBottomWidth: 0 }}>
        { ({ isExpanded }) => (
          <>
            <AccordionButton
              as="div"
              cursor="pointer"
              px="6px"
              py="6px"
              wordBreak="break-all"
              textAlign="left"
              _hover={{ bgColor: 'inherit' }}
            >
              <AccordionIcon transform={ isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' } color="gray.500"/>
              <Box fontSize="sm" lineHeight={ 5 } fontWeight={ 700 } mr="auto" ml={ 1 } color={ isInvalid ? 'error' : undefined }>
                { label }
              </Box>
              { onRemoveClick && <ContractMethodArrayButton index={ index } onClick={ onRemoveClick } type="remove"/> }
              { onAddClick && <ContractMethodArrayButton index={ index } onClick={ onAddClick } type="add" ml={ 2 }/> }
            </AccordionButton>
            <AccordionPanel display="flex" flexDir="column" rowGap={ 1 } pl="18px" pr="6px">
              { children }
            </AccordionPanel>
          </>
        ) }
      </AccordionItem>
    </Accordion>
  );
};

export default React.memo(ContractMethodFieldAccordion);

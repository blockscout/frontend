import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { SmartContractMethodInput } from 'types/api/contract';

import { ARRAY_REGEXP } from '../utils';
import ContractMethodFieldInput from './ContractMethodFieldInput';
import ContractMethodFieldInputArray from './ContractMethodFieldInputArray';

interface Props {
  data: SmartContractMethodInput;
  hideLabel?: boolean; // TODO @tom2drum - remove this prop
  basePath: string;
  level: number;
}

const ContractMethodFieldInputTuple = ({ data, hideLabel, basePath, level }: Props) => {
  const bgColorLevel0 = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const bgColor = useColorModeValue('whiteAlpha.700', 'blackAlpha.700');

  return (
    <Accordion allowToggle w="100%" bgColor={ level === 0 ? bgColorLevel0 : bgColor } borderRadius="base">
      <AccordionItem _first={{ borderTopWidth: 0 }} _last={{ borderBottomWidth: 0 }}>
        <AccordionButton
          px="6px"
          py="6px"
          wordBreak="break-all"
          textAlign="left"
          _hover={{ bgColor: 'inherit' }}
        >
          <AccordionIcon mr={ 1 }/>
          <Box fontSize="sm" lineHeight={ 5 } fontWeight={ 700 }>
            { !hideLabel && <span>{ data.name || '<arg w/o name>' } </span> }
            <span>({ data.type })</span>
            <span> level: { level }</span>
          </Box>
        </AccordionButton>
        <AccordionPanel display="flex" flexDir="column" rowGap={ 3 } pl="18px" pr="6px">
          { data.components?.map((component, index) => {
            if (component.components && component.type === 'tuple') {
              return <ContractMethodFieldInputTuple key={ index } data={ component } basePath={ `${ basePath }:${ index }` } level={ level + 1 }/>;
            }

            const arrayMatch = component.type.match(ARRAY_REGEXP);
            if (arrayMatch) {
              return <ContractMethodFieldInputArray key={ index } data={ component } basePath={ `${ basePath }:${ index }` } level={ level + 1 }/>;
            }

            return <ContractMethodFieldInput key={ index } data={ component } path={ `${ basePath }:${ index }` }/>;
          }) }
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ContractMethodFieldInputTuple;

import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react';
import React from 'react';

import type { SmartContractMethodInput } from 'types/api/contract';

import { ARRAY_REGEXP } from '../utils';
import ContractMethodFieldInput from './ContractMethodFieldInput';
import ContractMethodFieldInputArray from './ContractMethodFieldInputArray';

interface Props {
  data: SmartContractMethodInput;
  hideLabel?: boolean;
}

const ContractMethodFieldInputTuple = ({ data, hideLabel }: Props) => {
  return (
    <Accordion allowToggle outline="1px dashed lightpink" w="100%">
      <AccordionItem _first={{ borderTopWidth: 0 }} _last={{ borderBottomWidth: 0 }}>
        <AccordionButton px={ 0 } py={ 3 } _hover={{ bgColor: 'inherit' }} wordBreak="break-all" textAlign="left">
          <Box fontSize="sm" mr={ 1 }>
            { !hideLabel && <span>{ data.name || '<arg w/o name>' } </span> }
            <span>({ data.type })</span>
          </Box>
          <AccordionIcon/>
        </AccordionButton>
        <AccordionPanel display="flex" flexDir="column" rowGap={ 3 }>
          { data.components?.map((component, index) => {
            if (component.components && component.type === 'tuple') {
              return <ContractMethodFieldInputTuple key={ index } data={ component }/>;
            }

            const arrayMatch = component.type.match(ARRAY_REGEXP);
            if (arrayMatch) {
              return <ContractMethodFieldInputArray key={ index } data={ component }/>;
            }

            return <ContractMethodFieldInput key={ index } data={ component }/>;
          }) }
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ContractMethodFieldInputTuple;

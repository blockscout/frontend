import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Alert, Box, Tag } from '@chakra-ui/react';
import React from 'react';
import { Element } from 'react-scroll';

import type { FormSubmitHandler, SmartContractMethod } from './types';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import Hint from 'ui/shared/Hint';

import ContractMethodForm from './form/ContractMethodForm';
import { getElementId, getElementName } from './useScrollToMethod';
import { isReadMethod } from './utils';

interface Props {
  data: SmartContractMethod;
  index: number;
  id: number;
  addressHash: string;
  sourceAddress?: string;
  tab: string;
  onSubmit: FormSubmitHandler;
  isVisible?: boolean;
}

const ContractAbiItem = ({ data, index, id, addressHash, sourceAddress, tab, onSubmit, isVisible = true }: Props) => {
  const [ attempt, setAttempt ] = React.useState(0);

  const url = React.useMemo(() => {
    return config.app.baseUrl + route({
      pathname: '/address/[hash]',
      query: {
        hash: addressHash ?? '',
        tab,
        ...(sourceAddress ? { source_address: sourceAddress } : {}),
      },
      hash: getElementId(data),
    });
  }, [ addressHash, data, tab, sourceAddress ]);

  const handleReset = React.useCallback(() => {
    setAttempt((prev) => prev + 1);
  }, []);

  const isRead = isReadMethod(data);

  return (
    <AccordionItem as="section" _first={{ borderTopWidth: 0 }} _last={{ borderBottomWidth: 0 }} display={ isVisible ? 'block' : 'none' }>
      { ({ isExpanded }) => (
        <>
          <Element as="h2" name={ getElementName(data) }>
            <AccordionButton
              px={ 0 }
              py={ 3 }
              _hover={{ bgColor: 'inherit' }}
              wordBreak="break-all"
              textAlign="left"
              as="div"
              cursor="pointer"
              display="flex"
              alignItems="center"
              columnGap={ 2 }
            >
              <CopyToClipboard text={ url } type="link" ml={ 0 } color="text_secondary"/>
              <Box as="div" fontWeight={ 500 } display="flex" alignItems="center">
                { index + 1 }. { data.type === 'fallback' || data.type === 'receive' ? data.type : data.name }
                { data.type === 'fallback' && (
                  <Hint
                    label={
                      `The fallback function is executed on a call to the contract if none of the other functions match 
                    the given function signature, or if no data was supplied at all and there is no receive Ether function. 
                    The fallback function always receives data, but in order to also receive Ether it must be marked payable.`
                    }
                    ml={ 1 }
                  />
                ) }
                { data.type === 'receive' && (
                  <Hint
                    label={
                      `The receive function is executed on a call to the contract with empty calldata. 
                    This is the function that is executed on plain Ether transfers (e.g. via .send() or .transfer()). 
                    If no such function exists, but a payable fallback function exists, the fallback function will be called on a plain Ether transfer. 
                    If neither a receive Ether nor a payable fallback function is present, 
                    the contract cannot receive Ether through regular transactions and throws an exception.`
                    }
                    ml={ 1 }
                  />
                ) }
              </Box>
              <Tag colorScheme={ isRead ? 'black-purple' : 'black-blue' } flexShrink={ 0 }>{ isRead ? 'read' : 'write' }</Tag>
              { 'method_id' in data && (
                <Tag display="inline-flex" alignItems="center" flexShrink={ 0 }>
                  { data.method_id }
                  <CopyToClipboard text={ data.method_id }/>
                </Tag>
              ) }
              <AccordionIcon transform={ isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' } color="gray.500"/>
            </AccordionButton>
          </Element>
          <AccordionPanel pb={ 4 } pr={ 0 } pl="28px" w="calc(100% - 6px)">
            { 'is_invalid' in data && data.is_invalid ? (
              <Alert status="warning">An error occurred while parsing the method signature.</Alert>
            ) : (
              <ContractMethodForm
                key={ id + '_' + index + '_' + attempt }
                data={ data }
                attempt={ attempt }
                onSubmit={ onSubmit }
                onReset={ handleReset }
                isOpen={ isExpanded }
              />
            ) }
          </AccordionPanel>
        </>
      ) }
    </AccordionItem>
  );
};

export default React.memo(ContractAbiItem);

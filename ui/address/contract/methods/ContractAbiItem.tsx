import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Alert, Box } from '@chakra-ui/react';
import React from 'react';
import { Element } from 'react-scroll';

import type { FormSubmitHandler, SmartContractMethod } from './types';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import Tag from 'ui/shared/chakra/Tag';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import Hint from 'ui/shared/Hint';

import ContractMethodForm from './form/ContractMethodForm';
import { getElementName } from './useScrollToMethod';

interface Props {
  data: SmartContractMethod;
  index: number;
  id: number;
  addressHash: string;
  tab: string;
  onSubmit: FormSubmitHandler;
}

const ContractAbiItem = ({ data, index, id, addressHash, tab, onSubmit }: Props) => {
  const [ attempt, setAttempt ] = React.useState(0);

  const url = React.useMemo(() => {
    if (!('method_id' in data)) {
      return '';
    }

    return config.app.baseUrl + route({
      pathname: '/address/[hash]',
      query: {
        hash: addressHash ?? '',
        tab,
      },
      hash: data.method_id,
    });
  }, [ addressHash, data, tab ]);

  const handleCopyLinkClick = React.useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  const handleCopyMethodIdClick = React.useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  const handleReset = React.useCallback(() => {
    setAttempt((prev) => prev + 1);
  }, []);

  return (
    <AccordionItem as="section" _first={{ borderTopWidth: 0 }} _last={{ borderBottomWidth: 0 }}>
      { ({ isExpanded }) => (
        <>
          <Element as="h2" name={ 'method_id' in data ? getElementName(data.method_id) : '' }>
            <AccordionButton px={ 0 } py={ 3 } _hover={{ bgColor: 'inherit' }} wordBreak="break-all" textAlign="left" as="div" cursor="pointer">
              { 'method_id' in data && <CopyToClipboard text={ url } onClick={ handleCopyLinkClick } type="link" mr={ 2 } ml={ 0 } color="text_secondary"/> }
              <Box as="span" fontWeight={ 500 } mr={ 1 }>
                { index + 1 }. { data.type === 'fallback' || data.type === 'receive' ? data.type : data.name }
              </Box>
              { data.type === 'fallback' && (
                <Hint
                  label={
                    `The fallback function is executed on a call to the contract if none of the other functions match 
                    the given function signature, or if no data was supplied at all and there is no receive Ether function. 
                    The fallback function always receives data, but in order to also receive Ether it must be marked payable.`
                  }/>
              ) }
              { data.type === 'receive' && (
                <Hint
                  label={
                    `The receive function is executed on a call to the contract with empty calldata. 
                    This is the function that is executed on plain Ether transfers (e.g. via .send() or .transfer()). 
                    If no such function exists, but a payable fallback function exists, the fallback function will be called on a plain Ether transfer. 
                    If neither a receive Ether nor a payable fallback function is present, 
                    the contract cannot receive Ether through regular transactions and throws an exception.`
                  }/>
              ) }
              { 'method_id' in data && (
                <>
                  <Tag>{ data.method_id }</Tag>
                  <CopyToClipboard text={ `${ data.name } (${ data.method_id })` } onClick={ handleCopyMethodIdClick }/>
                </>
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

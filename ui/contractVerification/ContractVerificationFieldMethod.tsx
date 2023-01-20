import {
  RadioGroup,
  Radio,
  Stack,
  Text,
  Link,
  Icon,
  chakra,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  useColorModeValue,
  DarkMode,
} from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { FormFields, VerificationMethod } from './types';

import infoIcon from 'icons/info.svg';

const VERIFICATION_METHODS: Array<VerificationMethod> = [
  'flatten_source_code',
  'standard_input',
  'sourcify',
  'multi_part_file',
  'vyper_contract',
];

interface Props {
  control: Control<FormFields>;
  isDisabled?: boolean;
}

const ContractVerificationFieldMethod = ({ control, isDisabled }: Props) => {

  const tooltipBg = useColorModeValue('gray.700', 'gray.900');

  const renderItem = React.useCallback((method: VerificationMethod) => {
    switch (method) {
      case 'flatten_source_code':
        return 'Via flattened source code';
      case 'standard_input':
        return (
          <>
            <span>Via standard </span>
            <Link href="https://docs.soliditylang.org/en/latest/using-the-compiler.html#input-description" target="_blank">
                Input JSON
            </Link>
          </>
        );
      case 'sourcify':
        return (
          <>
            <span>Via sourcify: sources and metadata JSON file</span>
            <Popover trigger="hover">
              <PopoverTrigger>
                <chakra.span cursor="pointer" display="inline-block" verticalAlign="middle" h="24px" ml={ 1 }>
                  <Icon as={ infoIcon } boxSize={ 5 } color="link" _hover={{ color: 'link_hovered' }}/>
                </chakra.span>
              </PopoverTrigger>
              <Portal>
                <PopoverContent bgColor={ tooltipBg }>
                  <PopoverArrow bgColor={ tooltipBg }/>
                  <PopoverBody color="white">
                    <DarkMode>
                      <div>
                        <span>Verification through </span>
                        <Link href="https://sourcify.dev/" target="_blank">Sourcify</Link>
                      </div>
                      <div>
                        <span>a) if smart-contract already verified on Sourcify, it will automatically fetch the data from the </span>
                        <Link href="https://repo.sourcify.dev/" target="_blank">repo</Link>
                      </div>
                      <div>
                            b) otherwise you will be asked to upload source files and JSON metadata file(s).
                      </div>
                    </DarkMode>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          </>
        );
      case 'multi_part_file':
        return 'Via multi-part files';
      case 'vyper_contract':
        return 'Vyper contract';

      default:
        break;
    }
  }, [ tooltipBg ]);

  const renderRadioGroup = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'method'>}) => {
    return (
      <RadioGroup defaultValue="add" colorScheme="blue" isDisabled={ isDisabled } { ...field }>
        <Stack spacing={ 4 }>
          { VERIFICATION_METHODS.map((method) => {
            return <Radio key={ method } value={ method }>{ renderItem(method) }</Radio>;
          }) }
        </Stack>
      </RadioGroup>
    );
  }, [ isDisabled, renderItem ]);

  return (
    <section>
      <Text variant="secondary" fontSize="sm" mb={ 5 }>New solidity/yul smart contract verification</Text>
      <Controller
        name="method"
        control={ control }
        render={ renderRadioGroup }
      />
    </section>
  );
};

export default React.memo(ContractVerificationFieldMethod);

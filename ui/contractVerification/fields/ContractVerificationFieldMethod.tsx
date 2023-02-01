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
  useBoolean,
} from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { FormFields } from '../types';
import type { SmartContractVerificationMethod, SmartContractVerificationConfig } from 'types/api/contract';

import infoIcon from 'icons/info.svg';

interface Props {
  control: Control<FormFields>;
  isDisabled?: boolean;
  methods: SmartContractVerificationConfig['verification_options'];
}

const ContractVerificationFieldMethod = ({ control, isDisabled, methods }: Props) => {
  const [ isPopoverOpen, setIsPopoverOpen ] = useBoolean();
  const tooltipBg = useColorModeValue('gray.700', 'gray.900');

  const renderItem = React.useCallback((method: SmartContractVerificationMethod) => {
    switch (method) {
      case 'flattened_code':
        return 'Via flattened source code';
      case 'standard_input':
        return (
          <>
            <span>Via standard </span>
            <Link
              href={ isDisabled ? undefined : 'https://docs.soliditylang.org/en/latest/using-the-compiler.html#input-description' }
              target="_blank"
              cursor={ isDisabled ? 'not-allowed' : 'pointer' }
            >
                Input JSON
            </Link>
          </>
        );
      case 'sourcify':
        return (
          <>
            <span>Via sourcify: sources and metadata JSON file</span>
            <Popover trigger="hover" isLazy isOpen={ isDisabled ? false : isPopoverOpen } onOpen={ setIsPopoverOpen.on } onClose={ setIsPopoverOpen.off }>
              <PopoverTrigger>
                <chakra.span cursor={ isDisabled ? 'not-allowed' : 'pointer' } display="inline-block" verticalAlign="middle" h="24px" ml={ 1 }>
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
      case 'multi_part':
        return 'Via multi-part files';
      case 'vyper_code':
        return 'Vyper contract';

      default:
        break;
    }
  }, [ isDisabled, isPopoverOpen, setIsPopoverOpen.off, setIsPopoverOpen.on, tooltipBg ]);

  const renderRadioGroup = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'method'>}) => {
    return (
      <RadioGroup defaultValue="add" colorScheme="blue" isDisabled={ isDisabled } { ...field }>
        <Stack spacing={ 4 }>
          { methods.map((method) => {
            return <Radio key={ method } value={ method } size="lg">{ renderItem(method) }</Radio>;
          }) }
        </Stack>
      </RadioGroup>
    );
  }, [ isDisabled, methods, renderItem ]);

  return (
    <section>
      <Text variant="secondary" fontSize="sm" mb={ 5 }>Smart-contract verification method</Text>
      <Controller
        name="method"
        control={ control }
        render={ renderRadioGroup }
      />
    </section>
  );
};

export default React.memo(ContractVerificationFieldMethod);

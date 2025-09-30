import { Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Contract } from 'sevm';
import wabtInit from 'wabt';

import type { Address } from 'types/api/address';
import type { SmartContract } from 'types/api/contract';

import { Alert } from 'toolkit/chakra/alert';
import { Button } from 'toolkit/chakra/button';
// eslint-disable-next-line import-helpers/order-imports
import CodeViewSnippet from 'ui/shared/CodeViewSnippet';

//import ContractDetailsByteCode from './ContractDetailsByteCode';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

import ContractDetailsConstructorArgs from './ContractDetailsConstructorArgs';
import ContractDetailsVerificationButton from './ContractDetailsVerificationButton';
import ContractSourceCode from './ContractSourceCode';
import type { CONTRACT_DETAILS_TAB_IDS } from './utils';

// import wabtInit from './utils/libwabt';

function isEVM(bytecode: string) {
  if (!bytecode || bytecode.length < 4) return false;

  try {
    const contract = new Contract(hexToUint8Array(bytecode));
    return contract.opcodes() && contract.opcodes().length > 5;
  } catch {
    return false;
  }
}

interface Tab {
  id: typeof CONTRACT_DETAILS_TAB_IDS[number];
  title: string;
  component: React.ReactNode;
}

interface Props {
  data: SmartContract | undefined;
  isLoading: boolean;
  addressData: Address;
  sourceAddress: string;
}

const BYTECODE_PREFIX = '0x';

// function extractEvmBytecode(dataHex: string) {
//   const hex = dataHex.startsWith(BYTECODE_PREFIX) ? dataHex.slice(2) : dataHex;
//   const offset = (3 + 32) * 2;
//   return hex.slice(offset);
// }

function hexToUint8Array(hex: string): Uint8Array {
  if (hex.startsWith(BYTECODE_PREFIX)) hex = hex.slice(2);
  return new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
}

// 0x0061736d

const useOpcodesOrWat = ({ bytecode, evmVersion }: {
  bytecode: string | undefined | null;
  evmVersion: string | null | undefined;
}) => {
  const [ opcodes, setOpcodes ] = useState<string>('');

  useEffect(() => {
    async function disassemble() {
      try {
        if (!bytecode) return;

        if (evmVersion || isEVM(bytecode)) {
          const contract = new Contract(hexToUint8Array(bytecode));
          const opcodes = contract.opcodes()
            .map(opcode => opcode.mnemonic + ' ' + (opcode.data ? opcode.hexData() : ''))
            .join('\n');
          setOpcodes(opcodes);
          return;
        }

        const wabt = await wabtInit();
        const buffer = hexToUint8Array(bytecode);

        const mod = wabt.readWasm(buffer, { readDebugNames: true });
        mod.applyNames();
        const watText = mod.toText({ foldExprs: false });
        mod.destroy();

        setOpcodes(watText);
        return;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Error disassembling bytecode:', err);
        setOpcodes('-');
      }
    }

    disassemble();
  }, [ bytecode, evmVersion ]);

  return {
    opcodes,
  };

};

export default function useContractDetailsTabs({ data, isLoading, addressData, sourceAddress }: Props): Array<Tab> {
  const [ showOpCode, setShowOpCode ] = useState(false);

  const { opcodes } = useOpcodesOrWat({ bytecode: data?.creation_bytecode, evmVersion: data?.evm_version });

  const canBeVerified = ![ 'selfdestructed', 'failed' ].includes(data?.creation_status || '') && !data?.is_verified && addressData.proxy_type !== 'eip7702';

  return React.useMemo(() => {
    const verificationButton = (
      <ContractDetailsVerificationButton
        isLoading={ isLoading }
        addressHash={ addressData.hash }
        // isPartiallyVerified={ Boolean(data?.is_partially_verified) }
      />
    );

    if (!sourceAddress) {
      return [];
    }
    const opcodeBtnTitle = data?.evm_version || isEVM(data?.deployed_bytecode || '') ? 'Show Opcodes' : 'Show Wat';
    const toggleButton = () => setShowOpCode(!showOpCode);

    const switchToOpCodeButton = (
      <Button
        size="sm"
        mr={ 3 }
        mb={ 2 }
        ml="auto"
        flexShrink={ 0 }
        as="a"
        // eslint-disable-next-line react/jsx-no-bind
        onClick={ toggleButton }
      >
        { showOpCode ? 'Show ByteCode' : opcodeBtnTitle }
      </Button>
    );

    const creationStatusText = (() => {
      switch (data?.creation_status) {
        case 'selfdestructed':
          return 'This contract self-destructed after deployment and there is no runtime bytecode. Below is the raw creation bytecode.';
        case 'failed':
          return 'Contract creation failed and there is no runtime bytecode. Below is the raw creation bytecode.';
        default:
          return null;
      }
    })();

    return [
      (data?.constructor_args || data?.source_code) ? {
        id: 'contract_source_code' as const,
        title: 'Code',
        component: (
          <Flex flexDir="column" rowGap={ 6 }>
            <ContractDetailsConstructorArgs data={ data } isLoading={ isLoading }/>
            { data?.source_code && (
              <ContractSourceCode
                data={ data }
                isLoading={ isLoading }
                sourceAddress={ sourceAddress }
              />
            ) }
          </Flex>
        ),
      } : undefined,

      data?.compiler_settings ? {
        id: 'contract_compiler' as const,
        title: 'Compiler',
        component: (
          <CodeViewSnippet
            data={ JSON.stringify(data.compiler_settings, undefined, 2) }
            language="json"
            title="Compiler Settings"
            copyData={ JSON.stringify(data.compiler_settings) }
            isLoading={ isLoading }
          />
        ),
      } : undefined,

      data?.abi ? {
        id: 'contract_abi' as const,
        title: 'ABI',
        component: (
          <CodeViewSnippet
            data={ JSON.stringify(data.abi, undefined, 2) }
            language="json"
            title="Contract ABI"
            copyData={ JSON.stringify(data.abi) }
            isLoading={ isLoading }
          />
        ),
      } : undefined,

      (data?.creation_bytecode || data?.deployed_bytecode) ? {
        id: 'contract_bytecode' as const,
        title: 'ByteCode',
        component: (
          <Flex flexDir="column" rowGap={ 6 }>
            { data?.creation_bytecode && (
              <RawDataSnippet
                data={ data.creation_bytecode }
                title="Contract creation code"
                rightSlot={ canBeVerified ? verificationButton : null }
                beforeSlot={ creationStatusText ? (
                  <Alert status="info" whiteSpace="pre-wrap" mb={ 3 }>
                    { creationStatusText }
                  </Alert>
                ) : null }
                textareaMaxHeight="300px"
                isLoading={ isLoading }
              />
            ) }
            { data?.deployed_bytecode && (
              <RawDataSnippet
                data={ showOpCode ? opcodes : data.deployed_bytecode }
                title={ showOpCode ? 'Deployed OpCode' : 'Deployed ByteCode' }
                beforeSlot={ switchToOpCodeButton }
                rightSlot={ !data?.creation_bytecode && canBeVerified ? verificationButton : null }
                textareaMaxHeight="300px"
                isLoading={ isLoading }
              />
            ) }
          </Flex>
        ),
        // title: 'Bytecode',
        // component: <ContractDetailsByteCode data={ data } isLoading={ isLoading } addressData={ addressData }/>,
      } : undefined,
    ].filter(Boolean);
  }, [ isLoading, addressData.hash, sourceAddress, data, showOpCode, canBeVerified, opcodes ]);
}

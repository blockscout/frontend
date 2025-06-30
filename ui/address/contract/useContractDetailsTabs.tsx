import { Alert, Button, Flex } from '@chakra-ui/react';
import { EVM } from 'evm';
import React, { useEffect, useState } from 'react';
import wabtInit from 'wabt';

import type { SmartContract } from 'types/api/contract';

import CodeViewSnippet from 'ui/shared/CodeViewSnippet';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

import ContractDetailsConstructorArgs from './ContractDetailsConstructorArgs';
import ContractDetailsVerificationButton from './ContractDetailsVerificationButton';
import ContractSourceCode from './ContractSourceCode';
import type { CONTRACT_DETAILS_TAB_IDS } from './utils';

interface Tab {
  id: typeof CONTRACT_DETAILS_TAB_IDS[number];
  title: string;
  component: React.ReactNode;
}

interface Props {
  data: SmartContract | undefined;
  isLoading: boolean;
  addressHash: string;
  sourceAddress: string;
}

const useOpcodes = ({ bytecode }: { bytecode: string | undefined | null }) => {
  const [ opcodes, setOpcodes ] = useState<string>('');

  useEffect(() => {
    async function disassemble() {
      try {
        if (!bytecode) return;
        let processedBytecode = bytecode;
        if (bytecode.startsWith('0xef4400')) {
          processedBytecode = '0x' + bytecode.slice(70);
        }
        if (processedBytecode.replace(/^0x/, '').toLowerCase().startsWith('0061736d')) {
          const wabt = await wabtInit();

          const buffer = Uint8Array.from(
            processedBytecode
              .replace(/^0x/, '')
              .match(/.{1,2}/g)!
              .map((b) => parseInt(b, 16)),
          );

          const mod = wabt.readWasm(buffer, { readDebugNames: true });
          mod.applyNames();
          const watText = mod.toText({ foldExprs: false });
          mod.destroy();

          setOpcodes(watText);
          return;
        }
        const evm = new EVM(processedBytecode.startsWith('0x') ? processedBytecode : '0x' + processedBytecode);
        setOpcodes(evm.getOpcodes().map(op => {
          const push = op.pushData ? ` 0x${ op.pushData.toString('hex') }` : '';
          return `${ op.name } ${ push }`;
        }).join('\n'));
      } catch (err) {
        setOpcodes('-');
      }
    }

    disassemble();
  }, [ bytecode ]);

  return {
    opcodes,
  };

};

export default function useContractDetailsTabs({ data, isLoading, addressHash, sourceAddress }: Props): Array<Tab> {
  const [ showOpCode, setShowOpCode ] = useState(false);
  const { opcodes } = useOpcodes({ bytecode: data?.deployed_bytecode });

  const canBeVerified = !data?.is_self_destructed && !data?.is_verified && data?.proxy_type !== 'eip7702';

  return React.useMemo(() => {
    const verificationButton = (
      <ContractDetailsVerificationButton
        isLoading={ isLoading }
        addressHash={ addressHash }
        isPartiallyVerified={ Boolean(data?.is_partially_verified) }
      />
    );
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
        { showOpCode ? 'Show ByteCode' : 'Show OpCode' }
      </Button>
    );

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
                beforeSlot={ data.is_self_destructed ? (
                  <Alert status="info" whiteSpace="pre-wrap" mb={ 3 }>
                    Contracts that self destruct in their constructors have no contract code published and cannot be verified.
                    Displaying the init data provided of the creating transaction.
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
      } : undefined,
    ].filter(Boolean);
  }, [ isLoading, addressHash, data, sourceAddress, canBeVerified, showOpCode, opcodes ]);
}

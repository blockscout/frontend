import { EVM_NAMES, type EVMNetwork } from '@ylide/ethereum';
import type { PublicKey, Ylide, YlideKeysRegistry } from '@ylide/sdk';
import { useCallback, useState } from 'react';

import type { DomainAccount } from './types';

export const useYlideFaucet = (ylide: Ylide, keysRegistry: YlideKeysRegistry) => {
  const [ publishingTxHash, setPublishingTxHash ] = useState('');
  const [ isTxPublishing, setIsTxPublishing ] = useState(false);
  const [ txPlateVisible, setTxPlateVisible ] = useState(false);

  const getFaucetSignature = useCallback(async(
    account: DomainAccount,
    publicKey: PublicKey,
    faucetType: EVMNetwork.GNOSIS,
  ) => {
    const faucet = await account.wallet.getFaucet({ faucetType });

    const registrar = 7;

    const data = await faucet.authorizePublishing(account.account, publicKey, registrar, {
      type: 'client',
      key: 'clfaf6c3e695452c2a',
    });

    return {
      faucet,
      data,
      blockchain: EVM_NAMES[faucetType],
      account,
      publicKey,
      faucetType,
    };
  }, []);

  const publishThroughFaucet = useCallback(async(faucetData: Awaited<ReturnType<typeof getFaucetSignature>>) => {
    try {
      try {
        const result = await faucetData.faucet.attachPublicKey(faucetData.data);

        const key = await ylide.core.waitForPublicKey(
          faucetData.blockchain,
          faucetData.account.account.address,
          faucetData.publicKey.keyBytes,
        );

        if (key) {
          await keysRegistry.addRemotePublicKey(key);

          faucetData.account.reloadKeys();

          setPublishingTxHash(result.txHash);
          setIsTxPublishing(false);
        } else {
          setIsTxPublishing(false);
          // console.error(
          //   'Something went wrong with key publishing :(\n\n' + JSON.stringify(result, null, '\t'),
          // );
        }
      } catch (err) {
        // console.error(`Something went wrong with key publishing: ${ err.message }`, err.stack);
        // toast('Something went wrong with key publishing :( Please, try again');
        setIsTxPublishing(false);
        setTxPlateVisible(false);
      }
    } catch (err) {
      // console.error('faucet publication error: ', err);
      setIsTxPublishing(false);
      setTxPlateVisible(false);
    }
  }, [ ylide, keysRegistry ]);

  return { getFaucetSignature, publishThroughFaucet, publishingTxHash, isTxPublishing, txPlateVisible, setTxPlateVisible };
};

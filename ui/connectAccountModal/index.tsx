import { Box, Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner } from '@chakra-ui/react';
import { EVMNetwork } from '@ylide/ethereum';
import type { AbstractWalletController, RemotePublicKey, WalletAccount, YlideKeysRegistry, YlidePrivateKey } from '@ylide/sdk';
import { asyncDelay, PrivateKeyAvailabilityState, YlideKeyVersion } from '@ylide/sdk';
import type { PropsWithChildren, ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';

import type { DomainAccount } from 'lib/contexts/ylide/types';

import ProceedToWalletArrowSvg from 'icons/proceedTOWalletArrow.svg';
import { useYlide } from 'lib/contexts/ylide';

import { BlockChainLabel } from './BlockChainLabel';
import { WalletTag } from './WalletTag';

enum Step {
  LOADING,
  ENTER_PASSWORD,
  GENERATE_KEY,
  PUBLISH_KEY,
  PUBLISHING_KEY,
}

interface ActionModalProps extends PropsWithChildren<NonNullable<unknown>> {
  title?: ReactNode;
  buttons?: ReactNode;
  onClose: () => void;
}

function ActionModal({ children, title, buttons, onClose }: ActionModalProps) {
  return (
    <Modal isOpen={ true } onClose={ onClose }>
      <ModalOverlay/>
      <ModalContent w={ 420 }>
        { title != null && <ModalHeader mb={ 2 }>{ title }</ModalHeader> }
        <ModalCloseButton top={ 1 } right={ 1 }/>
        { children != null && <ModalBody>{ children }</ModalBody> }
        { buttons != null && <ModalFooter gap={ 4 } flexDir="column" alignItems="stretch">{ buttons }</ModalFooter> }
      </ModalContent>
    </Modal>
  );
}

interface LoadingModalProps {
  reason?: ReactNode;
}

export function LoadingModal({ reason }: LoadingModalProps) {
  const handleClose = useCallback(() => {}, []);
  return (
    <Modal isOpen={ true } onClose={ handleClose }>
      <ModalOverlay/>
      <ModalContent w={ 420 }>
        <Spinner/>
        { reason && <Flex>{ reason }</Flex> }
      </ModalContent>
    </Modal>
  );
}

export interface YlideConnectAccountModalProps {
  wallet: AbstractWalletController;
  account: WalletAccount;
  remoteKeys: Record<string, RemotePublicKey | null>;
  onClose?: (account?: DomainAccount) => void;
}

async function constructLocalKeyV3(keysRegistry: YlideKeysRegistry, controller: AbstractWalletController, account: WalletAccount) {
  return await keysRegistry.instantiateNewPrivateKey(
    account.blockchainGroup,
    account.address,
    YlideKeyVersion.KEY_V3,
    PrivateKeyAvailabilityState.AVAILABLE,
    {
      onPrivateKeyRequest: async(address, magicString) =>
        await controller.signMagicString(account, magicString),
    },
  );
}

async function constructLocalKeyV2(keysRegistry: YlideKeysRegistry, controller: AbstractWalletController, account: WalletAccount, password: string) {
  return await keysRegistry.instantiateNewPrivateKey(
    account.blockchainGroup,
    account.address,
    YlideKeyVersion.KEY_V2,
    PrivateKeyAvailabilityState.AVAILABLE,
    {
      onPrivateKeyRequest: async(address, magicString) =>
        await controller.signMagicString(account, magicString),
      onYlidePasswordRequest: async() => password,
    },
  );
}

async function constructLocalKeyV1(keysRegistry: YlideKeysRegistry, controller: AbstractWalletController, account: WalletAccount, password: string) {
  return await keysRegistry.instantiateNewPrivateKey(
    account.blockchainGroup,
    account.address,
    YlideKeyVersion.INSECURE_KEY_V1,
    PrivateKeyAvailabilityState.AVAILABLE,
    {
      onPrivateKeyRequest: async(address, magicString) =>
        await controller.signMagicString(account, magicString),
      onYlidePasswordRequest: async() => password,
    },
  );
}

export function YlideConnectAccountModal({
  wallet,
  account,
  remoteKeys,
  onClose,
}: YlideConnectAccountModalProps): JSX.Element {
  const freshestKey: { key: RemotePublicKey; blockchain: string } | undefined = useMemo(
    () =>
      Object.keys(remoteKeys)
        .filter(t => Boolean(remoteKeys[t]))
        .map(t => ({
          key: remoteKeys[t] as RemotePublicKey,
          blockchain: t,
        }))
        .sort((a, b) => b.key.timestamp - a.key.timestamp)[0],
    [ remoteKeys ],
  );
  const keyVersion = freshestKey?.key.publicKey.keyVersion || 0;
  const isPasswordNeeded = keyVersion === 1 || keyVersion === 2;

  const { faucet, keysRegistry } = useYlide();

  const [ step, setStep ] = useState(Step.ENTER_PASSWORD);

  const [ password, setPassword ] = useState('');

  const waitTxPublishing = false;

  //   const [ network, setNetwork ] = useState<EVMNetwork>();
  //   useEffect(() => {
  //     if (wallet.factory.blockchainGroup === 'evm') {
  //       getEvmWalletNetwork(wallet).then(setNetwork);
  //     }
  //   }, [ wallet ]);

  // const domainAccountRef = useRef<DomainAccount>();

  const createDomainAccount = useCallback(async(
    wallet: AbstractWalletController,
    account: WalletAccount,
    privateKey: YlidePrivateKey,
  ): Promise<DomainAccount> => {
    // const acc = await wallet.createNewDomainAccount(account);
    // await acc.addNewLocalPrivateKey(privateKey);
    // domainAccountRef.current = acc;
    await keysRegistry.addLocalPrivateKey(privateKey);
    return {
      wallet,
      account,
      name: 'New Account',
      backendAuthKey: null,
      reloadKeys: async() => {
        // await keysRegistry.reloadLocalPrivateKeys();
        await asyncDelay(1000);
      },
    };
    // return acc;
  }, [ keysRegistry ]);

  // function exitUnsuccessfully(error?: { message: string; e?: any }) {
  //   // if (error) {
  //   //   console.error(error.message, error.e);
  //   //   toast(error.message);
  //   // }

  //   // if (domainAccountRef.current) {
  //   //   disconnectAccount({ account: domainAccountRef.current }).catch();
  //   // }

  //   onClose?.();
  // }

  const createLocalKey = useCallback(async({
    password,
    forceNew,
    withoutPassword,
  }: {
    password: string;
    forceNew?: boolean;
    withoutPassword?: boolean;
  }) => {
    setStep(Step.GENERATE_KEY);

    let tempLocalKey: YlidePrivateKey;
    const needToRepublishKey = false;
    try {
      const forceSecond = false;
      if (withoutPassword) {
        //         console.warn('createLocalKey', 'withoutPassword');
        tempLocalKey = await constructLocalKeyV3(keysRegistry, wallet, account);
      } else if (forceNew) {
        // console.warn('createLocalKey', 'forceNew');
        tempLocalKey = await constructLocalKeyV2(keysRegistry, wallet, account, password);
      } else if (freshestKey?.key.publicKey.keyVersion === YlideKeyVersion.INSECURE_KEY_V1) {
        if (freshestKey.blockchain === 'venom-testnet') {
          // strange... I'm not sure Qamon keys work here
          if (forceSecond) {
            // console.warn('createLocalKey', 'INSECURE_KEY_V1 venom-testnet');
            tempLocalKey = await constructLocalKeyV1(keysRegistry, wallet, account, password);
          } else {
            // console.warn('createLocalKey', 'INSECURE_KEY_V1 venom-testnet');
            tempLocalKey = await constructLocalKeyV2(keysRegistry, wallet, account, password);
          }
        } else {
          // strange... I'm not sure Qamon keys work here
          if (forceSecond) {
            // console.warn('createLocalKey', 'INSECURE_KEY_V2 non-venom');
            tempLocalKey = await constructLocalKeyV2(keysRegistry, wallet, account, password);
          } else {
            // console.warn('createLocalKey', 'INSECURE_KEY_V1 non-venom');
            tempLocalKey = await constructLocalKeyV1(keysRegistry, wallet, account, password);
          }
        }
      } else if (freshestKey?.key.publicKey.keyVersion === YlideKeyVersion.KEY_V2) {
        // if user already using password - we should use it too
        // console.warn('createLocalKey', 'KEY_V2');
        tempLocalKey = await constructLocalKeyV2(keysRegistry, wallet, account, password);
      } else if (freshestKey?.key.publicKey.keyVersion === YlideKeyVersion.KEY_V3) {
        // if user is not using password - we should not use it too
        // console.warn('createLocalKey', 'KEY_V3');
        tempLocalKey = await constructLocalKeyV3(keysRegistry, wallet, account);
      } else {
        // user have no key at all - use passwordless version
        // console.warn('createLocalKey', 'no key');
        tempLocalKey = await constructLocalKeyV3(keysRegistry, wallet, account);
      }
    } catch (e) {
      // exitUnsuccessfully({ message: 'Failed to create local key 😒', e });
      return;
    }

    setStep(Step.LOADING);

    if (!freshestKey || needToRepublishKey) {
      const domainAccount = await createDomainAccount(wallet, account, tempLocalKey);
      const actualFaucetType = EVMNetwork.GNOSIS;

      setStep(Step.GENERATE_KEY);

      const faucetData = await faucet.getFaucetSignature(
        domainAccount,
        tempLocalKey.publicKey,
        actualFaucetType,
      );

      setStep(Step.LOADING);

      const promise = faucet.publishThroughFaucet(faucetData);

      if (waitTxPublishing) {
        await promise;
      }

      onClose?.(domainAccount);
    } else if (freshestKey.key.publicKey.equals(tempLocalKey.publicKey)) {
      await keysRegistry.addRemotePublicKeys(
        Object.values(remoteKeys).filter(it => Boolean(it)) as Array<RemotePublicKey>,
      );
      const domainAccount = await createDomainAccount(wallet, account, tempLocalKey);
      onClose?.(domainAccount);
    } else if (forceNew || withoutPassword) {

      // await createDomainAccount(wallet, account, tempLocalKey);
      // await publishLocalKey(tempLocalKey, network);
    } else {
      alert('Password is wrong. Please try again ❤');
      setStep(Step.ENTER_PASSWORD);
    }
  }, [ account, createDomainAccount, faucet, freshestKey, keysRegistry, onClose, remoteKeys, waitTxPublishing, wallet ]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [ onClose ]);

  const handleCreateLocalKey = useCallback(() => {
    createLocalKey({ password });
  }, [ password, createLocalKey ]);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handlePasswordKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      createLocalKey({ password });
    }
  }, [ password, createLocalKey ]);

  const handleForgotPassword = useCallback(() => {
    // showStaticComponent(resolve => (
    //   <ForgotPasswordModal
    //     onClose={ result => {
    //       if (result?.withoutPassword) {
    //         createLocalKey({
    //           password: '',
    //           withoutPassword: true,
    //         });
    //       } else if (result?.password) {
    //         createLocalKey({
    //           password: result.password,
    //           forceNew: true,
    //         });
    //       }

    //       resolve();
    //     } }
    //   />
    // ))
    //   .catch(console.error);
  }, []);

  const handleCancelKeyGeneration = useCallback(() => {
    if (isPasswordNeeded) {
      setStep(Step.ENTER_PASSWORD);
    } else {
      handleClose();
    }
  }, [ handleClose, isPasswordNeeded ]);

  const handleCancelKeyPublishing = useCallback(() => {
    setStep(
      isPasswordNeeded ?
        Step.ENTER_PASSWORD :
        Step.GENERATE_KEY,
    );
  }, [ isPasswordNeeded ]);

  const steps: Record<Step, () => JSX.Element> = {
    [Step.LOADING]: () => <LoadingModal reason="Please wait ..."/>,
    [Step.ENTER_PASSWORD]: () => (
      <ActionModal
        title={ isPasswordNeeded ? 'Enter password' : 'Sign authorization message' }
        buttons={ (
          <>
            <Button
              onClick={ handleCreateLocalKey }
            >
              { isPasswordNeeded ? 'Continue' : 'Sign' }
            </Button>
            <Button onClick={ handleClose } variant="outline">
Cancel
            </Button>
          </>
        ) }
        onClose={ handleClose }
      >
        <WalletTag wallet={ wallet.wallet() } address={ account.address }/>

        { freshestKey ? (
          <>
            <div>
We found your key in{ ' ' }
              <BlockChainLabel blockchain={ freshestKey.blockchain }/> blockchain.{ ' ' }
              { isPasswordNeeded ?
                'Please, enter your Ylide Password to access it.' :
                'Please, sign authroization message to access it.' }
            </div>

            { isPasswordNeeded && (
              <div
                style={{
                  paddingTop: 40,
                  paddingBottom: 40,
                }}
              >
                <Input
                  autoFocus
                  type="password"
                  placeholder="Enter your Ylide password"
                  value={ password }
                  onChange={ handlePasswordChange }
                  onKeyDown={ handlePasswordKeyDown }
                />

                <div
                  style={{
                    marginTop: 8,
                    textAlign: 'right',
                  }}
                >
                  <button onClick={ handleForgotPassword }>Forgot Password?</button>
                </div>
              </div>
            ) }
          </>
        ) : (
          <div>
To get your private Ylide communication key, please, press &quot;Sign&quot; button below and sign the
authorization message in your wallet.
          </div>
        ) }
      </ActionModal>
    ),
    [Step.GENERATE_KEY]: () => (
      <ActionModal
        buttons={ (
          <Button
            onClick={ handleCancelKeyGeneration }
            variant="outline"
          >
Cancel
          </Button>
        ) }
        onClose={ handleClose }
      >
        <WalletTag wallet={ wallet.wallet() } address={ account.address }/>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: 40,
            paddingRight: 24,
            paddingBottom: 20,
          }}
        >
          <ProceedToWalletArrowSvg/>
        </div>

        <div style={{ textAlign: 'center', fontSize: '180%' }}>Confirm the message</div>

        <div>
          { isPasswordNeeded ?
            'We need you to sign your password so we can generate you a unique communication key.' :
            'We need you to sign authorization message so we can generate you a unique communication key.' }
        </div>
      </ActionModal>
    ),
    [Step.PUBLISH_KEY]: () => (
      <ActionModal
        buttons={ (
          <Button variant="outline" onClick={ handleCancelKeyPublishing }>Cancel</Button>
        ) }
        onClose={ handleClose }// () => exitUnsuccessfully() }
      >
        <WalletTag wallet={ wallet.wallet() } address={ account.address }/>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: 40,
            paddingRight: 24,
            paddingBottom: 20,
          }}
        >
          <ProceedToWalletArrowSvg/>
        </div>

        <div style={{ textAlign: 'center', fontSize: '180%' }}>Confirm the transaction</div>

        <div>Please sign the transaction in your wallet to publish your unique communication key.</div>
      </ActionModal>
    ),
    [Step.PUBLISHING_KEY]: () => (
      // () => exitUnsuccessfully() }
      <ActionModal onClose={ handleClose }>
        <WalletTag wallet={ wallet.wallet() } address={ account.address }/>

        <Flex
          justifyContent="center"
          paddingTop={ 5 }
          paddingBottom={ 5 }
        >
          <Spinner/>
        </Flex>

        <Box textAlign="center" fontSize="180%">Publishing the key</Box>

        <Box>Please, wait for the transaction to be completed</Box>
      </ActionModal>
    ),
  };

  const result: JSX.Element = steps[step]();

  return result;
}

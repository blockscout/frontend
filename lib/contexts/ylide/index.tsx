import { EthereumProvider } from '@walletconnect/ethereum-provider';
import type { EVMWalletController } from '@ylide/ethereum';
import { evm, EVM_CHAINS, EVM_NAMES, EVM_RPCS, EVMNetwork, evmWalletFactories } from '@ylide/ethereum';
import type { AbstractWalletController, IMessage, MessageAttachment, RecipientInfo, Uint256, WalletAccount, WalletControllerFactory } from '@ylide/sdk';
import {
  BrowserLocalStorage, MessageContentV4, MessageContentV5, PrivateKeyAvailabilityState, stringToSemver, Ylide, YlideKeysRegistry, YMF,
} from '@ylide/sdk';
import { SmartBuffer } from '@ylide/smart-buffer';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

import type { DomainAccount, IAppRegistry } from './types';

import ForumPersonalApi from 'lib/api/ylideApi/ForumPersonalApi';
import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { ensurePageLoaded } from 'lib/ensurePageLoaded';

import { blockchainMeta } from './constants';
import { useYlideAccountModal, useYlideSelectWalletModal } from './modals';
import { useYlideAccounts } from './useYlideAccounts';
import { useYlideFaucet } from './useYlideFaucet';
import { useYlidePushes } from './useYlidePushes';

export enum MessageDecodedTextDataType {
  PLAIN = 'plain',
  YMF = 'YMF',
}

export type IMessageDecodedTextData =
	| { type: MessageDecodedTextDataType.PLAIN; value: string }
	| { type: MessageDecodedTextDataType.YMF; value: YMF };

export interface IMessageDecodedContent {
  msgId: string;
  decodedTextData: IMessageDecodedTextData;
  decodedSubject: string;
  attachments: Array<MessageAttachment>;
  recipientInfos: Array<RecipientInfo>;
}

const YlideContext = createContext(undefined as unknown as ReturnType<typeof useYlideService>);

export interface WalletConnectConnection {
  readonly walletName: string;
  readonly provider: InstanceType<typeof EthereumProvider>;
}

const useWalletConnectState = (
  ylide: Ylide,
  ylideIsInitialized: boolean,
  wallets: Array<AbstractWalletController>,
  updateWallets: (newWallets: Array<AbstractWalletController>) => void,
) => {
  const [ initialized, setInitialized ] = useState(false);
  const [ connection, setConnection ] = useState<WalletConnectConnection | undefined>(undefined);
  const [ url, setUrl ] = useState<string>('');

  const disconnectWalletConnect = useCallback(async() => {
    if (!initialized || !connection) {
      return;
    }

    const wc = wallets.find(w => w.wallet() === 'walletconnect');

    if (wc) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await (wc as EVMWalletController).signer.provider.provider.disconnect();
      // TODO: pizdec
      document.location.reload();
    }
  }, [ connection, initialized, wallets ]);

  const initWallet = useCallback(async(factory: WalletControllerFactory) => {
    if (!initialized || !connection) {
      return false;
    }
    await ylide.controllers.addWallet(
      factory.wallet,
      {
        dev: false,
        faucet: {
          registrar: 1,
          apiKey: { type: 'client', key: 'clfaf6c3e695452c2a' },
        },
        walletConnectProvider: initialized && connection ? connection.provider : null,
      },
      factory.blockchainGroup,
    );
    updateWallets([ ...ylide.controllers.wallets ]);
    return true;
  }, [ ylide, initialized, connection, updateWallets ]);

  const init = useCallback(async() => {
    const rpcMap = {
      // Metamask only supports ethereum chain :(
      [EVM_CHAINS[EVMNetwork.ETHEREUM]]: (EVM_RPCS[EVMNetwork.ETHEREUM].find(
        r => !r.rpc.startsWith('ws'),
      ) as {
        rpc: string;
        blockLimit?: number;
        lastestNotSupported?: boolean;
        batchNotSupported?: boolean;
      }).rpc,
    };
    const chains = Object.keys(rpcMap).map(Number);
    let isAvailable = true;
    const projectId = 'e9deead089b3383b2db777961e3fa244';
    const wcTest = await EthereumProvider.init({
      projectId,
      chains,
      // TODO: remove after fix by WalletConnect - https://github.com/WalletConnect/walletconnect-monorepo/issues/2641
      // WalletConnect couldn't reproduce the issue, but we had it.
      // Need further to debug, but currently it does not break anything. Propose to leave it.
      optionalChains: [ 100500 ],
      rpcMap,
      showQrModal: true,
    });
    wcTest.modal?.subscribeModal(({ open }: { open: boolean }) => {
      if (open) {
        wcTest.modal?.closeModal();
        isAvailable = false;
      }
    });
    try {
      await wcTest.enable();
    } catch (err) {
      isAvailable = false;
    }

    if (isAvailable) {
      setInitialized(true);
      setConnection({
        walletName: wcTest.session?.peer.metadata.name || '',
        provider: wcTest,
      });
    } else {
      const wcReal = await EthereumProvider.init({
        projectId,
        chains,
        // TODO: remove after fix by WalletConnect - https://github.com/WalletConnect/walletconnect-monorepo/issues/2641
        // WalletConnect couldn't reproduce the issue, but we had it.
        // Need further to debug, but currently it does not break anything. Propose to leave it.
        optionalChains: [ 100500 ],
        rpcMap,
        showQrModal: false,
      });
      wcReal.on('display_uri', url => {
        setInitialized(true);
        setConnection(undefined);
        setUrl(url);
      });
      wcReal.on('connect', async() => {
        setInitialized(true);
        setConnection({
          walletName: wcReal.session?.peer.metadata.name || '',
          provider: wcReal,
        });
      });

      wcReal.enable();
    }
  }, []);

  useEffect(() => {
    if (ylideIsInitialized) {
      init();
    }
  }, [ ylideIsInitialized, init ]);

  useEffect(() => {
    if (ylideIsInitialized && initialized && connection) {
      const wcFactory = ylide.walletsList.find(w => w.wallet === 'walletconnect');
      if (wcFactory) {
        initWallet(wcFactory.factory);
      }
    }
  }, [ ylideIsInitialized, initialized, connection, ylide, initWallet ]);

  return {
    initialized,
    connection,
    url,
    disconnectWalletConnect,
  };
};

const useWalletConnectRegistry = () => {
  const [ registry, setRegistry ] = useState<IAppRegistry>({});
  const [ loading, setLoading ] = useState(true);

  const refetch = useCallback(async() => {
    try {
      setLoading(true);

      const response = await fetch('https://registry.walletconnect.com/api/v2/wallets');
      const data = await response.json() as { listings: IAppRegistry };

      setRegistry(data.listings);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [ refetch ]);

  return { registry, loading, refetch };
};

const REACT_APP_FEED_PUBLIC_KEY = '9b939eaca8b685f46d8311698669e25ec50015d96644bf671ed35264d754a977';

const useAccountController = (
  ylide: Ylide,
  keysRegistry: YlideKeysRegistry,
  wallets: Array<AbstractWalletController>,
  ylideInitialized: boolean,
  disconnectWalletConnect: () => void,
) => {
  const { savedAccounts, addAccount, deleteAccount, setAccountAuthKey } = useYlideAccounts();
  const selectWalletModal = useYlideSelectWalletModal();
  const accountModal = useYlideAccountModal();
  const acquireBackendAuthKey = ForumPersonalApi.useAcquireAuthKey();
  const [ backendAccountsData, setBackendAccountsData ] = useState<Record<string, { isAdmin: boolean }>>({});
  const [ initialized, setInitialized ] = useState(false);

  const domainAccounts = useMemo(() => {
    return savedAccounts.map(acc => ({
      name: acc.name,
      wallet: wallets.find(w => w.wallet() === acc.wallet),
      account: acc.account,
      backendAuthKey: acc.backendAuthKey,
    })).filter(acc => Boolean(acc.wallet)) as Array<DomainAccount>;
  }, [ wallets, savedAccounts ]);

  const tokens = useMemo(() => {
    return domainAccounts.map(acc => acc.backendAuthKey).filter(Boolean) as Array<string>;
  }, [ domainAccounts ]);

  const getMe = ForumPublicApi.useGetMe(tokens);

  const isAdmin = useMemo(() => {
    return domainAccounts.reduce((acc, cur) => ({
      ...acc,
      [cur.account.address]: backendAccountsData[cur.account.address]?.isAdmin ?? false,
    }), {} as Record<string, boolean>);
  }, [ domainAccounts, backendAccountsData ]);

  const admins = useMemo(() => {
    return domainAccounts.filter(acc => isAdmin[acc.account.address]);
  }, [ domainAccounts, isAdmin ]);

  useEffect(() => {
    if (!ylideInitialized) {
      return;
    }
    (async() => {
      try {
        const data = await getMe();
        setBackendAccountsData(data);
      } catch (err) {
        // console.error('getting ylide identities: ', err);
      }
      setInitialized(true);
    })();
  }, [ getMe, ylideInitialized ]);

  const constructBackendAuthKeySignature = useCallback(async(account: DomainAccount) => {
    const localPrivateKeys = keysRegistry.getLocalPrivateKeys(account.account.address);
    const availableKeys = localPrivateKeys.filter(key => key.availabilityState === PrivateKeyAvailabilityState.AVAILABLE);
    if (availableKeys[0]) {
      const mvPublicKey = SmartBuffer.ofHexString(REACT_APP_FEED_PUBLIC_KEY).bytes;

      const messageBytes = SmartBuffer.ofUTF8String(
        JSON.stringify({ address: account.account.address, timestamp: Date.now() }),
      ).bytes;

      return availableKeys[0].execute(
        async privateKey => ({
          messageEncrypted: new SmartBuffer(privateKey.encrypt(messageBytes, mvPublicKey)).toHexString(),
          publicKey: new SmartBuffer(privateKey.publicKey).toHexString(),
          address: account.account.address,
        }),
        // TODO: handle users with password
        // {
        // 	onPrivateKeyRequest: async (address: string, magicString: string) =>
        // 		await this.wallet.controller.signMagicString(this.account, magicString),
        // 	onYlidePasswordRequest: async _ => password,
        // },
      );
    }
    return null;
  }, [ keysRegistry ]);

  const connectAccount = useCallback(async() => {
    const wallet = await selectWalletModal.openWithPromise();
    if (!wallet) {
      return;
    }

    const account = await wallet.requestAuthentication();

    if (!account) {
      return;
    }

    if (savedAccounts.find((a) => a.account.address === account.address)) {
      return;
    }

    const remoteKeys = await ylide.core.getAddressKeys(account.address);

    const domainAccount = await accountModal.openWithPromise({
      wallet,
      account,
      remoteKeys: remoteKeys.remoteKeys,
    });

    if (!domainAccount) {
      return;
    }

    addAccount('New Account', domainAccount.account, domainAccount.wallet.wallet(), null);

    (async() => {
      const signature = await constructBackendAuthKeySignature(domainAccount);

      if (signature) {
        const key = await acquireBackendAuthKey(signature);
        if (key) {
          setAccountAuthKey(domainAccount.account, key);
        }
      }
    })();

    return domainAccount;
  }, [
    selectWalletModal, savedAccounts, ylide.core, accountModal, addAccount, constructBackendAuthKeySignature,
    acquireBackendAuthKey, setAccountAuthKey,
  ]);

  const disconnectAccount = useCallback(async(account: DomainAccount) => {
    const privateKeys = keysRegistry.getLocalPrivateKeys(account.account.address);
    for (const key of privateKeys) {
      await keysRegistry.removeLocalPrivateKey(key);
    }
    const currentAccount = await account.wallet.getAuthenticatedAccount();
    if (currentAccount && currentAccount.address === account.account.address) {
      await account.wallet.disconnectAccount(account.account);
    }
    if (account.wallet.wallet() === 'walletconnect') {
      disconnectWalletConnect();
    }
    deleteAccount(account.account);
  }, [ deleteAccount, keysRegistry, disconnectWalletConnect ]);

  // export async function activateAccount(params: { account: DomainAccount }) {
  //   const account = params.account;
  //   const wallet = account.wallet;
  //   const remoteKeys = await domain.ylide.core.getAddressKeys(account.account.address);
  //   const qqs = getQueryString();

  //   await showStaticComponent<DomainAccount>(resolve => (
  //     <NewPasswordModal
  //       faucetType={
  //         [ 'polygon', 'fantom', 'gnosis' ].includes(qqs.faucet) ?
  //           {
  //             polygon: EVMNetwork.POLYGON as const,
  //             fantom: EVMNetwork.FANTOM as const,
  //             gnosis: EVMNetwork.GNOSIS as const,
  //           }[qqs.faucet as 'polygon' | 'fantom' | 'gnosis'] :
  //           EVMNetwork.GNOSIS
  //       }
  //       bonus={ qqs.bonus === 'true' }
  //       wallet={ wallet }
  //       account={ account.account }
  //       remoteKeys={ remoteKeys.remoteKeys }
  //       onClose={ resolve }
  //     />
  //   ));
  // }

  return {
    initialized,
    selectWalletModal,
    accountModal,
    savedAccounts,
    domainAccounts,
    tokens,
    isAdmin,
    admins,
    disconnectAccount,
    connectAccount,
  };
};

const useBalances = (ylide: Ylide, accounts: Array<DomainAccount>) => {
  const [ balances, setBalances ] = useState<Record<string, Record<string, { original: string; numeric: number; e18: string }>>>({});

  const getBalanceOf = useCallback(async(address: string) => {
    const chains = ylide.controllers.blockchains;
    const balances: Array<{ original: string; numeric: number; e18: string }> = await Promise.all(
      chains.map(async chain => {
        try {
          return await new Promise((resolve, reject) => {
            chain.getBalance(address).then(resolve).catch(reject);
            setTimeout(reject, 3000);
          });
        } catch (err) {
          return {
            original: '0',
            numeric: 0,
            e18: '0',
          };
        }
      }),
    );
    return chains.reduce(
      (p, c, i) => ({
        ...p,
        [c.blockchain()]: balances[i],
      }),
      {} as Record<string, { original: string; numeric: number; e18: string }>,
    );
  }, [ ylide ]);

  useEffect(() => {
    (async() => {
      let isNew = false;
      const newBalances = await Promise.all(accounts.map(async(account) => {
        if (balances[account.account.address]) {
          return [ account.account.address, balances[account.account.address] ];
        } else {
          isNew = true;
          return [ account.account.address, await getBalanceOf(account.account.address) ];
        }
      }));
      if (isNew) {
        setBalances(Object.fromEntries(newBalances));
      }
    })();
  }, [ accounts, balances, getBalanceOf ]);

  return balances;
};

const useYlideService = () => {
  const keysRegistry = useMemo(() => new YlideKeysRegistry(new BrowserLocalStorage()), []);
  const ylide = useMemo(() => {
    const ylide = new Ylide(keysRegistry);
    ylide.add(evm);
    return ylide;
  }, [ keysRegistry ]);
  const faucet = useYlideFaucet(ylide, keysRegistry);

  const [ initialized, setInitialized ] = useState(false);
  const [ wallets, setWallets ] = useState<Array<AbstractWalletController>>([]);
  const walletConnectRegistry = useWalletConnectRegistry();
  const walletConnectState = useWalletConnectState(ylide, initialized, wallets, setWallets);
  const accounts = useAccountController(ylide, keysRegistry, wallets, initialized, walletConnectState.disconnectWalletConnect);
  const balances = useBalances(ylide, accounts.domainAccounts);
  const { addressesWithPushes, setAccountPushState } = useYlidePushes();

  const switchEVMChain = useCallback(async(wallet: AbstractWalletController, needNetwork: EVMNetwork) => {
    try {
      const bData = blockchainMeta[EVM_NAMES[needNetwork]];
      if (!walletConnectState.connection) {
        await (wallet as EVMWalletController).providerObject.request({
          method: 'wallet_addEthereumChain',
          params: [ bData.ethNetwork ],
        });
      }
    } catch (error) {
      // console.error('error: ', error);
    }
    if (walletConnectState.connection) {
      const wc = wallets.find(w => w.wallet() === 'walletconnect');
      if (wc) {
        await (wallet as EVMWalletController).signer.provider.send('wallet_switchEthereumChain', [
          { chainId: '0x' + Number(EVM_CHAINS[needNetwork]).toString(16) },
        ]);
      }
    } else {
      await (wallet as EVMWalletController).providerObject.request({
        method: 'wallet_switchEthereumChain',
        params: [ { chainId: '0x' + Number(EVM_CHAINS[needNetwork]).toString(16) } ], // chainId must be in hexadecimal numbers
      });
    }
  }, [ walletConnectState.connection, wallets ]);

  const switchEVMChainRef = React.useRef(switchEVMChain);

  useEffect(() => {
    switchEVMChainRef.current = switchEVMChain;
  }, [ switchEVMChain ]);

  const broadcastMessage = useCallback(async(account: DomainAccount, feedId: string, subject: string, content: YMF, blockchain?: string) => {
    const foundNetwork = Object.keys(EVM_NAMES).find(n => EVM_NAMES[Number(n) as EVMNetwork] === blockchain);
    let network: undefined | EVMNetwork = undefined;
    if (typeof foundNetwork !== 'undefined') {
      network = Number(foundNetwork) as EVMNetwork;
    }
    return await ylide.core.broadcastMessage({
      feedId: feedId as Uint256,
      wallet: account.wallet,
      sender: account.account,
      content: new MessageContentV5({
        subject: subject,
        content: content,
        attachments: [],
        extraBytes: new Uint8Array(0),
        extraJson: {},
        recipientInfos: [],
        sendingAgentName: 'Blockscout',
        sendingAgentVersion: stringToSemver('0.0.1'),
      }),
      serviceCode: 7,
    }, {
      isPersonal: false,
      isGenericFeed: true,
      network,
    });
  }, [ ylide ]);

  const sendMessage = useCallback(async(
    account: DomainAccount,
    recipients: Array<string>,
    feedId: string,
    subject: string,
    content: string,
    blockchain?: string,
  ) => {
    const foundNetwork = Object.keys(EVM_NAMES).find(n => EVM_NAMES[Number(n) as EVMNetwork] === blockchain);
    let network: undefined | EVMNetwork = undefined;
    if (typeof foundNetwork !== 'undefined') {
      network = Number(foundNetwork) as EVMNetwork;
    }
    return await ylide.core.sendMessage({
      feedId: feedId as Uint256,
      wallet: account.wallet,
      sender: account.account,
      content: MessageContentV5.simple(subject, content),
      recipients: recipients,
      serviceCode: 7,
    }, {
      isPersonal: false,
      isGenericFeed: true,
      network,
    });
  }, [ ylide ]);

  const decodeDirectMessage = useCallback(async(
    msgId: string,
    msg: IMessage,
    recipient: WalletAccount,
  ): Promise<IMessageDecodedContent | null> => {
    const content = await ylide.core.getMessageContent(msg);

    if (!content || content.corrupted) {
      return null;
    }

    try {
      const result = await ylide.core.decryptMessageContent(recipient, msg, content);

      return {
        msgId,
        decodedSubject: result.content.subject,
        decodedTextData:
          result.content.content instanceof YMF ?
            {
              type: MessageDecodedTextDataType.YMF,
              value: result.content.content,
            } :
            {
              type: MessageDecodedTextDataType.PLAIN,
              value: result.content.content,
            },
        attachments:
          result.content instanceof MessageContentV4 || result.content instanceof MessageContentV5 ?
            result.content.attachments :
            [],
        recipientInfos: result.content instanceof MessageContentV5 ? result.content.recipientInfos : [],
      };
    } catch (err) {
      return null;
    }
  }, [ ylide ]);

  const decodeBroadcastMessage = useCallback(async(
    msgId: string,
    msg: IMessage,
  ): Promise<IMessageDecodedContent | null> => {
    const content = await ylide.core.getMessageContent(msg);

    if (!content || content.corrupted) {
      return null;
    }

    const result = ylide.core.decryptBroadcastContent(msg, content);

    return {
      msgId,
      decodedSubject: result.content.subject,
      decodedTextData:
        result.content.content instanceof YMF ?
          {
            type: MessageDecodedTextDataType.YMF,
            value: result.content.content,
          } :
          {
            type: MessageDecodedTextDataType.PLAIN,
            value: result.content.content,
          },
      attachments:
        result.content instanceof MessageContentV4 || result.content instanceof MessageContentV5 ?
          result.content.attachments :
          [],
      recipientInfos: result.content instanceof MessageContentV5 ? result.content.recipientInfos : [],
    };
  }, [ ylide ]);

  useEffect(() => {
    const f = async() => {
      await ensurePageLoaded;
      await ylide.init();
      ylide.registerWalletFactory(evmWalletFactories.walletconnect);
      setWallets(ylide.controllers.wallets);
      setInitialized(true);
    };
    f();
  }, [ ylide, keysRegistry ]);

  useEffect(() => {
    wallets.forEach(w => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      w.onNetworkSwitchRequest = async(
        reason: string,
        currentNetwork: EVMNetwork | undefined,
        needNetwork: EVMNetwork,
      ) => {
        switchEVMChainRef.current(w, needNetwork);
      };
    });
  }, [ wallets ]);

  return {
    ylide,
    keysRegistry,
    wallets,
    initialized,
    walletConnectRegistry,
    walletConnectState,
    accounts,
    faucet,
    balances,
    addressesWithPushes,
    setAccountPushState,
    broadcastMessage,
    sendMessage,
    decodeBroadcastMessage,
    decodeDirectMessage,
  };
};

export function YlideProvider({ children }: { children?: ReactNode | undefined }) {
  return (
    <YlideContext.Provider value={ useYlideService() }>
      { children }
    </YlideContext.Provider>
  );
}

export function useYlide() {
  return useContext(YlideContext);
}

import { evm } from '@ylide/ethereum';
import type { AbstractWalletController, Uint256 } from '@ylide/sdk';
import { BrowserLocalStorage, MessageContentV5, Ylide, YlideKeysRegistry } from '@ylide/sdk';
import { SmartBuffer } from '@ylide/smart-buffer';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

import type { DomainAccount, IAppRegistry } from './types';

import ForumPersonalApi from 'lib/api/ylideApi/ForumPersonalApi';
import ForumPublicApi from 'lib/api/ylideApi/ForumPublicApi';
import { ensurePageLoaded } from 'lib/ensurePageLoaded';

import { useYlideAccountModal, useYlideSelectWalletModal } from './modals';
import { useYlideAccounts } from './useYlideAccounts';
import { useYlideFaucet } from './useYlideFaucet';

const YlideContext = createContext(undefined as unknown as ReturnType<typeof useYlideService>);

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

const useAccountController = (ylide: Ylide, keysRegistry: YlideKeysRegistry, wallets: Array<AbstractWalletController>, ylideInitialized: boolean) => {
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
    if (localPrivateKeys[0]) {
      const mvPublicKey = SmartBuffer.ofHexString(REACT_APP_FEED_PUBLIC_KEY).bytes;

      const messageBytes = SmartBuffer.ofUTF8String(
        JSON.stringify({ address: account.account.address, timestamp: Date.now() }),
      ).bytes;

      return localPrivateKeys[0].execute(
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
    deleteAccount(account.account);
  }, [ deleteAccount, keysRegistry ]);

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
  const accounts = useAccountController(ylide, keysRegistry, wallets, initialized);

  const broadcastMessage = useCallback(async(account: DomainAccount, feedId: string, subject: string, content: string) => {
    return await ylide.core.broadcastMessage({
      feedId: feedId as Uint256,
      wallet: account.wallet,
      sender: account.account,
      content: MessageContentV5.simple(subject, content),
      serviceCode: 7,
    }, {
      isPersonal: false,
      isGenericFeed: true,
    });
  }, [ ylide ]);

  useEffect(() => {
    const f = async() => {
      await ensurePageLoaded;
      await ylide.init();
      setWallets(ylide.controllers.wallets);
      setInitialized(true);
    };
    f();
  }, [ ylide, keysRegistry ]);

  return {
    ylide,
    keysRegistry,
    wallets,
    initialized,
    walletConnectRegistry,
    accounts,
    faucet,
    broadcastMessage,
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

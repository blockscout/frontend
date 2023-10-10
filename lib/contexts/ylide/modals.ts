import { useDisclosure } from '@chakra-ui/react';
import type { AbstractWalletController, WalletAccount } from '@ylide/sdk';
import { useCallback, useState } from 'react';

import type { DomainAccount } from './types';

import type { YlideConnectAccountModalProps } from 'ui/connectAccountModal';
import type { SelectWalletModalProps } from 'ui/selectWalletModal';

export const useYlideSelectWalletModal = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [ props, setProps ] = useState<SelectWalletModalProps>({});

  const triggerOpen = useCallback((props: SelectWalletModalProps) => {
    setProps({
      onClose: (w?: AbstractWalletController) => {
        onClose();
        props.onClose?.(w);
      },
    });
    onOpen();
  }, [ onOpen, onClose ]);

  const triggerClose = useCallback(() => {
    props.onClose?.();
    onClose();
  }, [ onClose, props ]);

  return {
    props,
    open: triggerOpen,
    openWithPromise: () => new Promise<AbstractWalletController | undefined>(resolve => triggerOpen({ onClose: resolve })),
    close: triggerClose,
    isOpen,
  };
};

export const useYlideAccountModal = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [ props, setProps ] = useState<YlideConnectAccountModalProps>({
    wallet: null as unknown as AbstractWalletController,
    account: null as unknown as WalletAccount,
    remoteKeys: {},
  });

  const triggerOpen = useCallback((props: YlideConnectAccountModalProps) => {
    setProps({
      ...props,
      onClose: (w?: DomainAccount) => {
        onClose();
        props.onClose?.(w);
      },
    });
    onOpen();
  }, [ onOpen, onClose ]);

  const triggerClose = useCallback(() => {
    props.onClose?.();
    onClose();
  }, [ onClose, props ]);

  return {
    open: triggerOpen,
    openWithPromise: (props: Omit<YlideConnectAccountModalProps, 'onClose'>) =>
      new Promise<DomainAccount | undefined>(resolve => triggerOpen({ ...props, onClose: resolve })),
    close: triggerClose,
    props,
    isOpen,
  };
};

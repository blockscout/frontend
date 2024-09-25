import { useBoolean } from '@chakra-ui/react';
import React, { createContext, useContext, useMemo } from 'react';

type Props = {
  children: React.ReactNode;
}

type TRewardsContext = {
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const RewardsContext = createContext<TRewardsContext>({
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
});

export function RewardsContextProvider({ children }: Props) {
  const [ isLoginModalOpen, setIsLoginModalOpen ] = useBoolean(false);

  const value = useMemo(() => ({
    isLoginModalOpen,
    openLoginModal: setIsLoginModalOpen.on,
    closeLoginModal: setIsLoginModalOpen.off,
  }), [ isLoginModalOpen, setIsLoginModalOpen ]);

  return (
    <RewardsContext.Provider value={ value }>
      { children }
    </RewardsContext.Provider>
  );
}

export function useRewardsContext() {
  return useContext(RewardsContext);
}

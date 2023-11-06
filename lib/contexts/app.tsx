import React, { createContext, useContext } from 'react';

import type { Props as PageProps } from 'nextjs/getServerSideProps';

type Props = {
  children: React.ReactNode;
  pageProps: PageProps;
}

const AppContext = createContext<PageProps>({
  cookies: '',
  referrer: '',
  id: '',
  height_or_hash: '',
  hash: '',
  number: '',
  q: '',
});

export function AppContextProvider({ children, pageProps }: Props) {
  return (
    <AppContext.Provider value={ pageProps }>
      { children }
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}

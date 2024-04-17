import React, { createContext, useContext } from 'react';

import type { Props as PageProps } from 'nextjs/getServerSideProps';

type Props = {
  children: React.ReactNode;
  pageProps: PageProps;
}

const AppContext = createContext<PageProps>({
  cookies: '',
  referrer: '',
  query: {},
  adBannerProvider: undefined,
  apiData: null,
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

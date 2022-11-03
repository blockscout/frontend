import React, { createContext, useContext } from 'react';

import type { Props as PageProps } from 'lib/next/getServerSideProps';

type Props = {
  children: React.ReactNode;
  pageProps: PageProps;
}

const AppContext = createContext<PageProps>({ cookies: '' });

export function AppWrapper({ children, pageProps }: Props) {
  const appProps = { cookies: pageProps.cookies };

  return (
    <AppContext.Provider value={ appProps }>
      { children }
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}

import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface PageContextType {
  title: string;
  setTitle: (title: string) => void;
}

const defaultPageContext: PageContextType = {
  title: 'Default',
  setTitle: () => {},
};

export const PageContext = React.createContext<PageContextType>(defaultPageContext);

export const PageProvider = ({ children }: Props) => {
  const [ title, setTitle ] = React.useState<string>('');

  return (
    <PageContext.Provider value={{ title, setTitle }}>
      { children }
    </PageContext.Provider>
  );
};

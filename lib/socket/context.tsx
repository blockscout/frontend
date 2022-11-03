import type { SocketConnectOption } from 'phoenix';
import { Socket } from 'phoenix';
import React, { useEffect, useState } from 'react';

export const SocketContext = React.createContext<Socket | null>(null);

interface SocketProviderProps {
  children: React.ReactNode;
  url: string;
  options?: Partial<SocketConnectOption>;
}

export function SocketProvider({ children, options, url }: SocketProviderProps) {
  const [ socket, setSocket ] = useState<Socket | null>(null);

  useEffect(() => {
    const s = new Socket(url, options);
    s.connect();
    setSocket(s);

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [ options, url ]);

  return (
    <SocketContext.Provider value={ socket }>
      { children }
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = React.useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useCount must be used within a SocketProvider');
  }
  return context;
}

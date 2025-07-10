// https://hexdocs.pm/phoenix/js/
import type { Channel, SocketConnectOption } from 'phoenix';
import { Socket } from 'phoenix';
import React, { useEffect, useState } from 'react';

type ChannelRegistry = Record<string, { channel: Channel; subscribers: number }>;

export const SocketContext = React.createContext<{
  socket: Socket | null;
  channelRegistry: React.MutableRefObject<ChannelRegistry>;
} | null>(null);

interface SocketProviderProps {
  children: React.ReactNode;
  url?: string;
  options?: Partial<SocketConnectOption>;
}

export function SocketProvider({ children, options, url }: SocketProviderProps) {
  const [ socket, setSocket ] = useState<Socket | null>(null);
  const channelRegistry = React.useRef<ChannelRegistry>({});

  useEffect(() => {
    if (!url) {
      return;
    }

    const socketInstance = new Socket(url, options);
    socketInstance.connect();
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [ options, url ]);

  const value = React.useMemo(() => ({
    socket,
    channelRegistry,
  }), [ socket, channelRegistry ]);

  return (
    <SocketContext.Provider value={ value }>
      { children }
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = React.useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

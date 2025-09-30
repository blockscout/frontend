/* eslint-disable no-console */
import React from 'react';

import type { FlashblockItem } from 'types/client/flashblocks';

import config from 'configs/app';

import formatFlashblockItem from './formatFlashblockItem';
import parseSocketEventData from './parseSocketEventData';

const flashblocksFeature = config.features.flashblocks;

const MAX_FLASHBLOCKS_COUNT = 50;

type Status = 'initial' | 'connected' | 'disconnected' | 'error';

export default function useFlashblocksSocketData() {
  const websocketRef = React.useRef<WebSocket | null>(null);
  const isPausedRef = React.useRef(false);
  const isInitialConnect = React.useRef(true);

  const [ items, setItems ] = React.useState<Array<FlashblockItem>>([]);
  const [ itemsNum, setItemsNum ] = React.useState(0);
  const [ newItemsNum, setNewItemsNum ] = React.useState<number | undefined>(undefined);
  const [ txsNum, setTxsNum ] = React.useState(0);
  const [ initialTs, setInitialTs ] = React.useState<number | undefined>(undefined);
  const [ status, setStatus ] = React.useState<Status>('initial');

  const connect = React.useCallback(() => {
    if (isInitialConnect.current) {
      isInitialConnect.current = false;

      // skip first mount in dev mode
      if (config.app.isDev) {
        return;
      }
    }

    if (!flashblocksFeature.isEnabled) {
      return;
    }

    if (window.document.hidden) {
      console.log('Tab has lost focus. Socket re-connect is disabled.');
      setStatus('disconnected');
      return;
    }

    websocketRef.current = new WebSocket(flashblocksFeature.socketUrl);

    websocketRef.current.onmessage = async(event) => {
      const newFlashBlock = await parseSocketEventData(event);
      if (newFlashBlock) {
        const newItem = formatFlashblockItem(newFlashBlock);
        if (isPausedRef.current) {
          setNewItemsNum((prev) => (prev ?? 0) + 1);
        } else {
          setItems((prev) => {
            return [ newItem, ...prev ].slice(0, MAX_FLASHBLOCKS_COUNT);
          });
        }
        setItemsNum((prev) => prev + 1);
        setTxsNum((prev) => prev + newItem.transactions_count);
      }
    };
    websocketRef.current.onopen = () => {
      setStatus('connected');
      setInitialTs((prev) => prev ?? Date.now());
      console.log('Connected to the socket server.');
    };
    websocketRef.current.onerror = (error) => {
      setStatus('error');
      console.error('Error connecting to socket', error);
    };
    websocketRef.current.onclose = (event) => {
      if (event.code !== 4000) {
        console.log('Received close event from the socket server. Re-connecting...');
        connect();
      } else {
        console.log('Received close event. Disconnecting...');
        setStatus('disconnected');
      }
    };
  }, []);

  const pause = React.useCallback(() => {
    isPausedRef.current = true;
    setNewItemsNum(0);
  }, []);

  const resume = React.useCallback(() => {
    isPausedRef.current = false;
    setNewItemsNum(undefined);
  }, []);

  React.useEffect(() => {
    connect();
    return () => {
      websocketRef.current?.close(4000, 'Component unmounted');
    };
  }, [ connect ]);

  return React.useMemo(() => ({
    items,
    pause,
    resume,
    itemsNum,
    newItemsNum,
    initialTs,
    txsNum,
    status,
  }), [ items, pause, resume, itemsNum, newItemsNum, initialTs, txsNum, status ]);
}

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

  const [ items, setItems ] = React.useState<Array<FlashblockItem>>([]);
  const [ itemsNum, setItemsNum ] = React.useState(0);
  const [ newItemsNum, setNewItemsNum ] = React.useState<number | undefined>(undefined);
  const [ txsNum, setTxsNum ] = React.useState(0);
  const [ initialTs, setInitialTs ] = React.useState<number | undefined>(undefined);
  const [ status, setStatus ] = React.useState<Status>('initial');

  const connect = React.useCallback(() => {
    if (!flashblocksFeature.isEnabled) {
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
      setInitialTs(Date.now());
    };
    websocketRef.current.onerror = () => {
      setStatus('error');
    };
    websocketRef.current.onclose = () => {
      setStatus('disconnected');
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
      websocketRef.current?.close();
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

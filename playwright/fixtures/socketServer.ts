import type { TestFixture } from '@playwright/test';
import type { WebSocket } from 'ws';
import { WebSocketServer } from 'ws';

import type { AddressCoinBalancePayload } from 'lib/socket/types';
import type { NewBlockSocketResponse } from 'types/api/block';

type ReturnType = () => Promise<WebSocket>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ArgsType = any;

type Channel = [string, string, string];

export interface SocketServerFixture {
  createSocket: ReturnType;
}

export const PORT = 3200;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createSocket: TestFixture<ReturnType, ArgsType> = async({ page }, use) => {
  const socketServer = new WebSocketServer({ port: PORT });

  const connectionPromise = new Promise<WebSocket>((resolve) => {
    socketServer.on('connection', (socket: WebSocket) => {
      resolve(socket);
    });
  });

  await use(() => connectionPromise);

  socketServer.close();
};

export const joinChannel = async(socket: WebSocket, channelName: string) => {
  return new Promise<[string, string, string]>((resolve, reject) => {
    socket.on('message', (msg) => {
      try {
        const payload: Array<string> = JSON.parse(msg.toString());

        if (channelName === payload[2] && payload[3] === 'phx_join') {
          socket.send(JSON.stringify([
            payload[0],
            payload[1],
            payload[2],
            'phx_reply',
            { response: {}, status: 'ok' },
          ]));

          resolve([ payload[0], payload[1], payload[2] ]);
        }
      } catch (error) {
        reject(error);
      }
    });
  });
};

export function sendMessage(socket: WebSocket, channel: Channel, msg: 'coin_balance', payload: AddressCoinBalancePayload): void;
export function sendMessage(socket: WebSocket, channel: Channel, msg: 'token_balance', payload: { block_number: number }): void;
export function sendMessage(socket: WebSocket, channel: Channel, msg: 'transaction', payload: { transaction: number }): void;
export function sendMessage(socket: WebSocket, channel: Channel, msg: 'pending_transaction', payload: { pending_transaction: number }): void;
export function sendMessage(socket: WebSocket, channel: Channel, msg: 'new_block', payload: NewBlockSocketResponse): void;
export function sendMessage(socket: WebSocket, channel: Channel, msg: string, payload: unknown): void {
  socket.send(JSON.stringify([
    ...channel,
    msg,
    payload,
  ]));
}

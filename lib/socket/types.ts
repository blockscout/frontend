export type SocketData = [ null, null, string, string, Record<string, unknown> ];

export interface SocketChannelSubscriber {
  filters?: Array<string>;
  onMessage: (payload: unknown) => void;
}

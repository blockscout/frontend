import brotliPromise from 'brotli-dec-wasm';

import type { FlashblockItemApi } from 'types/api/flashblocks';

export default async function parseSocketEventData(event: MessageEvent) {
  try {
    const brotli = await brotliPromise;
    const textData = await event.data.text();
    if (textData.trim().startsWith('{')) {
      return JSON.parse(textData) as FlashblockItemApi;
    } else {
      const arrayBuffer = await event.data.arrayBuffer();
      const u8Data = new Uint8Array(arrayBuffer);
      const decompressedData = Buffer.from(brotli.decompress(u8Data)).toString('utf-8');
      return JSON.parse(decompressedData) as FlashblockItemApi;
    }
  } catch (error) {
    return;
  }
}

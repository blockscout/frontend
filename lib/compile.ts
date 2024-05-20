/* eslint-disable @typescript-eslint/no-explicit-any */
import { rlp } from 'ethereumjs-util';
import UUID from 'uuid-int';

const stringToUnit8Array = (str: string) => {
  return new Uint8Array(Buffer.from(str, 'utf-8'));
};

const hexStringToUint8Array = (hex: string) => {
  if (!hex) {
    return new Uint8Array(0);
  }

  if (hex.startsWith('0x')) {
    hex = hex.slice(2);
  }
  return new Uint8Array(Buffer.from(hex, 'hex'));
};

const base64ToUint8Array = (base64: string) => {
  return new Uint8Array(Buffer.from(base64, 'base64'));
};

const unit8ArrayToHexStringWithout0x = (unit8Array: Uint8Array) => {
  return Buffer.from(unit8Array).toString('hex');
};
class Transaction {
  version?: number;
  fee_option?: number;
  uuid?: number;
  gas_price?: number;
  gas_limit?: number;
  to_addr?: Uint8Array;
  value?: number;
  data?: Uint8Array;
  from_addr?: Uint8Array;
  signature?: Uint8Array;

  constructor(txn?: Transaction) {
    this.version = txn?.version ?? 0;
    this.fee_option = txn?.fee_option ?? 0;
    this.uuid = txn?.uuid ?? 0;
    this.gas_price = txn?.gas_price ?? 0;
    this.gas_limit = txn?.gas_limit ?? 0;
    this.to_addr = txn?.to_addr ?? new Uint8Array(0);
    this.value = txn?.value ?? 0;
    this.data = txn?.data ?? new Uint8Array(0);
    this.from_addr = txn?.from_addr ?? new Uint8Array(0);
    this.signature = txn?.signature ?? new Uint8Array(0);
  }

  RLPSERIALIZE(): Uint8Array {
    const res: Array<number> = [];
    const versionBytes = new Uint8Array(
      new BigUint64Array([ BigInt(this.version!) ]).buffer,
    );
    for (let i = 0; i < versionBytes.length; i++) {
      res.push(versionBytes[i]);
    }
    const encoded = rlp.encode([
      this.fee_option!,
      this.uuid!,
      this.gas_price!,
      this.gas_limit!,
      this.to_addr!,
      this.value!,
      this.data!,
      this.from_addr!,
      this.signature!,
    ]);
    for (let i = 0; i < encoded.length; i++) {
      res.push(encoded[i]);
    }
    return new Uint8Array(res);
  }
}
type Props = {
  byteCode: string;
};

const hashEncodingHandler = async({ byteCode }: Props) => {
  const id = 0;
  const generator = UUID(id);
  const uuid = generator.uuid();

  const initialPayload = new Transaction();

  initialPayload.uuid = uuid;
  initialPayload.version = 0;
  initialPayload.fee_option = 0;
  initialPayload.gas_price = 0;
  initialPayload.gas_limit = 0x30000000;
  initialPayload.to_addr = stringToUnit8Array('bc1qd7kqgm7atn8c9j02fc5vl4hdmw6ns85c000000');
  initialPayload.value = 0;
  initialPayload.data = hexStringToUint8Array(byteCode);
  initialPayload.from_addr = stringToUnit8Array(localStorage.getItem('address') || '');
  initialPayload.signature = base64ToUint8Array('');

  const compilePayload = initialPayload;

  try {
    const encodedMessage = initialPayload.RLPSERIALIZE();
    const hexStringEncodedMessage =
      unit8ArrayToHexStringWithout0x(encodedMessage);
    if (!(window as any)?.unisat) {
      return;
    }
    const signature = await (window as any)?.unisat?.signMessage(
      `0x${ hexStringEncodedMessage }`,
    );
    compilePayload.signature = base64ToUint8Array(btoa(signature));
    const rlpEncodedDataWithSignature = compilePayload.RLPSERIALIZE();
    const newEncodedDataString =
      'sach0x' + unit8ArrayToHexStringWithout0x(rlpEncodedDataWithSignature);
    return newEncodedDataString;
    //   setCompileEncodedData(newEncodedDataString);
    //   setFileList([
    //     {
    //       filename: newEncodedDataString.slice(0, 64),
    //       dataURL: `data:text/plain;charset=utf-8;base64,${stringToBase64(
    //         newEncodedDataString
    //       )}`,
    //       size: getStringByteCount(newEncodedDataString),
    //     },
    //   ]);
  } catch (error: any) {
    return error;
  }
};

export default hashEncodingHandler;

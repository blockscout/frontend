declare function wabtInit(): Promise<WabtModule>;

interface WabtModule {
  readWasm(buffer: Uint8Array, options: { readDebugNames: boolean }): WabtModuleInstance;
}

interface WabtModuleInstance {
  applyNames(): void;
  toText(options: { foldExprs: boolean }): string;
  destroy(): void;
}

export default wabtInit;

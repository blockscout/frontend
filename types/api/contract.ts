export interface SmartContract {
  deployed_bytecode: string | null;
  creation_bytecode: string | null;
  is_self_destructed: boolean;
}

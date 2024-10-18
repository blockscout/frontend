export const CONTRACT_MAIN_TAB_IDS = [
  'contract_code',
  'read_contract',
  'read_contract_rpc',
  'read_proxy',
  'read_custom_methods',
  'write_contract',
  'write_contract_rpc',
  'write_proxy',
  'write_custom_methods',
  'mud_system',
] as const;

export const CONTRACT_DETAILS_TAB_IDS = [
  'contract_source_code',
  'contract_compiler',
  'contract_abi',
  'contract_bytecode',
] as const;

export const CONTRACT_TAB_IDS = (CONTRACT_MAIN_TAB_IDS as unknown as Array<string>).concat(CONTRACT_DETAILS_TAB_IDS as unknown as Array<string>);

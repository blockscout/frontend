/* eslint-disable @typescript-eslint/no-explicit-any */
type FetchInscriptionRequest = {
  inscriptionId: string;
};
type ContractRequest = {
  contractHash: string;
  addressHash?: string;
  raw_code?: Record<string, any>;
};

export async function checkContract(req: ContractRequest) {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(
    `https://api.satschain.xyz/bapi/sats/contract/check?contract_hash=${ req?.contractHash }&inscription_id=${ req?.addressHash }`,
    requestOptions,
  );
}
export async function fetchInscriptionService(req: FetchInscriptionRequest) {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const isOnTestnet = localStorage.getItem('satschainOnTestnet');
  if (isOnTestnet === 'true') {
    return fetch(
      `https://static-testnet.unisat.io/content/${ req?.inscriptionId }`,
      requestOptions,
    );
  }
  return fetch(
    `https://api.hiro.so/ordinals/v1/inscriptions/${ req?.inscriptionId }/content`,
    requestOptions,
  );
}

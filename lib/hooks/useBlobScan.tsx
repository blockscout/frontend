interface Props {
  address: string | undefined;
}

const blobScanNetworks = [
  {
    address: '0x2BC885e26A3947646FAbb96C68cE82f5937038a7',
  },
];

export function useBlobScan({ address }: Props) {
  const isBlobScanNetwork = blobScanNetworks.some(
    (network) => network.address === address,
  );

  return isBlobScanNetwork;
}

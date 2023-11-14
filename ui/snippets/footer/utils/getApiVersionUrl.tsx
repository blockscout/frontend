export default function getApiVersionUrl(version: string | undefined): string | undefined {
  if (!version) {
    return;
  }

  return `https://github.com/lukso-network/network-explorer-execution/tree/lukso`;
}

export default function getApiVersionUrl(version: string | undefined): string | undefined {
  if (!version) {
    return;
  }

  const [ tag, commit ] = version.split('.+commit.');

  if (commit) {
    return `https://github.com/lukso-network/network-explorer-execution/tree/lukso`;
  }

  return `https://github.com/lukso-network/network-explorer-execution/tree/lukso`;
}

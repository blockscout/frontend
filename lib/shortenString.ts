export default function shortenString(string: string | null, charNumber = 8) {
  if (!string) {
    return '';
  }

  if (string.length <= charNumber - 1) {
    return string;
  }

  return string.slice(0, charNumber - 4) + '...' + string.slice(-4);
}

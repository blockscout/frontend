export default function shortenUniversalProfile(string: string | null) {
  if (!string) {
    return '';
  }

  if (string.length <= 7) {
    return string;
  }

  const upParts = string.split(' (');
  const hashHead = '#' + upParts[1].slice(2, 6); // change (0x1234) -> #1234

  return string.slice(0, 2) + '...' + hashHead;
}

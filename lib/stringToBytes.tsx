export default function stringToBytes(str: string) {
  const utf8Encode = new TextEncoder();
  return utf8Encode.encode(str);
}

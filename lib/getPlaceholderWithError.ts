export default function getPlaceholderWithError(text: string, errorText?: string) {
  return `${ text }${ errorText ? ' - ' + errorText : '' }`;
}

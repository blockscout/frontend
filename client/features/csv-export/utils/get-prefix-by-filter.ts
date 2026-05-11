export default function getPrefixByFilter(filterType?: string, filterValue?: string): string {
  if (filterType === 'address') {
    if (filterValue === 'from') {
      return 'outgoing';
    }
    if (filterValue === 'to') {
      return 'incoming';
    }
  }
  return '';
}

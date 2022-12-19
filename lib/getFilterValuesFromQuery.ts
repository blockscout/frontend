export default function getFilterValue<FilterType>(filterValues: ReadonlyArray<FilterType>, val: string | Array<string> | undefined) {
  const valArray = [];
  if (typeof val === 'string') {
    valArray.push(...val.split(','));
  }
  if (Array.isArray(val)) {
    val.forEach(el => valArray.push(...el.split(',')));
  }

  return valArray.filter(el => filterValues.includes(el as unknown as FilterType)) as unknown as Array<FilterType>;
}

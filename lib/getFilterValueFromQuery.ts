export default function getFilterValue<FilterType>(filterValues: ReadonlyArray<FilterType>, val: string | Array<string> | undefined) {
  if (typeof val === 'string' && filterValues.includes(val as unknown as FilterType)) {
    return val as unknown as FilterType;
  }
}

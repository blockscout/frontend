export default function getNextSortValue<SortField extends string, Sort extends string>(
  sortSequence: Record<SortField, Array<Sort| undefined>>, field: SortField,
) {
  return (prevValue: Sort | undefined) => {
    const sequence = sortSequence[field];
    const curIndex = sequence.findIndex((sort) => sort === prevValue);
    const nextIndex = curIndex + 1 > sequence.length - 1 ? 0 : curIndex + 1;
    return sequence[nextIndex];
  };
}

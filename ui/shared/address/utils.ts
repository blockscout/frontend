export type TxCourseType = 'in' | 'out' | 'self' | 'unspecified';

export function getTxCourseType(from: string, to: string | undefined, current?: string): TxCourseType {
  if (current === undefined) {
    return 'unspecified';
  }

  if (to && from === to && from === current) {
    return 'self';
  }

  if (from === current) {
    return 'out';
  }

  if (to && to === current) {
    return 'in';
  }

  return 'unspecified';
}

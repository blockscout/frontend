export type CeloBlockLayer = 'L1' | 'L2';

export function getCeloBlockLayer(number: number, l2MigrationBlock: number | undefined): CeloBlockLayer | undefined {
  if (!l2MigrationBlock) {
    return;
  }

  if (number <= l2MigrationBlock) {
    return 'L1';
  }

  return 'L2';
}

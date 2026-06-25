// SPDX-License-Identifier: LicenseRef-Blockscout

export default async function runParallelBatches<Item, Result>(
  items: Array<Item>,
  batchSize: number,
  worker: (item: Item, index: number) => Promise<Result>,
): Promise<Array<Result>> {
  if (!Number.isInteger(batchSize) || batchSize <= 0) {
    throw new RangeError('batchSize must be a positive integer');
  }

  const results: Array<Result> = [];

  for (let index = 0; index < items.length; index += batchSize) {
    const batch = items.slice(index, index + batchSize);
    const batchResults = await Promise.all(
      batch.map((item, batchIndex) => worker(item, index + batchIndex)),
    );

    results.push(...batchResults);
  }

  return results;
}

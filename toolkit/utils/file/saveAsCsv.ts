import { unparse } from 'papaparse';

import downloadBlob from './downloadBlob';

export default function saveAsCsv(headerRows: Array<string>, dataRows: Array<Array<string>>, filename: string) {
  const csv = unparse([
    headerRows,
    ...dataRows,
  ]);

  const blob = new Blob([ csv ], { type: 'text/csv;charset=utf-8;' });

  downloadBlob(blob, filename);
}

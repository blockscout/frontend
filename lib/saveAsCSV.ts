import { unparse } from 'papaparse';

import downloadBlob from 'lib/downloadBlob';

export default function saveAsCSV(headerRows: Array<string>, dataRows: Array<Array<string>>, filename: string) {
  const csv = unparse([
    headerRows,
    ...dataRows,
  ]);

  const blob = new Blob([ csv ], { type: 'text/csv;charset=utf-8;' });

  downloadBlob(blob, filename);
}

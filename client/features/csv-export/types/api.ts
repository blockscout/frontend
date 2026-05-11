export type CsvExportItemStatus = 'pending' | 'completed' | 'failed';

export interface CsvExportItemResponse {
  file_id: string | null;
  status: CsvExportItemStatus;
  expires_at: string | null;
}

export interface CsvExportDownloadResponse {
  request_id: string;
}

export interface CsvExportConfig {
  limit: number;
  async_enabled: boolean;
}

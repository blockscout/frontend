export interface FormFields {
  requesterName: string;
  requesterEmail: string;
  addresses: Array<{ hash: string }>;
  description: string;
}

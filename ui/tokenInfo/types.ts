import type { Option } from 'ui/shared/FancySelect/types';

export interface Fields {
  address: string;
  requester_name: string;
  requester_email: string;
  project_name?: string;
  project_sector: Option | null;
  project_email: string;
  project_website: string;
  project_description: string;
  docs?: string;
  support?: string;
  icon_url: string;
}

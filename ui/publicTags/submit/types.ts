import type { AddressMetadataTagType } from 'types/api/addressMetadata';
import type { Option } from 'ui/shared/forms/inputs/select/types';

export interface FormFields {
  requesterName: string;
  requesterEmail: string;
  companyName: string | undefined;
  companyWebsite: string | undefined;
  addresses: Array<{ hash: string }>;
  tags: Array<FormFieldTag>;
  description: string | undefined;
  reCaptcha: string;
}

export interface FormFieldTag {
  name: string;
  type: Option<AddressMetadataTagType>;
  url: string | undefined;
  bgColor: string | undefined;
  textColor: string | undefined;
  tooltipDescription: string | undefined;
}

export interface SubmitRequestBody {
  requesterName: string;
  requesterEmail: string;
  companyName?: string;
  companyWebsite?: string;
  address: string;
  name: string;
  tagType: AddressMetadataTagType;
  description?: string;
  meta: {
    bgColor?: string;
    textColor?: string;
    tagUrl?: string;
    tooltipDescription?: string;
  };
}

export interface FormSubmitResultItem {
  error: string | null;
  payload: SubmitRequestBody;
}

export type FormSubmitResult = Array<FormSubmitResultItem>;

export interface FormSubmitResultGrouped {
  requesterName: string;
  requesterEmail: string;
  companyName?: string;
  companyWebsite?: string;
  items: Array<FormSubmitResultItemGrouped>;
}

export interface FormSubmitResultItemGrouped {
  error: string | null;
  addresses: Array<string>;
  tags: Array<Pick<SubmitRequestBody, 'name' | 'tagType' | 'meta'>>;
}

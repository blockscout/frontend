export interface TalbeListType {
  txnHash?: string;
  Block?: string;
  Age?: string;
  Type?: string;
  objectSize?: string;
  Visibility?: string;
  lastTime?: string;
  Creator?: string;
  'Object Name'?: string;
  'Group Name'?: string;
  'Group ID'?: string;
  'Last Updated'?: string;
  'Bucket'?: string;
  'Bucket Name'?: string;
  'Active Group Member Count'?: string;
  Owner?: string;
}
export interface ObjetTalbeListType {
  id: string;
  'Object Name': string;
  Type: string;
  'Object Size': string;
  Status: string;
  Visibility: string;
  'Last Updated Time': string;
  Bucket: string;
  Creator: string;
}
export interface ObjectDetailsOverviewType {
  'Object Name': string;
  'Object Tags': string;
  'Object ID': string;
  'Object No.': string;
  Type: string;
  'Object Size': string;
  'Object Status': string;
  Deleted: string;
}

export interface ObjetRequestType {
  id: string;
  object_name: string;
  bucket_name: string;
  owner: string;
  creator: string;
  payload_size: number;
  visibility: string;
  content_type: string;
  object_status: string;
  redundancy_type: string;
  source_type: string;
  checksums: string;
  create_at: string;
  local_virtual_group_id: number;
  height: number;
  tags: string;
  is_updating: boolean;
  updated_at: string;
  updated_by: string;
  version: number;
}

export interface GroupTalbeListType {
  'Group Name': string;
  'Group ID': string;
  'Last Updated': string;
  'Active Group Member Count': string;
  Owner: string;
}

export interface GroupRequestType {
  id: string;
  group_name: string;
  source_type: string;
  owner: string;
  height: string;
}
export interface BucketTalbeListType {
  'Bucket Name': string;
  'Bucket ID': string;
  'Last Updated Time': string;
  Status: string;
  'Active Objects Count': string;
  Creator: string;
}

export interface BucketRequestType {
  'bucket_name': string;
  'id': string;
  'create_at': string;
  'bucket_status': string;
  'tags': string;
  'owner': string;
}

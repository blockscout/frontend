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
  Bucket?: string;
  'Bucket Name'?: string;
  'Active Group Member Count'?: string;
  Owner?: string;
  Status?: string;
  'Object Size'?: string;
  'Last Updated Time'?: string;
  id?: string;
  'Credential ID'?: string;
  'Txn hash'?: string;
  'From/To'?: [ string, string ];
  Time?: string;
  'Value MOCA'?: string;
  'Fee MOCA'?: string;
  Method?: string;
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
  // 'Object No.': string;
  Type: string;
  'Object Size': string;
  'Object Status': string;
  Deleted: string;
}

export interface ObjetRequestType {
  object_id: string;
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
  update_time: string;
  status: string;
  creator_address: string;
}

export interface GroupTalbeListType {
  id: string;
  'Group Name': string;
  'Group ID': string;
  'Last Updated': string;
  // 'Active Group Member Count': string;
  Owner: string;
}

export interface GroupRequestType {
  group_id: string;
  group_name: string;
  update_at: string;
  active_member_count: {
    aggregate: {
      count: string;
    };
  };
  owner_address: string;
}
export interface BucketTalbeListType {
  id: string;
  'Bucket Name': string;
  'Bucket ID': string;
  'Last Updated Time': string;
  Status: string;
  'Active Objects Count': string;
  Creator: string;
}

export interface BucketRequestType {
  bucket_name: string;
  bucket_id: string;
  update_time: string;
  status: string;
  active_object_count: {
    aggregate: {
      count: string;
    };
  };
  owner_address: string;
}

interface PropsMoreValueType {
  tip?: string;
  titleNmae?: string;
  value: string | undefined;
  status: string;
  link?: string;
}

export interface HeadProps {
  overview?: {
    'Object Name'?: string;
    'Object Tags'?: string;
    'Object ID'?: string;
    'Object No.'?: string;
    Type?: string;
    'Object Size'?: string;
    'Object Status'?: string;
    'Bucket Name'?: string;
    'Bucket Tags'?: string;
    'Bucket ID'?: string;
    // 'Bucket No.'?: string;
    'Active Objects Count'?: string;
    'Bucket Status'?: string;
    Deleted?: string;
    'Group Name'?: string;
    'Group Tags'?: string;
    'Group ID'?: string;
    Extra?: string;
    'Source Type'?: string;
  } | undefined;
  more?: {
    Visibility?: PropsMoreValueType;
    'Bucket Name'?: PropsMoreValueType;
    'Last Updated Time'?: PropsMoreValueType;
    Creator?: PropsMoreValueType;
    Owner?: PropsMoreValueType;
    'Primary SP'?: PropsMoreValueType;
    'Secondary SP Addresses'?: PropsMoreValueType;
    'Storage Size'?: PropsMoreValueType;
    'Charge Size'?: PropsMoreValueType;
    'Active Objects Count'?: PropsMoreValueType;
    'Bucket Status'?: PropsMoreValueType;
  } | undefined;
  secondaryAddresses?: Array<string>;
  loading?: boolean;
  groupFamilyId?: string;
}

export interface TabsType {
  Transactions: string;
  Versions: string;
}

export interface Tag {
  label: string;
  display_name: string;
}

export interface AddressParam {
  hash: string;
  implementation_name: string;
  name: string | null;
  is_contract: boolean;
  private_tags: Array<Tag> | null;
  watchlist_names: Array<Tag> | null;
  public_tags: Array<Tag> | null;
}

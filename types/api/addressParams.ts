export interface AddressParam {
  hash: string;
  implementation_name: string;
  name: string | null;
  is_contract: boolean;
  private_tags: Array<string> | null;
  watchlist_names: Array<string> | null;
  public_tags: Array<string> | null;
}

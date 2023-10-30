export type UPResponse = {
  type: string;
  hasProfileName: boolean;
  hasProfileImage: boolean;
  LSP3Profile: {
    name: string;
    profileImage: {
      [key: number]: {
        url: string;
      };
    };
  };
}

export type UPResponse = {
  type: string;
  LSP3Profile: {
    name: string;
    profileImage: {
      [key: number]: {
        url: string;
      };
    };
  };
}

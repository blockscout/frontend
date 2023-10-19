import { getEnvValue } from 'configs/app/utils';

type UPResponse = {
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

const makeUniversalProfileIdenticon: (hash: string) => Promise<undefined | string> = async(hash: string) => {
  const upApiUrl = getEnvValue('NEXT_PUBLIC_UP_API_URL') || '';
  const networkId = getEnvValue('NEXT_PUBLIC_NETWORK_ID') || '42';

  const url = `${ upApiUrl }/v1/${ networkId }/address/${ hash }`;

  const response = await fetch(url);
  if (!response.ok) {
    return undefined;
  }

  const UPResult = (await response.json() as UPResponse);
  const profilePictures = Object.values(UPResult.LSP3Profile.profileImage);

  // console.log(JSON.stringify(UPResult));
  // console.log(UPResult.type);
  // console.log(JSON.stringify(UPResult.LSP3Profile));
  // console.log(JSON.stringify(UPResult.LSP3Profile.profileImage));
  // console.log(JSON.stringify(profilePictures));
  // console.log(profilePictures[4].url);

  return profilePictures[4].url;
};

export default makeUniversalProfileIdenticon;

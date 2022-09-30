import getNetworkTitle from 'lib/networks/getNetworkTitle';

export default function getSeo() {
  return {
    title: getNetworkTitle(),
  };
}

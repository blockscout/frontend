export default function getUrl(path: string) {
  return `https://${ process.env.API_HOST }${ process.env.API_BASE_PATH }${ path }`
}

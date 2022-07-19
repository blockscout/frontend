export default function getDefaultHeaders() {
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${ process.env.API_AUTHORIZATION_TOKEN }`,
    'Content-type': 'application/json',
  }
}

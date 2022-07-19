export default function getDefaultHeaders() {
  return {
    accept: 'application/json',
    authorization: `Bearer ${ process.env.API_AUTHORIZATION_TOKEN }`,
    'content-type': 'application/json',
  }
}

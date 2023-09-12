import * as yup from 'yup';

const schema = yup
  .object()
  .noUnknown(true, (params) => {
    return `Unknown ENV variables were provided: ${ params.unknown }`;
  })
  .shape({
    NEXT_PUBLIC_GIT_TAG: yup.string(),
    NEXT_PUBLIC_GIT_COMMIT_SHA: yup.string(),
    NEXT_PUBLIC_APP_HOST: yup.string().required(),
    NEXT_PUBLIC_APP_PROTOCOL: yup.string().oneOf([ 'http', 'https' ]),
    NEXT_PUBLIC_APP_PORT: yup.number(),
  });

export default schema;

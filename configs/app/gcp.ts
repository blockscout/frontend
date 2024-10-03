import { getEnvValue } from './utils';

const googleCloud = Object.freeze({
  projectId: getEnvValue('GOOGLE_CLOUD_PROJECT_ID'),
  location: getEnvValue('BIGQUERY_DATASET_LOCATION'),
  nextAPI: getEnvValue('NEXT_PUBLIC_ARWEAVEID_API_URL') as string,
});

export default googleCloud;

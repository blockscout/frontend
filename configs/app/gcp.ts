import { getEnvValue } from './utils';

const googleCloud = Object.freeze({
  projectId: getEnvValue('GOOGLE_CLOUD_PROJECT_ID'),
  location: getEnvValue('BIGQUERY_DATASET_LOCATION'),
});

export default googleCloud;

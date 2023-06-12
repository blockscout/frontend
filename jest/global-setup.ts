import dotenv from 'dotenv';

export default async function globalSetup() {
  dotenv.config({ path: './configs/envs/.env.jest' });
}

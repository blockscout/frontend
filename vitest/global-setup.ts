import dotenv from 'dotenv';

export async function setup() {
  dotenv.config({ path: './vitest/.env.vitest' });
}

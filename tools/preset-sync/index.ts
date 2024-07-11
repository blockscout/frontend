import fs from 'fs';
import path from 'path';

/* eslint-disable no-console */
const PRESETS = {
  arbitrum: 'https://arbitrum.blockscout.com',
  base: 'https://base.blockscout.com',
  celo_alfajores: 'https://celo-alfajores.blockscout.com',
  eth: 'https://eth.blockscout.com',
};

const LOCAL_ENVS = {
  NEXT_PUBLIC_APP_PROTOCOL: 'http',
  NEXT_PUBLIC_APP_HOST: 'localhost',
  NEXT_PUBLIC_APP_PORT: '3000',
  NEXT_PUBLIC_APP_ENV: 'development',
  NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL: 'ws',
};

const IGNORED_ENVS = [
  'NEXT_PUBLIC_GIT_COMMIT_SHA',
  'NEXT_PUBLIC_GIT_TAG',
];

function parseScriptArgs() {
  const args = process.argv.slice(2);

  const result: Record<string, string> = {};
  args.forEach(arg => {
    const [ key, value ] = arg.split('=');
    if (key && value) {
      result[key.replace(/^--/, '') as keyof typeof result] = value;
    }
  });

  return result;
}

function getSecretEnvsList() {
  const fileContent = fs.readFileSync(path.resolve(__dirname, '../../.env.example'), 'utf8');
  const result = fileContent.split('\n').map((line) => line.split('=')[0]);
  return result;
}

function makePresetFile(envsEntries: Array<[ string, string ]>, chainName: string, explorerUrl: string, presetName: string) {
  const presetEnvsContent = envsEntries
    .map(([ key, value ]) => `${ key }=${ value }`)
    .join('\n');

  const localEnvsContent = Object.entries(LOCAL_ENVS)
    .map(([ key, value ]) => `${ key }=${ value }`)
    .join('\n');

  const content =
    `# Set of ENVs for ${ chainName } network explorer\n` +
    '# ' + explorerUrl + '\n' +
    `# This is an auto-generated file. To update all values, run "yarn preset:sync --name=${ presetName }"\n` +
    '\n' +
    '# Local ENVs\n' +
    localEnvsContent + '\n' +
    '\n' +
    '# Instance ENVs\n' +
    presetEnvsContent;

  fs.writeFileSync(path.resolve(__dirname, `../../configs/envs/.env.${ presetName }`), content);
}

async function run() {
  console.log(`🌀 Syncing preset configuration file...`);

  const args = parseScriptArgs();
  if (!args.name) {
    console.log('🚨 No "--name" argument is provided. Exiting...');
    return;
  }

  const instanceUrl = PRESETS[args.name as keyof typeof PRESETS];
  if (!instanceUrl) {
    console.log(`🚨 No preset with name "${ args.name }" found. Exiting...`);
    return;
  }

  const secretEnvs = getSecretEnvsList();

  const response = await fetch(`${ instanceUrl }/node-api/config`);
  const instanceConfig = await response.json() as Record<'envs', Record<string, string>>;

  const ignoredEnvs = [
    ...Object.keys(LOCAL_ENVS),
    ...IGNORED_ENVS,
    ...secretEnvs,
  ];

  const presetEnvsEntries = Object.entries(instanceConfig.envs)
    .filter(([ key ]) => !ignoredEnvs.includes(key));

  makePresetFile(presetEnvsEntries, instanceConfig.envs.NEXT_PUBLIC_NETWORK_NAME, instanceUrl, args.name);
}

run();

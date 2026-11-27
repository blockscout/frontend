// @vitest-environment node

import fs from 'fs';
import path from 'path';

import { chainA, chainB } from 'src/features/multichain/mocks/chains';

import { describe, it, expect, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const CLUSTER_CONFIG = { chains: [ chainA, chainB ] };
const CONFIG_PATH = path.resolve('public', 'assets/multichain/config.json');

const NODEJS_RUNTIME: Array<[ string, string ]> = [ [ 'NEXT_RUNTIME', 'nodejs' ] ];
const EDGE_RUNTIME: Array<[ string, string ]> = [ [ 'NEXT_RUNTIME', 'edge' ] ];

type Modules = Awaited<ReturnType<typeof importModules>>;

async function importModules() {
  const [ nodejs, accessor ] = await Promise.all([ import('./cluster-config.nodejs'), import('./cluster-config') ]);
  return { nodejs, accessor };
}

// the generated file is the boundary: it exists only in a started container
function mockGeneratedFile(content: string | undefined) {
  return vi.spyOn(fs, 'readFileSync').mockImplementation((file) => {
    if (file !== CONFIG_PATH || content === undefined) {
      throw new Error(`ENOENT: no such file or directory, open '${ String(file) }'`);
    }
    return content;
  });
}

// the Node.js half caches the parsed file for the lifetime of the module, so every test reads a fresh copy
function withModules<T>(envs: Array<[ string, string ]>, run: (modules: Modules) => T | Promise<T>) {
  return withEnvs(envs, async() => run(await importModules()));
}

describe('clusterConfig on the server', () => {
  it('returns the content of the generated file', async() => {
    mockGeneratedFile(JSON.stringify(CLUSTER_CONFIG));

    await withModules(NODEJS_RUNTIME, ({ accessor }) => {
      expect(accessor.clusterConfig()).toEqual(CLUSTER_CONFIG);
    });
  });

  it('returns undefined when no file was generated', async() => {
    mockGeneratedFile(undefined);

    await withModules(NODEJS_RUNTIME, ({ accessor }) => {
      expect(accessor.clusterConfig()).toBeUndefined();
    });
  });

  it('returns undefined when the generated file is not valid JSON', async() => {
    mockGeneratedFile('window.__multichainConfig = {');

    await withModules(NODEJS_RUNTIME, ({ accessor }) => {
      expect(accessor.clusterConfig()).toBeUndefined();
    });
  });

  it('refuses to read the file outside the Node.js runtime', async() => {
    mockGeneratedFile(JSON.stringify(CLUSTER_CONFIG));

    await withModules(EDGE_RUNTIME, ({ accessor }) => {
      expect(() => accessor.clusterConfig()).toThrow('NEXT_RUNTIME is not nodejs');
    });
  });
});

describe('preloading the cluster config', () => {
  it('resolves with the content of the generated file', async() => {
    mockGeneratedFile(JSON.stringify(CLUSTER_CONFIG));

    await withModules(NODEJS_RUNTIME, async({ nodejs }) => {
      expect(await nodejs.load()).toEqual(CLUSTER_CONFIG);
    });
  });

  it('resolves with undefined when no file was generated', async() => {
    mockGeneratedFile(undefined);

    await withModules(NODEJS_RUNTIME, async({ nodejs }) => {
      expect(await nodejs.load()).toBeUndefined();
    });
  });

  it('keeps serving the preloaded config after the file is gone', async() => {
    const generatedFile = mockGeneratedFile(JSON.stringify(CLUSTER_CONFIG));

    await withModules(NODEJS_RUNTIME, async({ nodejs, accessor }) => {
      const preloaded = await nodejs.load();
      generatedFile.mockImplementation(() => {
        throw new Error('ENOENT');
      });

      expect(await nodejs.load()).toBe(preloaded);
      expect(accessor.clusterConfig()).toBe(preloaded);
    });
  });
});

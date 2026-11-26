import fs from 'fs';
import path from 'path';

import type { ViolationReason } from './check';
import { findUnresolvableImports } from './check';

export interface OutputLine {
  readonly stream: 'out' | 'err';
  readonly text: string;
}

export interface CliResult {
  readonly output: ReadonlyArray<OutputLine>;
  readonly exitCode: number;
}

function getPackageNames(manifest: unknown, field: 'dependencies' | 'peerDependencies'): Array<string> {
  if (typeof manifest !== 'object' || manifest === null) {
    return [];
  }
  const value: unknown = Reflect.get(manifest, field);
  return typeof value === 'object' && value !== null ? Object.keys(value) : [];
}

const REASON_TEXT: Record<ViolationReason, string> = {
  'outside-package': 'points outside the package',
  'missing-file': 'has no declaration file in dist',
  'undeclared-package': 'is not among the dependencies or peer dependencies',
};

export const FAILURE_MESSAGE =
  '\nThe toolkit declarations import modules a consumer cannot resolve. See src/toolkit/CONTEXT.md.';

function readDeclarations(distDir: string): Map<string, string> {
  const files = fs.readdirSync(distDir, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.d.ts'))
    .sort();

  return new Map(files.map((file) => [
    file.split(path.sep).join('/'),
    fs.readFileSync(path.join(distDir, file), 'utf8'),
  ]));
}

export function runCheck(packageDir: string): CliResult {
  const distDir = path.join(packageDir, 'dist');

  if (!fs.existsSync(distDir)) {
    return { output: [ { stream: 'err', text: `✗ ${ distDir } not found. Build the package first.` } ], exitCode: 1 };
  }

  const manifest: unknown = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8'));
  const declaredPackages = new Set([
    ...getPackageNames(manifest, 'dependencies'),
    ...getPackageNames(manifest, 'peerDependencies'),
  ]);

  const declarations = readDeclarations(distDir);
  const violations = findUnresolvableImports(declarations, declaredPackages);

  if (violations.length === 0) {
    return { output: [ { stream: 'out', text: `✓ ${ declarations.size } declaration files, every import resolves` } ], exitCode: 0 };
  }

  return {
    output: [
      ...violations.map(({ file, specifier, reason }): OutputLine => ({
        stream: 'err',
        text: `✗ dist/${ file }: '${ specifier }' ${ REASON_TEXT[reason] }`,
      })),
      { stream: 'err', text: FAILURE_MESSAGE },
    ],
    exitCode: 1,
  };
}

import path from 'path';

import ts from 'typescript';

export type ViolationReason = 'outside-package' | 'missing-file' | 'undeclared-package';

export interface Violation {
  readonly file: string;
  readonly specifier: string;
  readonly reason: ViolationReason;
}

type Declarations = ReadonlyMap<string, string>;

function isRelative(specifier: string): boolean {
  return specifier.startsWith('./') || specifier.startsWith('../') || specifier === '.' || specifier === '..';
}

function getPackageName(specifier: string): string {
  const segments = specifier.split('/');
  return specifier.startsWith('@') ? segments.slice(0, 2).join('/') : segments[0];
}

function checkRelative(file: string, specifier: string, declarations: Declarations): ViolationReason | undefined {
  const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier));

  if (target === '..' || target.startsWith('../')) {
    return 'outside-package';
  }

  const candidates = [
    target,
    `${ target }.d.ts`,
    `${ target }/index.d.ts`,
    target.replace(/\.js$/, '.d.ts'),
  ];

  return candidates.some((candidate) => candidate.endsWith('.d.ts') && declarations.has(candidate)) ? undefined : 'missing-file';
}

function checkSpecifier(
  file: string,
  specifier: string,
  declarations: Declarations,
  declaredPackages: ReadonlySet<string>,
): ViolationReason | undefined {
  if (path.posix.isAbsolute(specifier)) {
    return 'outside-package';
  }
  if (isRelative(specifier)) {
    return checkRelative(file, specifier, declarations);
  }
  return declaredPackages.has(getPackageName(specifier)) ? undefined : 'undeclared-package';
}

export function findUnresolvableImports(declarationTextByDistPath: Declarations, declaredPackages: ReadonlySet<string>): Array<Violation> {
  const violations: Array<Violation> = [];

  for (const [ file, source ] of declarationTextByDistPath) {
    const info = ts.preProcessFile(source, true);
    const specifiers = new Set([
      ...info.importedFiles.map(({ fileName }) => fileName),
      ...info.typeReferenceDirectives.map(({ fileName }) => fileName),
      ...info.referencedFiles.map(({ fileName }) => (isRelative(fileName) ? fileName : `./${ fileName }`)),
    ]);

    for (const specifier of specifiers) {
      const reason = checkSpecifier(file, specifier, declarationTextByDistPath, declaredPackages);
      if (reason) {
        violations.push({ file, specifier, reason });
      }
    }
  }

  return violations;
}

export interface Version {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly prerelease: string | undefined;
}

// A release line: the minor every `vX.Y.*` tag belongs to; a line keeps one open pre-release at a time.
export interface Line {
  readonly major: number;
  readonly minor: number;
}

const TAG = /^v(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;
const VERSION_LABEL = /^v\d+\.\d+\.\d+$/;
const ALPHA = /^alpha\.\d+$/;

export function parseTag(tag: string): Version | undefined {
  const match = TAG.exec(tag);
  if (match === null) {
    return undefined;
  }
  const [ , major, minor, patch, prerelease ] = match;
  return { major: Number(major), minor: Number(minor), patch: Number(patch), prerelease };
}

export function parseTagOrThrow(tag: string): Version {
  const version = parseTag(tag);
  if (version === undefined) {
    throw new Error(`Not a release tag: "${ tag }"; expected vX.Y.Z or vX.Y.Z-<pre-release>`);
  }
  return version;
}

export function parseAlphaTagOrThrow(tag: string): Version {
  const version = parseTagOrThrow(tag);
  if (version.prerelease === undefined || !ALPHA.test(version.prerelease)) {
    throw new Error(`Not an alpha tag: "${ tag }"; expected vX.Y.Z-alpha.N`);
  }
  return version;
}

export function parseFinalTagOrThrow(tag: string): Version {
  const version = parseTagOrThrow(tag);
  if (version.prerelease !== undefined) {
    throw new Error(`Not a final tag: "${ tag }"; expected vX.Y.Z`);
  }
  return version;
}

export function formatLine({ major, minor }: Line): string {
  return `v${ major }.${ minor }`;
}

export function isSameLine(a: Line, b: Line): boolean {
  return a.major === b.major && a.minor === b.minor;
}

export function formatVersion({ major, minor, patch }: Version): string {
  return `v${ major }.${ minor }.${ patch }`;
}

// Every release has its own branch, so an alpha of a patch never lands on the branch of the minor.
export function releaseBranch(version: Version): string {
  return `release/${ formatVersion(version) }`;
}

// The label a release stamps on what it shipped is its final version, also when the tag is an alpha of it.
export function versionLabel(tag: string): string {
  return formatVersion(parseTagOrThrow(tag));
}

export function isVersionLabel(label: string): boolean {
  return VERSION_LABEL.test(label);
}

function compareVersions(a: Version, b: Version): number {
  return a.major - b.major || a.minor - b.minor || a.patch - b.patch;
}

function isEarlierRelease(candidate: Version, current: Version): boolean {
  if (current.patch > 0) {
    return candidate.major === current.major && candidate.minor === current.minor && candidate.patch < current.patch;
  }
  return candidate.major < current.major || (candidate.major === current.major && candidate.minor < current.minor);
}

function finalVersionsLatestFirst(tags: ReadonlyArray<string>): Array<Version> {
  return tags
    .map(parseTag)
    .filter((version): version is Version => version !== undefined && version.prerelease === undefined)
    .sort((a, b) => compareVersions(b, a));
}

// Read off the tag list rather than release dates, so a hotfix on an older line resolves within that line.
export function previousTag(tag: string, tags: ReadonlyArray<string>): string {
  const [ previous ] = finalVersionsLatestFirst(tags).filter((version) => isEarlierRelease(version, parseTagOrThrow(tag)));

  if (previous === undefined) {
    throw new Error(`No release precedes ${ tag }`);
  }
  return formatVersion(previous);
}

export function latestFinalTag(line: Line, tags: ReadonlyArray<string>): string | undefined {
  const [ latest ] = finalVersionsLatestFirst(tags).filter((version) => isSameLine(version, line));
  return latest === undefined ? undefined : formatVersion(latest);
}

function alphaNumber(version: Version): number | undefined {
  return version.prerelease !== undefined && ALPHA.test(version.prerelease) ? Number(version.prerelease.split('.')[1]) : undefined;
}

export function latestAlphaTag(version: Version, tags: ReadonlyArray<string>): string | undefined {
  const numbers = tags
    .map(parseTag)
    .filter((candidate): candidate is Version => candidate !== undefined && compareVersions(candidate, version) === 0)
    .map(alphaNumber)
    .filter((number): number is number => number !== undefined);
  return numbers.length === 0 ? undefined : `${ formatVersion(version) }-alpha.${ Math.max(...numbers) }`;
}

export type ReleaseBase =
  { readonly kind: 'main' } |
  { readonly kind: 'tag'; readonly tag: string };

// A minor forks from main; a patch continues from the line's latest release, so the line stays a single
// chain of picks and the previous tag is always an ancestor of the next.
export function releaseBase(version: Version, tags: ReadonlyArray<string>): ReleaseBase {
  if (version.patch === 0) {
    return { kind: 'main' };
  }
  const previous = formatVersion({ ...version, patch: version.patch - 1 });
  const latest = latestFinalTag(version, tags);
  if (latest !== previous) {
    const actual = latest === undefined ? `line ${ formatLine(version) } has no release yet` : `the latest is ${ latest }`;
    throw new Error(`${ formatVersion(version) } must follow ${ previous } as the line's latest release; ${ actual }`);
  }
  return { kind: 'tag', tag: previous };
}

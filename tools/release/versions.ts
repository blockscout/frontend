export interface Version {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly prerelease: string | undefined;
}

// A release line: the minor every `vX.Y.*` tag and `release/vX.Y` belong to.
export interface Line {
  readonly major: number;
  readonly minor: number;
}

const TAG = /^v(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;
const VERSION_LABEL = /^v\d+\.\d+\.\d+$/;
const LINE = /^v(\d+)\.(\d+)$/;
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

export function parseLineOrThrow(line: string): Line {
  const match = LINE.exec(line);
  if (match === null) {
    throw new Error(`Not a release line: "${ line }"; expected vX.Y`);
  }
  const [ , major, minor ] = match;
  return { major: Number(major), minor: Number(minor) };
}

export function formatLine({ major, minor }: Line): string {
  return `v${ major }.${ minor }`;
}

export function isSameLine(a: Line, b: Line): boolean {
  return a.major === b.major && a.minor === b.minor;
}

export function releaseBranch(line: Line): string {
  return `release/${ formatLine(line) }`;
}

// The tag of the line's first release, which its pre-release names until the first alpha.
export function minorTag(line: Line): string {
  return `${ formatLine(line) }.0`;
}

export function formatVersion({ major, minor, patch }: Version): string {
  return `v${ major }.${ minor }.${ patch }`;
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

// Read off the tag list rather than release dates, so a hotfix on an older line resolves within that line.
export function previousTag(tag: string, tags: ReadonlyArray<string>): string {
  const current = parseTagOrThrow(tag);
  const [ previous ] = tags
    .map(parseTag)
    .filter((version): version is Version => version !== undefined && version.prerelease === undefined)
    .filter((version) => isEarlierRelease(version, current))
    .sort((a, b) => compareVersions(b, a));

  if (previous === undefined) {
    throw new Error(`No release precedes ${ tag }`);
  }
  return formatVersion(previous);
}

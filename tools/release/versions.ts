export interface Version {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly prerelease: string | undefined;
}

const TAG = /^v(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;
const VERSION_LABEL = /^v\d+\.\d+\.\d+$/;

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

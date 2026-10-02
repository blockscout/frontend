import type { Line, Version } from './versions';
import { formatLine, formatVersion, isSameLine, parseTag, versionLabel } from './versions';

export interface GithubRelease {
  readonly id: number;
  readonly tagName: string;
  readonly draft: boolean;
  readonly prerelease: boolean;
  readonly url: string;
}

// A line keeps one pre-release from prepare to publish, re-pointed at each alpha: a second one would let
// the tag check and the operator read different notes.
export function findLinePreRelease(releases: ReadonlyArray<GithubRelease>, line: Line): GithubRelease | undefined {
  const found = releases.filter((release) => {
    const version = parseTag(release.tagName);
    return release.prerelease && version !== undefined && isSameLine(version, line);
  });

  if (found.length > 1) {
    const tags = found.map(({ tagName }) => tagName).join(', ');
    throw new Error(`Line ${ formatLine(line) } has ${ found.length } pre-releases (${ tags }); delete all but one`);
  }
  return found[0];
}

// An alpha re-points only the pre-release of its own version: the line's open one may be a release not
// published yet, whose notes and tag the alpha must not take over.
export function findReleasePreRelease(releases: ReadonlyArray<GithubRelease>, version: Version): GithubRelease {
  const tag = formatVersion(version);
  const preRelease = findLinePreRelease(releases, version);
  if (preRelease === undefined) {
    throw new Error(`Release ${ tag } has no pre-release; create it with "pnpm release prepare ${ tag }"`);
  }
  if (versionLabel(preRelease.tagName) !== tag) {
    throw new Error(`The open pre-release of line ${ formatLine(version) } is ${ preRelease.tagName } (${ preRelease.url }), not ${ tag }; publish it first`);
  }
  return preRelease;
}

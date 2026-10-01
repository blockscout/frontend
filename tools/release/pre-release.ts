import type { Line } from './versions';
import { formatLine, isSameLine, parseTag } from './versions';

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

# Notes — 03 Conflict mode with list view

## Leaf 1: Monaco model paths, and the key form

Checked on `pnpm dev:preset robinhood`, on the example contract's Contract tab, through `window.monaco`
(the CDN build the editor loads, `monaco-editor@0.52.2`).

`monaco.Uri.parse(input).path` per input:

| Input | `uri.path` | Same as input |
| --- | --- | --- |
| `/a.sol` | `/a.sol` | yes |
| `/./a.sol` | `/./a.sol` | yes |
| `/dir/./a.sol` | `/dir/./a.sol` | yes |
| `/dir/b/../a.sol` | `/dir/b/../a.sol` | yes |
| `a.sol` | `/a.sol` | no, a slash is added |
| `./a.sol` | `/./a.sol` | no, a slash is added |
| `//dir/a.sol` | `/a.sol`, with `dir` as the authority | no |
| `/dir/a b#c?d.sol` | `/dir/a b` | no, cut at `#` |

`createModel` for `/a.sol` and for `/./a.sol` gives two models, and `getModel` returns each with its own
content. Monaco does not collapse dot segments.

**The question the spec asked is answered yes**: `/./contracts/a.sol` and `/contracts/a.sol` are distinct
model paths.

**The raw path still cannot be the key.** A key must come back unchanged from `model.uri.path`, because the
search and the close-tab action read it from there. The raw paths `a.sol` and `/a.sol` are two different
source units, and no slash-prefixed form keeps them apart: as they are, both read back as `/a.sol`; with a
slash added, `/a.sol` becomes `//a.sol` and its first folder is read as the authority. A raw path with `#`
or `?` is cut as well.

**Decision: the key in conflict mode is index-based**, `/<index in the files array>`. It is unique whatever
the raw paths are and survives the round trip. The display path carries the raw path. Without a conflict
the key stays the normalized path, as before.

Consequence, as the ticket foresaw: `addExternalLibraryWarningDecoration` matches a library's file name
against the file's display path, not against `model.uri.path`.

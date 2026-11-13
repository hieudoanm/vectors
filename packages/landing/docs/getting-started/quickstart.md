# Quickstart

The output extension decides the format: PNG/JPEG input traces to `.svg`, while
a `.png` output rasterizes the result (the only valid output for SVG input).
Omit the output path to print SVG to stdout.

```sh
vectors logo.png logo.svg            # trace to SVG
vectors logo.png | pango-view -      # SVG to stdout
vectors logo.svg logo.png --width 512  # rasterize back to PNG
```

## Useful flags

| Flag                                  | What it does                                                        |
| ------------------------------------- | ------------------------------------------------------------------- |
| `-c, --colors <N>`                    | Palette size; `1`/`2` selects black-and-white tracing (default `8`) |
| `-t, --threshold <L>`                 | Luminance cut for binary mode (default `128`)                       |
| `-d, --detail <full\|balanced\|bold>` | How aggressively small shapes are dropped                           |
| `--min-area <PX>`                     | Ignore regions smaller than this                                    |
| `--simplify-tolerance <PX>`           | Douglas–Peucker tolerance (default `1`)                             |
| `--bezier-tolerance <PX>`             | Maximum Bézier deviation (default `0.5`)                            |
| `--backdrop <COLOR>`                  | Backdrop under transparent pixels (default `#ffffff`)               |
| `--background-index <N>`              | Palette index treated as background, never traced                   |
| `--precision <N>`                     | Decimal places in emitted coordinates (default `2`)                 |
| `--width <PX>`, `--height <PX>`       | Target PNG size; width alone keeps aspect ratio                     |
| `--background <COLOR>`                | Opaque backdrop when writing PNG                                    |
| `--debug-dir <DIR>`                   | Write per-stage debug PNGs                                          |
| `-q, --quiet`                         | Suppress the summary on stderr                                      |

Subcommands: `info` (palette without tracing), `serve` (HTTP), `mcp serve`
(stdio JSON-RPC), plus feature-gated `eval`, `baseline`, `golden`, `sweep`.

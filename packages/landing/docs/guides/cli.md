# CLI examples

```sh
vectors icon.png icon.svg --colors 4
vectors photo.jpg out.svg --colors 1 --threshold 140
vectors logo.png logo.svg --detail bold --debug-dir ./trace
vectors logo.png logo.png --width 1024
vectors logo.svg logo.png --width 512 --height 512 --background '#ffffff'
vectors info logo.png
vectors serve --bind 0.0.0.0:8080
vectors mcp serve
```

`--debug-dir` writes per-stage debug PNGs — useful for seeing exactly where a
trace went wrong (palette, segmentation, contours, or curve fitting).

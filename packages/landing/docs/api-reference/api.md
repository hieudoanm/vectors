# HTTP API

`vectors serve` exposes the tracer over HTTP.

```sh
vectors serve --bind 0.0.0.0:8080
```

The API accepts raster uploads (PNG/JPEG) and returns traced SVG, and accepts
SVG for rasterization to PNG at a requested size. Requests are stateless and
processed entirely locally.

For the authoritative contract, see the server source under
[`crates/`](https://github.com/hieudoanm/vectors/tree/master/crates) in the
repository — the CLI flags in [Quickstart](../getting-started/quickstart.md) map
one-to-one onto the API parameters.

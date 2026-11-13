# Tracing pipeline

```text
PNG / JPEG
    │
    ▼
Raster ──► LabelMap ──► Regions ──► Loops ──► Contours ──► VectorImage ──► SVG
 load      preprocess   segment    contour  simplify +      vector        emit
                                             Bézier fit
```

| Stage                                  | Question it answers                             |
| -------------------------------------- | ----------------------------------------------- |
| `core::Raster`                         | What pixels are there?                          |
| `preprocess`                           | Which palette entry does each pixel belong to?  |
| `segment`                              | Which pixels form one object?                   |
| `contour`                              | What are the boundaries of that object?         |
| `contour::simplify`, `contour::bezier` | Which points and curves represent the boundary? |
| `vector`                               | What shapes exist, and what colour are they?    |
| `vector::svg`                          | How is this written as SVG?                     |

The pipeline is one-way by design — see
[`docs/ARCHITECTURE.md`](https://github.com/hieudoanm/vectors/blob/master/docs/ARCHITECTURE.md)
in the repository for the stage-by-stage walkthrough.

## Determinism

The same input always produces byte-identical output: no ML models, no network
calls, no service dependency.

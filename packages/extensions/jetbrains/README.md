# vectors — JetBrains plugin

Convert PNG/JPEG images to SVG inside JetBrains IDEs (IntelliJ IDEA,
PyCharm, GoLand, …) using the shared `vectors` tracer.

## Features

- **Project tool window** — right-click one or more `.png`/`.jpg`/`.jpeg`
  files → **Vectors → Convert Image to SVG**.
- **Image editor tab** — right-click inside an image preview → same action.
- **Tools menu** — `Tools → Vectors → Convert Image to SVG`.
- The SVG is written next to the source (`logo.png` → `logo.svg`), the
  Project view refreshes automatically, and a summary dialog reports
  per-file results.

## Requirements

- JetBrains IDE 2024.3 or newer.
- The `vectors` CLI on `PATH`, or a custom path in
  **Settings → Tools → vectors**.

The plugin shells out to the CLI — the same approach as the Zed extension —
so it supports every raster format the CLI decodes (PNG/JPEG natively).

## Build & run

```bash
./gradlew runIde        # sandbox IDE with the plugin installed
./gradlew buildPlugin   # → build/distributions/vectors-jetbrains-0.0.1.zip
./gradlew test koverVerify
```

Kotlin + IntelliJ Platform Gradle plugin (`org.jetbrains.intellij.platform`
2.x), modeled on `mars/extensions/jetbrains`.

## Install

**Settings → Plugins → ⚙ → Install Plugin from Disk…** and pick the
`.zip` from `build/distributions/` (or the `extension-jetbrains-vectors.zip`
release asset).

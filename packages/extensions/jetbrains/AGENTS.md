# AGENTS.md — `packages/extensions/jetbrains`

JetBrains IDE plugin for vectors: Kotlin, built with the IntelliJ Platform
Gradle plugin (2.x), modeled on `mars/extensions/jetbrains`.

Like the Zed extension it contains **no** tracing code — the
`Vectors → Convert Image to SVG` action shells out to the `vectors` CLI
(path configurable in Settings → Tools → vectors).

## Layout

| Path                                                   | Holds                                                      |
| ------------------------------------------------------ | ---------------------------------------------------------- |
| `build.gradle.kts`                                     | Kotlin JVM + `org.jetbrains.intellij.platform` + kover     |
| `gradle.properties`                                    | `pluginGroup`/`pluginVersion`                              |
| `src/main/resources/META-INF/plugin.xml`               | plugin id `com.vectors.idea`, actions, settings            |
| `src/main/kotlin/com/vectors/idea/VectorsPaths.kt`     | pure image-ext + svg-path helpers (tested)                 |
| `src/main/kotlin/com/vectors/idea/VectorsCli.kt`       | pure CLI argv builder (tested)                             |
| `src/main/kotlin/com/vectors/idea/VectorsSettings*.kt` | `cliPath` persistent setting + UI                          |
| `src/main/kotlin/com/vectors/idea/actions/`            | `ConvertImageToSvgAction` (IDE-bound, excluded from kover) |
| `build/distributions/`                                 | `vectors-jetbrains-<version>.zip` plugin artifact          |

## Rules

- IDE target is IntelliJ IDEA Community **2024.3**, Kotlin JVM toolchain 21,
  Gradle wrapper 9.9.2 — keep in sync with `mars/extensions/jetbrains`.
- Keep `VectorsPaths`/`VectorsCli` free of IntelliJ imports so the kover
  gate (80% line+branch, UI classes excluded) stays meaningful.
- The action runs on `ActionUpdateThread.BGT`; never touch Swing/VFS writes
  off the EDT — results are marshalled with `invokeLater`.
- Release asset name is fixed: `extension-jetbrains-vectors.zip` (CI renames
  the `buildPlugin` output before upload).
- Run `./gradlew test koverVerify` before committing; `runIde` launches a
  sandbox IDE for manual testing.

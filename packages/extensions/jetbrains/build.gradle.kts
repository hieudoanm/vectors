import org.jetbrains.intellij.platform.gradle.IntelliJPlatformType

plugins {
    kotlin("jvm") version "2.4.21"
    id("org.jetbrains.intellij.platform") version "2.20.1"
    id("org.jetbrains.kotlinx.kover") version "0.9.11"
}

group = "io.github.hieudoanm.vectors.idea"
version = "0.0.1"

repositories {
    mavenCentral()
    intellijPlatform {
        defaultRepositories()
    }
}

kotlin {
    jvmToolchain(21)
}

dependencies {
    intellijPlatform {
        create(IntelliJPlatformType.IntellijIdeaCommunity, "2024.3")
    }
    testImplementation("junit:junit:4.13.2")
}

tasks.test {
    useJUnit()
}

// Coverage is gated on the pure-Kotlin helpers (VectorsPaths, VectorsCli);
// IDE-bound classes (settings, actions) require the IDE test framework and
// are excluded from the gate.
kover {
    reports {
        filters {
            excludes {
                classes(
                    "com.vectors.idea.actions.*",
                    "com.vectors.idea.VectorsSettings*",
                )
            }
        }
        verify {
            rule {
                minBound(80, coverageUnits = kotlinx.kover.gradle.plugin.dsl.CoverageUnit.LINE)
                minBound(80, coverageUnits = kotlinx.kover.gradle.plugin.dsl.CoverageUnit.BRANCH)
            }
        }
    }
}

intellijPlatform {
    pluginConfiguration {
        id = "io.github.hieudoanm.vectors.idea"
        name = "vectors"
        version = "0.0.1"
        description = """
            Convert PNG/JPEG images to SVG with the vectors tracer.

            Right-click an image in the Project tool window or an image
            editor tab → Convert Image to SVG. Runs the `vectors` CLI.
        """.trimIndent()
        vendor {
            name = "hieudoanm"
        }
    }
}

package com.vectors.idea

/** Builds the `vectors` CLI invocation. Pure — process execution lives in the
 * action so this stays unit-testable without spawning processes. */
object VectorsCli {
    fun command(cliPath: String, input: String, output: String): List<String> =
        listOf(cliPath, input, output)
}

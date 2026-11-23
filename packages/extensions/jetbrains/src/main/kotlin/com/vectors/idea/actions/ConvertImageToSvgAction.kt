package com.vectors.idea.actions

import com.intellij.openapi.actionSystem.ActionUpdateThread
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.CommonDataKeys
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.progress.ProgressIndicator
import com.intellij.openapi.progress.ProgressManager
import com.intellij.openapi.progress.Task
import com.intellij.openapi.ui.Messages
import com.intellij.openapi.vfs.VirtualFile
import com.vectors.idea.VectorsCli
import com.vectors.idea.VectorsPaths
import com.vectors.idea.VectorsSettings
import java.util.concurrent.TimeUnit

/** Converts selected PNG/JPEG files to SVG via the `vectors` CLI, writing
 * `<name>.svg` next to each source. Works from the Project tool window
 * (multi-select) and from an image editor tab. */
class ConvertImageToSvgAction : AnAction() {

    override fun getActionUpdateThread() = ActionUpdateThread.BGT

    override fun update(e: AnActionEvent) {
        e.presentation.isEnabledAndVisible = imageFiles(e).isNotEmpty()
    }

    override fun actionPerformed(e: AnActionEvent) {
        val project = e.project ?: return
        val files = imageFiles(e)
        if (files.isEmpty()) return

        ProgressManager.getInstance().run(
            object : Task.Backgroundable(project, "Vectors: converting to SVG", false) {
                override fun run(indicator: ProgressIndicator) {
                    var converted = 0
                    val failures = mutableListOf<String>()
                    for (file in files) {
                        indicator.text = "Converting ${file.name}"
                        when (val result = convert(file)) {
                            is Result.Success -> converted++
                            is Result.Failure -> failures += "${file.name}: ${result.reason}"
                        }
                    }
                    val summary = buildString {
                        append("Converted $converted/${files.size} image(s) to SVG.")
                        failures.forEach { append('\n').append(it) }
                    }
                    ApplicationManager.getApplication().invokeLater {
                        if (failures.isEmpty()) {
                            Messages.showInfoMessage(project, summary, "Vectors")
                        } else {
                            Messages.showWarningDialog(project, summary, "Vectors")
                        }
                    }
                }
            }
        )
    }

    private sealed interface Result {
        data object Success : Result
        data class Failure(val reason: String) : Result
    }

    private fun convert(file: VirtualFile): Result {
        val input = file.path
        val output = VectorsPaths.svgPathFor(input)
        return try {
            val process = ProcessBuilder(VectorsCli.command(VectorsSettings.cliPath, input, output))
                .redirectErrorStream(true)
                .start()
            val code = if (process.waitFor(60, TimeUnit.SECONDS)) {
                process.exitValue()
            } else {
                process.destroyForcibly()
                -1
            }
            if (code == 0) {
                file.parent?.refresh(false, false)
                Result.Success
            } else {
                Result.Failure("vectors exited with code $code")
            }
        } catch (ex: Exception) {
            Result.Failure(
                "cannot run '${VectorsSettings.cliPath}': ${ex.message ?: ex.javaClass.simpleName} " +
                    "— set the CLI path in Settings → Tools → vectors"
            )
        }
    }

    private fun imageFiles(e: AnActionEvent): List<VirtualFile> {
        val selected = e.getData(CommonDataKeys.VIRTUAL_FILE_ARRAY)
            ?.filterNotNull()
            ?.filter { it.isValid }
            ?.takeIf { it.isNotEmpty() }
        val single = e.getData(CommonDataKeys.VIRTUAL_FILE)?.takeIf { it.isValid }
        val candidates = selected ?: listOfNotNull(single)
        return candidates.filter { !it.isDirectory && VectorsPaths.isImageName(it.name) }
    }
}

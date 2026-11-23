package com.vectors.idea

import com.intellij.openapi.options.Configurable
import com.intellij.openapi.options.ConfigurationException
import com.intellij.openapi.ui.TextFieldWithBrowseButton
import com.intellij.ui.components.JBLabel
import com.intellij.util.ui.FormBuilder
import java.awt.BorderLayout
import javax.swing.JComponent
import javax.swing.JPanel

class VectorsSettingsConfigurable : Configurable {
    private val cliPathField = TextFieldWithBrowseButton().apply {
        text = VectorsSettings.cliPath
    }
    private var panel: JPanel? = null

    override fun getDisplayName() = "vectors"

    override fun createComponent(): JComponent {
        val form = FormBuilder.createFormBuilder()
            .addLabeledComponent(JBLabel("vectors CLI path:"), cliPathField)
            .addComponentFillVertically(JPanel(), 0)
            .panel
        panel = JPanel(BorderLayout()).apply { add(form, BorderLayout.NORTH) }
        return panel!!
    }

    override fun isModified(): Boolean = cliPathField.text != VectorsSettings.cliPath

    @Throws(ConfigurationException::class)
    override fun apply() {
        VectorsSettings.cliPath = cliPathField.text.trim().ifEmpty { "vectors" }
    }

    override fun reset() {
        cliPathField.text = VectorsSettings.cliPath
    }

    override fun disposeUIResources() {
        panel = null
    }
}

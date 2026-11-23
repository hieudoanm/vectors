package com.vectors.idea

import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.PersistentStateComponent
import com.intellij.openapi.components.State
import com.intellij.openapi.components.Storage

@State(name = "VectorsSettings", storages = [Storage("vectors.xml")])
class VectorsSettings : PersistentStateComponent<VectorsSettings> {
    var cliPath: String = "vectors"

    override fun getState(): VectorsSettings = this
    override fun loadState(state: VectorsSettings) {
        cliPath = state.cliPath
    }

    companion object {
        val instance: VectorsSettings
            get() = ApplicationManager.getApplication().getService(VectorsSettings::class.java)

        var cliPath: String
            get() = instance.cliPath
            set(value) {
                instance.cliPath = value
            }
    }
}

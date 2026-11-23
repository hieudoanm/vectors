package com.vectors.idea

import org.junit.Assert.assertEquals
import org.junit.Test

class VectorsCliTest {
    @Test
    fun `command is cli input output`() {
        assertEquals(
            listOf("vectors", "/p/logo.png", "/p/logo.svg"),
            VectorsCli.command("vectors", "/p/logo.png", "/p/logo.svg")
        )
    }

    @Test
    fun `custom cli path is used verbatim`() {
        assertEquals(
            listOf("/opt/vectors", "a.png", "a.svg"),
            VectorsCli.command("/opt/vectors", "a.png", "a.svg")
        )
    }
}

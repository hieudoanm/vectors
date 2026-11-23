package com.vectors.idea

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class VectorsPathsTest {
    @Test
    fun `image extensions are recognised case-insensitively`() {
        assertTrue(VectorsPaths.isImageName("logo.png"))
        assertTrue(VectorsPaths.isImageName("photo.JPG"))
        assertTrue(VectorsPaths.isImageName("pic.jpeg"))
        assertTrue(VectorsPaths.isImageName("dir/sub/icon.png"))
    }

    @Test
    fun `non-images and extensionless names are rejected`() {
        assertFalse(VectorsPaths.isImageName("logo.svg"))
        assertFalse(VectorsPaths.isImageName("archive.zip"))
        assertFalse(VectorsPaths.isImageName("README"))
        assertFalse(VectorsPaths.isImageName("file."))
        assertFalse(VectorsPaths.isImageName("dir.with.dots/file"))
    }

    @Test
    fun `svg path replaces the extension`() {
        assertEquals("dir/logo.svg", VectorsPaths.svgPathFor("dir/logo.png"))
        assertEquals("logo.svg", VectorsPaths.svgPathFor("logo.jpg"))
        assertEquals("a.b/c.d.svg", VectorsPaths.svgPathFor("a.b/c.d.png"))
    }

    @Test
    fun `svg path appends when there is no usable extension`() {
        assertEquals("README.svg", VectorsPaths.svgPathFor("README"))
        assertEquals("dir.name/file.svg", VectorsPaths.svgPathFor("dir.name/file"))
    }
}

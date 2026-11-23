package com.vectors.idea

/** Pure path/extension helpers — no IDE dependencies, unit-tested. */
object VectorsPaths {
    private val IMAGE_EXTENSIONS = setOf("png", "jpg", "jpeg")

    fun isImageName(fileName: String): Boolean {
        val slash = maxOf(fileName.lastIndexOf('/'), fileName.lastIndexOf('\\'))
        val dot = fileName.lastIndexOf('.')
        if (dot <= slash || dot == fileName.length - 1) return false
        return IMAGE_EXTENSIONS.contains(fileName.substring(dot + 1).lowercase())
    }

    /** `dir/logo.png` → `dir/logo.svg`; appends `.svg` when there is no extension. */
    fun svgPathFor(path: String): String {
        val slash = maxOf(path.lastIndexOf('/'), path.lastIndexOf('\\'))
        val dot = path.lastIndexOf('.')
        return if (dot > slash && dot < path.length - 1) {
            path.substring(0, dot) + ".svg"
        } else {
            "$path.svg"
        }
    }
}

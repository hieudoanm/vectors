// Vectors — Zed extension.
//
// Zed's extension API has no file context-menu or command-palette surface
// (zed-industries/zed#39554), so the only user-invokable hook is the
// assistant slash command: `/vectors <image.png|jpg|jpeg>` converts the
// worktree-relative image to SVG next to it.
//
// The conversion itself runs through the `vectors` CLI: the binary is taken
// from PATH when present, otherwise the matching `cli-vectors-*` release
// asset is downloaded into the extension's working directory once.

use std::sync::Mutex;

use zed::process::Command;
use zed_extension_api::{self as zed, DownloadedFileType};

const RELEASE_BASE: &str = "https://github.com/hieudoanm/vectors/releases/download/latest";
const BINARY_NAME: &str = "vectors-cli";

struct VectorsExtension {
    /// Cached path to a downloaded CLI binary (None until first download).
    binary: Mutex<Option<String>>,
}

impl zed::Extension for VectorsExtension {
    fn new() -> Self {
        Self {
            binary: Mutex::new(None),
        }
    }

    fn run_slash_command(
        &self,
        command: zed::SlashCommand,
        args: Vec<String>,
        worktree: Option<&zed::Worktree>,
    ) -> zed::Result<zed::SlashCommandOutput> {
        if command.name != "vectors" {
            return Err(format!("unknown command: {}", command.name));
        }
        let worktree = worktree.ok_or("no worktree available")?;
        convert(&args, worktree, self)
    }
}

fn convert(
    args: &[String],
    worktree: &zed::Worktree,
    ext: &VectorsExtension,
) -> zed::Result<zed::SlashCommandOutput> {
    let rel = args.first().ok_or("usage: /vectors <image.png|jpg|jpeg>")?;
    let lower = rel.to_lowercase();
    if !(lower.ends_with(".png") || lower.ends_with(".jpg") || lower.ends_with(".jpeg")) {
        return Err("expected a .png, .jpg or .jpeg path".into());
    }

    let root = worktree.root_path();
    let input = format!("{}/{}", root.trim_end_matches('/'), rel);
    let output = match input.rfind('.') {
        Some(i) if i > input.rfind('/').unwrap_or(0) => format!("{}.svg", &input[..i]),
        _ => format!("{input}.svg"),
    };

    let bin = ext.vectors_binary(worktree)?;
    let output_result = run_vectors(&bin, &input, &output)?;

    if output_result.status != Some(0) {
        let stderr = String::from_utf8_lossy(&output_result.stderr);
        return Err(format!("vectors failed: {}", stderr.trim()));
    }

    let out_name = output.rsplit('/').next().unwrap_or(&output);
    Ok(zed::SlashCommandOutput {
        text: format!("Converted `{rel}` → `{out_name}`"),
        sections: vec![],
    })
}

/// Runs the vectors binary, trying `./<name>` first (the extension working
/// directory, where `download_file` places binaries) and then the bare name
/// (PATH lookup) if spawning fails.
fn run_vectors(bin: &str, input: &str, output: &str) -> zed::Result<zed::process::Output> {
    let mut last_err = String::new();
    for candidate in [format!("./{bin}"), bin.to_string()] {
        match Command::new(&candidate).arg(input).arg(output).output() {
            Ok(out) => return Ok(out),
            Err(e) => last_err = e,
        }
    }
    Err(last_err)
}

impl VectorsExtension {
    fn vectors_binary(&self, worktree: &zed::Worktree) -> zed::Result<String> {
        if let Some(path) = worktree.which("vectors") {
            return Ok(path);
        }

        let mut cache = self.binary.lock().map_err(|e| e.to_string())?;
        if let Some(path) = cache.as_ref() {
            return Ok(path.clone());
        }

        let (os, arch) = zed::current_platform();
        let (asset, local_name) = match (os, arch) {
            (zed::Os::Mac, zed::Architecture::Aarch64) => {
                ("cli-vectors-aarch64-apple-darwin", BINARY_NAME)
            }
            (zed::Os::Linux, zed::Architecture::X8664) => {
                ("cli-vectors-x86_64-unknown-linux-gnu", BINARY_NAME)
            }
            (zed::Os::Windows, zed::Architecture::X8664) => {
                ("cli-vectors-x86_64-pc-windows-msvc.exe", "vectors-cli.exe")
            }
            _ => return Err("no vectors release binary for this platform".into()),
        };

        let url = format!("{RELEASE_BASE}/{asset}");
        zed::download_file(&url, local_name, DownloadedFileType::Uncompressed)?;
        if os != zed::Os::Windows {
            zed::make_file_executable(local_name)?;
        }

        *cache = Some(local_name.to_string());
        Ok(local_name.to_string())
    }
}

zed::register_extension!(VectorsExtension);

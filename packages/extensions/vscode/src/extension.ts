import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { initSync, WasmRaster, WasmTraceConfig, trace } from '@vectors/core';

const IMAGE_RE = /\.(png|jpe?g)$/i;
const wasmPath = path.join(__dirname, 'vectors_bg.wasm');

let ready = false;
const ensureWasm = (): void => {
  if (!ready) {
    initSync(fs.readFileSync(wasmPath));
    ready = true;
  }
};

const svgTargetFor = (src: vscode.Uri): vscode.Uri =>
  src.with({ path: src.path.replace(/\.[a-z0-9]+$/i, '') + '.svg' });

const pickImage = async (): Promise<vscode.Uri | undefined> => {
  const editor = vscode.window.activeTextEditor;
  if (
    editor?.document.uri.scheme === 'file' &&
    IMAGE_RE.test(editor.document.uri.fsPath)
  ) {
    return editor.document.uri;
  }
  const picked = await vscode.window.showOpenDialog({
    canSelectMany: false,
    canSelectFolders: false,
    filters: { Images: ['png', 'jpg', 'jpeg'] },
    title: 'Select an image to convert to SVG',
  });
  return picked?.[0];
};

const convert = async (src: vscode.Uri): Promise<void> => {
  const bytes = await vscode.workspace.fs.readFile(src);
  ensureWasm();

  const raster = WasmRaster.from_bytes(bytes);
  let svg: string;
  try {
    svg = trace(raster, new WasmTraceConfig()).svg;
  } finally {
    raster.free();
  }

  let target = svgTargetFor(src);
  if (await fileExists(target)) {
    const picked = await vscode.window.showSaveDialog({
      defaultUri: target,
      filters: { SVG: ['svg'] },
      title: 'Save converted SVG',
    });
    if (!picked) return;
    target = picked;
  }

  await vscode.workspace.fs.writeFile(target, new TextEncoder().encode(svg));
  vscode.window.showInformationMessage(
    `Vectors: saved ${path.basename(target.fsPath)}`
  );
};

const fileExists = async (uri: vscode.Uri): Promise<boolean> => {
  try {
    await vscode.workspace.fs.stat(uri);
    return true;
  } catch {
    return false;
  }
};

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'vectors.convertToSvg',
      async (arg?: vscode.Uri) => {
        try {
          // Menu invocations pass the clicked resource; the palette passes
          // nothing and falls back to the active editor / open dialog.
          const src = arg instanceof vscode.Uri ? arg : await pickImage();
          if (!src) return;
          await convert(src);
        } catch (err) {
          vscode.window.showErrorMessage(
            `Vectors: conversion failed — ${err instanceof Error ? err.message : String(err)}`
          );
        }
      }
    )
  );
}

export function deactivate(): void {}

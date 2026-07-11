/**
 * Markdown rendering helper for the /preview/* surface.
 *
 * Uses `marked` (already installed in apps/web). Draft content lives as
 * plain markdown under drafts/, brand/, research/, and state/ — this
 * helper reads a file from disk and returns rendered HTML for embedding
 * inside <MarkdownPreview>.
 *
 * NOTE: Files are read server-side only. The path argument is
 * server-controlled (routes pass absolute paths to repo files); never
 * expose this helper to user input.
 */

import { marked } from 'marked';
import { readFile } from 'node:fs/promises';

marked.use({ gfm: true, breaks: false });

export async function renderMarkdownFromPath(absolutePath: string): Promise<string> {
  const raw = await readFile(absolutePath, 'utf-8');
  return marked.parse(raw) as string;
}
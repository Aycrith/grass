/**
 * MarkdownPreview — renders pre-rendered HTML inside a styled container.
 *
 * Used by every /preview/* route. Styled to match brand typography
 * (Inter, ll-charcoal body, ll-green H3) and to look like a readable
 * document. Cross-links to repo files (.md) are intercepted by the
 * top-level layout so they don't 404 when clicked.
 */

export function MarkdownPreview({ content }: { content: string }) {
  return (
    <article
      className="markdown-preview"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted local content
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
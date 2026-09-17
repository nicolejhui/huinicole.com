# huinicole.io

Personal site built as static HTML/CSS/JS (no framework, no build step). Posts live in `writing/*.js` and are collected in `posts.js`.

## Content rules

- Never change the wording of post content (titles, headings, dek, body paragraphs) that the user supplies. Copy it in as-is, including colons/punctuation in headings.
- Only touch content text if the user explicitly asks for a copy edit or rewrite.
- Formatting, structure, styling, and code (script.js, style.css, posts.js wiring) can be changed freely as needed to implement requests.

## Workflow

- Before pushing any change, start a local build/server and let the user verify it themselves. Do not commit/push until they confirm.

## Design source of truth

- The claude.ai/design project "Feminine writing blog design" (projectId `7cde0b81-fe59-4467-bfa7-939cc39fb3dc`, file `Nicole Hui.dc.html`) is the source of truth for design decisions on this site: type scale, colors, spacing, component layout (lists, cards, figures, etc.).
- Use the DesignSync tool (`get_project`/`list_files`/`get_file`) to read it when making styling or layout decisions, or when a design choice is ambiguous.
- This applies to design only, never content. Copy/wording still comes from what the user supplies directly (see Content rules above) — the design project's own placeholder/sample text is not a content source.

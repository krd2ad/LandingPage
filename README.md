# Personal Landing Page

Personal portfolio and landing page hosted at [kiernan.co](https://kiernan.co) (via GitHub Pages). Features a projects section, AI articles feed, and a 2026 reading challenge tracker.

## Stack

- Static HTML + Tailwind CSS v3
- No JavaScript framework — vanilla JS for the reading widget
- GitHub Pages (`/docs` folder as source)

## Structure

```
docs/           → served by GitHub Pages
  index.html    → main page
  js/
    reading-challenge.js  → renders book cards from books-2026.json
  dist/
    output.css  → compiled Tailwind (auto-generated, do not edit)
  articles.json → latest AI articles (auto-updated weekly)
  books-2026.json → reading progress (auto-generated from Goodreads export)

src/
  input.css     → Tailwind directives

scripts/
  generate-books.js   → parses Goodreads CSV + manual-books.json → books-2026.json
  update_articles.py  → fetches latest arXiv CS.AI articles → articles.json

data/
  goodreads_library_export.csv  → Goodreads export (update to refresh book data)
  manual-books.json             → books not in Goodreads
```

## Dev

```bash
npm install
npm run build         # compile Tailwind CSS → docs/dist/output.css
npm run build:books   # regenerate books-2026.json from Goodreads export
```

Open `docs/index.html` directly in a browser to preview — no dev server needed.

## Automated workflows

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `build-tailwind.yml` | Push to `main` | Runs `build:books` + Tailwind compile, auto-commits generated files |
| `update_articles.yml` | Weekly (Sun 8am UTC) + manual | Fetches latest 3 arXiv CS.AI articles, updates `articles.json` |

## Updating content

**Books** — export your Goodreads library as CSV, replace `data/goodreads_library_export.csv`, then push. The CI workflow regenerates `books-2026.json` automatically. To add books not in Goodreads, edit `data/manual-books.json`.

**Projects / bio** — edit `docs/index.html` directly.

**Reading goal** — change the `goal` value in `scripts/generate-books.js` (currently 24 books).

## Questions

Reach out on [LinkedIn](https://www.linkedin.com/in/kiernan-dimeglio/).

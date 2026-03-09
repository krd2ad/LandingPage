const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const ROOT = path.resolve(__dirname, "..");
const goodreadsPath = path.join(ROOT, "data", "goodreads_library_export.csv");
const manualPath = path.join(ROOT, "data", "manual-books.json");
const outputPath = path.join(ROOT, "docs", "data", "books-2026.json");

const GOAL = 24;
const YEAR = 2026;

function normalizeIsbn(value) {
  if (!value) return "";
  return String(value).replace(/[^0-9Xx]/g, "");
}

function toIsoDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return "";
  const match = dateStr.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
  if (!match) return "";
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function buildCoverUrl(isbn13, isbn10) {
  const clean13 = normalizeIsbn(isbn13);
  const clean10 = normalizeIsbn(isbn10);

  if (clean13) return `https://covers.openlibrary.org/b/isbn/${clean13}-L.jpg`;
  if (clean10) return `https://covers.openlibrary.org/b/isbn/${clean10}-L.jpg`;
  return "";
}

function safeReadJson(filePath, fallback = []) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

const csvRaw = fs.readFileSync(goodreadsPath, "utf8");
const records = parse(csvRaw, {
  columns: true,
  skip_empty_lines: true
});

const goodreadsBooks = records
  .map((row) => {
    const isoDate = toIsoDate(row["Date Read"]);
    if (!isoDate.startsWith(`${YEAR}-`)) return null;

    return {
      title: row["Title"] || "",
      author: row["Author"] || "",
      dateRead: isoDate,
      rating: Number(row["My Rating"] || 0),
      averageRating: Number(row["Average Rating"] || 0),
      pages: Number(row["Number of Pages"] || 0),
      yearPublished: Number(row["Year Published"] || 0),
      isbn: normalizeIsbn(row["ISBN"]),
      isbn13: normalizeIsbn(row["ISBN13"]),
      coverUrl: buildCoverUrl(row["ISBN13"], row["ISBN"]),
      source: "goodreads"
    };
  })
  .filter(Boolean);

const manualBooks = safeReadJson(manualPath, []).map((book) => ({
  title: book.title || "",
  author: book.author || "",
  dateRead: book.dateRead || "",
  rating: Number(book.rating || 0),
  averageRating: 0,
  pages: Number(book.pages || 0),
  yearPublished: Number(book.yearPublished || 0),
  isbn: normalizeIsbn(book.isbn || ""),
  isbn13: normalizeIsbn(book.isbn13 || ""),
  coverUrl: book.coverUrl || buildCoverUrl(book.isbn13, book.isbn),
  source: book.source || "manual"
}));

const merged = [...goodreadsBooks, ...manualBooks]
  .filter((book) => book.dateRead.startsWith(`${YEAR}-`))
  .sort((a, b) => new Date(b.dateRead) - new Date(a.dateRead));

const output = {
  year: YEAR,
  goal: GOAL,
  count: merged.length,
  percent: Math.round((merged.length / GOAL) * 100),
  updatedAt: new Date().toISOString(),
  books: merged
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`Generated ${outputPath} with ${merged.length} books.`);

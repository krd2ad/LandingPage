async function loadReadingChallenge() {
  const section = document.getElementById("reading-challenge-widget");
  if (!section) return;

  try {
    const res = await fetch("data/books-2026.json");
    if (!res.ok) throw new Error("Could not load books-2026.json");

    const data = await res.json();
    renderReadingChallenge(data);
  } catch (err) {
    section.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 class="text-2xl font-semibold mb-2">📚 2026 Reading Challenge</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Reading data is unavailable right now.
        </p>
      </div>
    `;
  }
}

function renderReadingChallenge(data) {
  const section = document.getElementById("reading-challenge-widget");
  const books = Array.isArray(data.books) ? data.books : [];

  section.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
      <div class="flex flex-col gap-2">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 class="text-2xl font-bold tracking-tight">📚 ${data.year} Reading Challenge</h2>
          <div class="text-xs text-gray-400 dark:text-gray-500 sm:text-right shrink-0">
            Updated ${formatUpdatedDate(data.updatedAt)}
          </div>
        </div>

        <p class="text-base text-gray-600 dark:text-gray-300">
          ${data.count} out of ${data.goal} books completed
        </p>
      </div>

      <div class="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div class="mb-6">
          <div class="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1">
            <span class="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-300">
              Recently Finished
            </span>
          </div>
          <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Books completed in ${data.year}, newest first.
          </p>
        </div>

        <div class="rounded-2xl bg-gray-50 dark:bg-gray-900 p-4 md:p-5">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            ${books.map(bookCard).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function bookCard(book) {
  const title = escapeHtml(book.title || "Untitled");
  const author = escapeHtml(book.author || "Unknown Author");
  const finishedLabel = formatFinishedDate(book.dateRead || "");
  const isbn = escapeHtml(book.isbn13 || book.isbn || "");

  return `
    <article class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
      <h4 class="text-lg font-semibold leading-snug break-words">${title}</h4>
      <p class="mt-3 text-sm text-gray-600 dark:text-gray-300">${author}</p>
      <div class="mt-4 space-y-1">
        <p class="text-sm text-gray-500 dark:text-gray-400">${finishedLabel}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">ISBN: ${isbn || "Not available"}</p>
      </div>
    </article>
  `;
}

function formatFinishedDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(date.getTime())) return `Date Finished: ${dateStr}`;

  return `Date Finished: ${date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric"
  })}`;
}

function formatUpdatedDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("DOMContentLoaded", loadReadingChallenge);

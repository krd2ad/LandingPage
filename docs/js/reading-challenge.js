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
  const percent = Math.max(0, Math.min(data.percent || 0, 100));
  const books = Array.isArray(data.books) ? data.books : [];
  const recentBooks = books.slice(0, 8);
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference * (1 - percent / 100);

  section.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        <div>
          <h2 class="text-3xl font-bold tracking-tight">📚 ${data.year} Reading Challenge</h2>
          <p class="mt-2 text-base text-gray-600 dark:text-gray-300">
            ${data.count} of ${data.goal} books completed
          </p>
        </div>

        <div class="flex items-center gap-6">
          <div class="relative w-36 h-36 shrink-0">
            <svg class="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="52"
                stroke="currentColor"
                stroke-width="8"
                fill="none"
                class="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                stroke="currentColor"
                stroke-width="8"
                fill="none"
                stroke-linecap="round"
                class="text-blue-600"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${dashOffset}"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div class="text-3xl font-bold leading-none">${data.count}/${data.goal}</div>
              <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">books</div>
            </div>
          </div>

          <div>
            <div class="text-4xl font-bold leading-none">${percent}%</div>
            <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">of annual goal</div>
          </div>
        </div>
      </div>

      <div class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-semibold uppercase tracking-[0.15em] text-gray-500 dark:text-gray-400">
            Recently Finished
          </h3>
          <span class="text-xs text-gray-400 dark:text-gray-500">
            Updated ${formatUpdatedDate(data.updatedAt)}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          ${recentBooks.map(bookCard).join("")}
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
    <article class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 shadow-sm">
      <h4 class="text-base font-semibold leading-snug break-words">${title}</h4>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">${author}</p>
      <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">${finishedLabel}</p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        ISBN: ${isbn || "Not available"}
      </p>
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

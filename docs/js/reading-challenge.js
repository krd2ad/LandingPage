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
        <h2 class="text-xl font-semibold mb-3">📚 2026 Reading Challenge</h2>
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
  const recentBooks = books.slice(0, 6);
  const circumference = 2 * Math.PI * 48;
  const dashOffset = circumference * (1 - percent / 100);

  section.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        <div class="flex-1">
          <h2 class="text-2xl font-semibold">📚 ${data.year} Reading Challenge</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            ${data.count} of ${data.goal} books completed
          </p>

          <div class="mt-6 flex flex-col sm:flex-row sm:items-center gap-6">
            <div class="relative w-40 h-40 shrink-0">
              <svg class="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  stroke="currentColor"
                  stroke-width="10"
                  fill="none"
                  class="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  stroke="currentColor"
                  stroke-width="10"
                  fill="none"
                  stroke-linecap="round"
                  class="text-blue-600"
                  stroke-dasharray="${circumference}"
                  stroke-dashoffset="${dashOffset}"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div class="text-3xl font-bold">${data.count}/${data.goal}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">${percent}%</div>
              </div>
            </div>

            <div>
              <div class="text-3xl font-bold">${percent}%</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">of annual goal</div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-4">
          Recently Finished
        </h3>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          ${recentBooks.map(bookCard).join("")}
        </div>
      </div>
    </div>
  `;
}

function bookCard(book) {
  const title = escapeHtml(book.title || "Untitled");
  const author = escapeHtml(book.author || "Unknown Author");
  const dateRead = formatDate(book.dateRead || "");
  const coverUrl = book.coverUrl || "";
  const initials = getInitials(title);

  return `
    <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900">
      ${
        coverUrl
          ? `<img
              src="${coverUrl}"
              alt="Cover of ${title}"
              class="w-full aspect-[2/3] object-cover"
              loading="lazy"
              onerror="this.outerHTML='<div class=&quot;w-full aspect-[2/3] flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-lg&quot;>${initials}</div>'"
            />`
          : `<div class="w-full aspect-[2/3] flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-lg">${initials}</div>`
      }
      <div class="p-3">
        <div class="text-sm font-medium leading-tight line-clamp-2">${title}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">${author}</div>
        <div class="text-xs text-gray-400 dark:text-gray-500 mt-2">${dateRead}</div>
      </div>
    </div>
  `;
}

function getInitials(text) {
  return text
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
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

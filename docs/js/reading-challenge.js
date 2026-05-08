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
  const pct = Math.min(100, Math.round((data.count / data.goal) * 100));

  section.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">📚 ${data.year} Reading Challenge</h2>
          <p class="mt-1 text-base text-gray-600 dark:text-gray-300">
            <span class="font-semibold text-gray-900 dark:text-gray-100">${data.count}</span>
            <span class="text-gray-400"> / ${data.goal} books</span>
          </p>
        </div>
        <p class="text-sm text-gray-400 dark:text-gray-500 sm:text-right">
          Updated ${formatUpdatedDate(data.updatedAt)}
        </p>
      </div>

      <div class="mt-4">
        <div class="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
          <div class="h-2 rounded-full bg-blue-500 transition-all" style="width:${pct}%"></div>
        </div>
        <p class="mt-1 text-xs text-gray-400">${pct}% of goal</p>
      </div>

      <div class="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        ${books.map(bookCard).join("")}
      </div>
    </div>
  `;
}

function bookCard(book) {
  const title = escapeHtml(book.title || "Untitled");
  const author = escapeHtml(book.author || "Unknown Author");
  const cover = book.coverUrl || "";
  const stars = book.rating ? "★".repeat(book.rating) + "☆".repeat(5 - book.rating) : "";
  const month = book.dateRead
    ? new Date(book.dateRead + "T00:00:00").toLocaleDateString(undefined, { month: "short", year: "numeric" })
    : "";

  const googleCover = isbn
    ? `https://books.google.com/books/content?vid=ISBN${isbn}&printsec=frontcover&img=1&zoom=1`
    : "";

  const coverHtml = cover
    ? `<img src="${cover}" alt="${title}" class="w-full h-full object-cover" loading="lazy" onerror="${googleCover ? `this.src='${googleCover}';this.onerror=function(){this.parentElement.innerHTML=fallbackCover('${title}')};` : `this.parentElement.innerHTML=fallbackCover('${title}');`}">`
    : googleCover
      ? `<img src="${googleCover}" alt="${title}" class="w-full h-full object-cover" loading="lazy" onerror="this.parentElement.innerHTML=fallbackCover('${title}')">`
      : fallbackCover(title);

  return `
    <article class="flex flex-col gap-2">
      <div class="relative w-full h-28 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-sm">
        ${coverHtml}
      </div>
      <div class="min-w-0">
        <p class="text-xs font-semibold leading-snug line-clamp-2 text-gray-900 dark:text-gray-100">${title}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">${author}</p>
        ${stars ? `<p class="text-xs text-amber-400 mt-0.5 tracking-tight">${stars}</p>` : ""}
        ${month ? `<p class="text-xs text-gray-400 mt-0.5">${month}</p>` : ""}
      </div>
    </article>
  `;
}

function fallbackCover(title) {
  const initial = String(title).trim()[0] || "?";
  return `<div class="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400 dark:text-gray-500 select-none">${escapeHtml(initial)}</div>`;
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

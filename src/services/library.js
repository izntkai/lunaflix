const MY_LIST_KEY = "lunaflix-my-list";
const CONTINUE_KEY = "lunaflix-continue";

function read(key) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("lunaflix-library-update"));
}

export function getMyList() {
  return read(MY_LIST_KEY);
}

export function isInMyList(id, type) {
  return getMyList().some((item) => String(item.id) === String(id) && item.type === type);
}

export function toggleMyList(item) {
  const current = getMyList();
  const exists = current.some(
    (entry) => String(entry.id) === String(item.id) && entry.type === item.type,
  );

  if (exists) {
    write(
      MY_LIST_KEY,
      current.filter(
        (entry) => !(String(entry.id) === String(item.id) && entry.type === item.type),
      ),
    );
    return false;
  }

  write(MY_LIST_KEY, [{ ...item, savedAt: Date.now() }, ...current].slice(0, 120));
  return true;
}

export function getContinueWatching() {
  return read(CONTINUE_KEY).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export function upsertContinueWatching(entry) {
  if (!entry?.id || !entry?.type) return;
  const current = getContinueWatching().filter(
    (item) => !(String(item.id) === String(entry.id) && item.type === entry.type),
  );

  write(
    CONTINUE_KEY,
    [{ ...entry, updatedAt: Date.now() }, ...current].slice(0, 80),
  );
}

export function removeContinueWatching(id, type) {
  write(
    CONTINUE_KEY,
    getContinueWatching().filter(
      (item) => !(String(item.id) === String(id) && item.type === type),
    ),
  );
}

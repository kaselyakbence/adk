// Which events this browser asked to be reminded about - only used to show
// the "Remind me" button's on/off state. The backend is what actually
// sends the reminder.
const STORAGE_KEY = "eventReminders";

export function getStoredReminders(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return new Set(
      Array.isArray(parsed)
        ? parsed.filter((id): id is number => typeof id === "number")
        : [],
    );
  } catch {
    return new Set();
  }
}

export function setStoredReminders(ids: Set<number>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // Private mode / storage blocked - the reminder itself still works,
    // the button just won't remember its state across reloads.
  }
}

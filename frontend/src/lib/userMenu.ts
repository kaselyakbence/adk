// sessionStorage flag: "reopen the user menu on the next page". Set by the
// language switcher just before it navigates to the other locale (which
// remounts the navbar), read and cleared by the navbar on mount.
export const REOPEN_USER_MENU_KEY = "reopenUserMenu";

export function consumeReopenUserMenu(): boolean {
  try {
    if (sessionStorage.getItem(REOPEN_USER_MENU_KEY) !== "1") return false;
    sessionStorage.removeItem(REOPEN_USER_MENU_KEY);
    return true;
  } catch {
    return false;
  }
}

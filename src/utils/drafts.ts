export function shouldShowDrafts(): boolean {
  if (import.meta.env.PROD) {
    return false;
  }

  const raw =
    process.env.SHOW_DRAFTS ??
    process.env.PUBLIC_SHOW_DRAFTS ??
    import.meta.env["PUBLIC_SHOW_DRAFTS"] ??
    import.meta.env["SHOW_DRAFTS"];

  if (raw === undefined) {
    return true;
  }

  return String(raw).toLowerCase() === "true";
}

export function isDraftVisible(draft?: boolean): boolean {
  return draft !== true || shouldShowDrafts();
}

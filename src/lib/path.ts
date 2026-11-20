export function normalizePath(path: string): string {
  if (path !== "/" && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function isCurrent(pathname: string, href: string): boolean {
  return normalizePath(pathname) === normalizePath(href);
}

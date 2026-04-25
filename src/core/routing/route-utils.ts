import { ActivatedRoute } from '@angular/router';

/**
 * Reads a param from the current route or any ancestor (needed for nested `dossier/:code/...` routes).
 */
export function getRouteParam(
  route: ActivatedRoute,
  key: string
): string | null {
  let current: ActivatedRoute | null = route;
  while (current) {
    const v = current.snapshot.paramMap.get(key);
    if (v) {
      return v;
    }
    current = current.parent;
  }
  return null;
}

export function readFilters() {
  const p = new URLSearchParams(window.location.search);
  return { ward: p.get('ward') || 'ALL', nightOnly: p.get('night') === 'true', search: p.get('search') || '' };
}
export function writeFilters(filters) {
  const p = new URLSearchParams();
  if (filters.ward && filters.ward !== 'ALL') p.set('ward', filters.ward);
  if (filters.nightOnly) p.set('night', 'true');
  if (filters.search) p.set('search', filters.search);
  const next = `${window.location.pathname}${p.toString() ? `?${p}` : ''}`;
  window.history.replaceState({}, '', next);
}

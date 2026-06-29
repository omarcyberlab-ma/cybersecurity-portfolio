export function renderErrorPage(err: any) {
  return `<!doctype html><html><body><h1>Something went sideways</h1><pre>${String(err)}</pre></body></html>`;
}

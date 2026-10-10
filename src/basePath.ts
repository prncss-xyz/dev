/**
 * Compute the waku/router basePath with exactly one trailing slash.
 *
 * Pure and runner-agnostic: the caller passes the env map it can actually
 * see. This keeps the formula in one place so app code (Vite, via
 * `import.meta.env`) and Playwright config (Node, via `process.env`)
 * can't drift apart — without coupling this module to either source.
 */
export function buildBasePath(env: { VITE_BASE_PATH?: string }): string {
	return (env.VITE_BASE_PATH ?? '').replace(/\/+$/, '') + '/'
}

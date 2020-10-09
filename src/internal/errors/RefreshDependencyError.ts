export class RefreshDependencyError extends Error {

	public readonly refresh = true;
}

export function isRefreshDependencyError(e: any): boolean {
	return e != null && e.refresh === true;
}
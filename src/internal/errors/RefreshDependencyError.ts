export class RefreshDependencyError extends Error {
	public readonly refresh: true = true;

	constructor(message: string, readonly invalidateId: string, readonly recursive: boolean = true) {
		super(message);
	}
}

export function isRefreshDependencyError(e: any): boolean {
	return e != null && e.refresh === true;
}

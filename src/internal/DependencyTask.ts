import {IDependencyNode, IDependencyTask, ITask} from './types';
import {isRefreshDependencyError} from "./errors/RefreshDependencyError";

export class DependencyTask implements IDependencyTask {

	private refreshes: Promise<any>[];

	get complete(): boolean {
		return this._nodes.find((n) => !n.value.complete) == null;
	}

	get running(): boolean {
		return this._nodes.find((n) => n.value.running) != null;
	}

	private paused: boolean;

	constructor(
		private readonly _nodes: IDependencyNode<ITask>[],
	) {
		this.paused = false;
		this.refreshes = [];
	}

	public async refresh(): Promise<void> {
		if (!this.paused) {
			const promises: Promise<void>[] = [];
			for (const node of this._nodes) {
				if (!node.value.complete && !node.value.running) {
					if (node.getEdges().find((n) => !n.value.complete) == null) {
						promises.push(node.value.run()
							.catch((e) => {
								if (!isRefreshDependencyError(e)) {
									throw e;
								}
								return null;
							}).then(() => this.refresh()));
					}
				}
			}
			await Promise.all(promises);
		}
	}

	public async run(): Promise<any> {
		this.paused = false;
		this.refreshes = [];
		await this.refresh();
	}

	public pause(): void {
		this.paused = true;
	}

	public invalidate() {
		for (const node of this._nodes) {
			node.value.invalidate();
		}
	}

	public invalidateById(id: string) {
		const node = this._nodes.find((n) => n.id === id);
		if (node) {
			node.value.invalidate();
		}
	}

}

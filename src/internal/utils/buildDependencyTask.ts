import {
	IBuildDependencyStep,
	IBuildDependencyTaskOptions,
	IBuildDependencyTaskStepOptions,
	ICancelableOptions,
	IDependencyTask,
} from "../types";
import {DependencyNode} from "../DependencyNode";
import {UnresolvedDependencyError} from "../errors/UnresolvedDependencyError";
import {DependencyTask} from "../DependencyTask";
import {Task} from "../Task";
import {retry} from "../callable-wrappers/retry";
import {optional} from "../callable-wrappers/optional";
import {wrap} from "../callable-wrappers/wrap";
import {onError} from "../callable-wrappers/onError";
import {cancelable} from "../callable-wrappers/cancelable";
import {skippable} from "../callable-wrappers/skippable";

export function buildDependencyTask<ContextT = undefined>(
	options: IBuildDependencyTaskOptions<ContextT>
): IDependencyTask {
	const defaults: any = options.defaults || {};
	const steps: IBuildDependencyStep<ContextT>[] = options.steps.map((s) => {
		const stepParams: any = s;
		for (const key of Object.keys(defaults)) {
			if (stepParams[key] === undefined) {
				stepParams[key] = defaults[key];
			}
		}
		let cancelOptions:
			| ICancelableOptions<IBuildDependencyTaskStepOptions<ContextT>>
			| undefined;
		if (s.isCanceled) {
			cancelOptions = {
				isCanceled: s.isCanceled,
				payload: s,
			};
		}
		let runnable = s.run;
		runnable = wrap(runnable, {
			before: s.beforeStep,
			param: s,
		});
		if (s.onError) {
			runnable = onError(runnable, {
				onError: s.onError,
			});
		}if (s.retry != null) {
			const maxRetries = s.retry === true ? 0 : s.retry;
			runnable = retry(runnable, {
				maxRetries,
				retryDelay: s.retryDelay,
				cancelOptions,
			});
		} else {
			if (s.optional) {
				runnable = optional(runnable);
			}
			if (cancelOptions != null) {
				runnable = cancelable(runnable, cancelOptions);
			}
		}
		runnable = wrap(runnable, {
			after: s.afterStep,
			param: s,
		});
		if (s.skip) {
			runnable = skippable(runnable, {
				skip: s.skip,
				payload: s,
			});
		}
		return {
			options: s,
			node: new DependencyNode(
				s.id,
				new Task<ContextT>(options.context, runnable)
			),
		};
	});
	for (const step of steps) {
		let dependencies: string[];
		if (typeof step.options.dependsOn === "string") {
			dependencies = [step.options.dependsOn];
		} else {
			dependencies = step.options.dependsOn || [];
		}
		for (const dependency of dependencies) {
			const dependencyStep = steps.find((s) => s.options.id === dependency);
			if (!dependencyStep) {
				throw new UnresolvedDependencyError();
			}
			step.node.addEdge(dependencyStep.node);
		}
	}
	return new DependencyTask(steps.map((s) => s.node));
}

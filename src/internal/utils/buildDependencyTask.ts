import {IBuildDependencyStep, IBuildDependencyTaskOptions, ITask} from '../types';
import {DependencyNode} from '../DependencyNode';
import {UnresolvedDependencyError} from '../errors/UnresolvedDependencyError';
import {DependencyTask} from '../DependencyTask';
import {Task} from '../Task';
import {retry} from '../callable-wrappers/retry';
import {optional} from '../callable-wrappers/optional';
import {wrap} from '../callable-wrappers/wrap';


export function buildDependencyTask<ContextT>(
    options: IBuildDependencyTaskOptions<ContextT>,
): ITask {
    const steps: IBuildDependencyStep<ContextT>[] = options.steps.map((s) => {
        let runnable = s.run;
        if (s.optional) {
            runnable = optional(runnable);
        } else if (s.retry != null) {
            const maxRetries = s.retry === true ? 0 : s.retry;
            runnable = retry(runnable, {
                maxRetries,
                retryDelay: s.retryDelay,
            });
        }
        runnable = wrap(runnable, {
            before: options.beforeStep,
            after: options.afterStep,
            param: s,
        });
        return {
            options: s,
            node: new DependencyNode(new Task(options.context, runnable)),
        }
    });
    for (const step of steps) {
        let dependencies: string[];
        if (typeof step.options.dependsOn === 'string') {
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
    return new DependencyTask(steps.map((s) => s.node))
}

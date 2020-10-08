import {DependencyNode} from '../DependencyNode';
import {DependencyTask} from '../DependencyTask';
import {Task} from '../Task';
import {delay} from '../utils/delay';

describe('DependencyTask', () => {
    it('should call the children task', async (done) => {
        let called = false;
        const task = new DependencyTask([
            new DependencyNode('', new Task(null, (async () => {
                called = true;
            }))),
        ]);
        await task.run();
        expect(called).toBeTruthy();
        done();
    });
    it('should respect dependencies', async (done) => {
        let callTime1 = 0;
        let callTime2 = 0;
        const node1 = new DependencyNode('', new Task(null, (async () => {
            callTime1 = Date.now();
            await delay(100);
        })));
        const node2 = new DependencyNode('', new Task(null, (async () => {
            callTime2 = Date.now();
        })));
        node2.addEdge(node1);
        const task = new DependencyTask([node1, node2]);
        await task.run();
        expect(callTime1).toBeLessThan(callTime2);
        done();
    });
});

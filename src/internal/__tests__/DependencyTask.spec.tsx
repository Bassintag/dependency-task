import { DependencyNode } from '../DependencyNode';
import { DependencyTask } from '../DependencyTask';
import { Task } from '../Task';
import { delay } from '../utils/delay';
import { RefreshDependencyError } from '../..';

describe('DependencyTask', () => {
	it('should call the children task', async (done) => {
		let called = false;
		const task = new DependencyTask([
			new DependencyNode(
				'',
				new Task(null, async () => {
					called = true;
				})
			),
		]);
		await task.run();
		expect(called).toBeTruthy();
		done();
	});
	it('should respect dependencies', async (done) => {
		let callTime1 = 0;
		let callTime2 = 0;
		const node1 = new DependencyNode(
			'',
			new Task(null, async () => {
				callTime1 = Date.now();
				await delay(100);
			})
		);
		const node2 = new DependencyNode(
			'',
			new Task(null, async () => {
				callTime2 = Date.now();
			})
		);
		node2.addEdge(node1);
		const task = new DependencyTask([node1, node2]);
		await task.run();
		expect(callTime1).toBeLessThan(callTime2);
		done();
	});
	it('should allow invalidation', async (done) => {
		let callTimes = 0;
		let task: DependencyTask;
		const node1 = new DependencyNode(
			'1',
			new Task(null, async () => {
				callTimes += 1;
				await delay(100);
			})
		);
		const node2 = new DependencyNode(
			'2',
			new Task(null, async () => {
				if (callTimes < 2) {
					throw new RefreshDependencyError('', '1');
				}
			})
		);
		node2.addEdge(node1);
		task = new DependencyTask([node1, node2]);
		await task.run();
		expect(callTimes).toBe(2);
		done();
	});
	it('should allow recursive invalidation', async (done) => {
		let callTimes = 0;
		let callTimes1 = 0;
		let task: DependencyTask;
		const node1 = new DependencyNode(
			'1',
			new Task(null, async () => {
				callTimes += 1;
				await delay(100);
			})
		);
		const node2 = new DependencyNode(
			'2',
			new Task(null, async () => {
				callTimes1 += 1;
				await delay(100);
			})
		);
		const node3 = new DependencyNode(
			'3',
			new Task(null, async () => {
				if (callTimes < 2) {
					throw new RefreshDependencyError('', '1');
				}
			})
		);
		node2.addEdge(node1);
		node3.addEdge(node2);
		task = new DependencyTask([node1, node2, node3]);
		await task.run();
		expect(callTimes).toBe(2);
		expect(callTimes1).toBe(2);
		done();
	});
});

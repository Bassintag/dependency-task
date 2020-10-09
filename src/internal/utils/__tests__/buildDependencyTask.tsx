import {buildDependencyTask} from "../buildDependencyTask";
import {IDependencyTask} from "../../types";
import {RefreshDependencyError} from "../../errors/RefreshDependencyError";

describe("buildDependencyTask", () => {
	it("should let the callable resolve", async (done) => {
		let ran1: boolean = false;
		let ran2: boolean = false;
		await buildDependencyTask({
			steps: [
				{
					id: "1",
					skip: () => {
						return true;
					},
					run: async () => {
						ran1 = true;
					},
				},
				{
					id: "2",
					dependsOn: '1',
					run: async () => {
						expect(ran1).toBeFalsy();
						ran2 = true;
					},
				},
			],
			context: null,
		}).run();
		expect(ran1).toBeFalsy();
		expect(ran2).toBeTruthy();
		done();
	});

	it("should allow invalidation", async (done) => {
		let ranCount1 = 0;
		let ranCount2 = 0;
		const task: IDependencyTask = buildDependencyTask({
			steps: [
				{
					id: '1',
					run: async () => {
						expect(ranCount2).toEqual(ranCount1);
						ranCount1 += 1;
					},
				},
				{
					id: '2',
					dependsOn: '1',
					retry: true,
					run: async () => {
						ranCount2 += 1;
						if (ranCount1 < 2) {
							expect(ranCount1).toEqual(1);
							throw new Error();
						}
						expect(ranCount1).toEqual(2);
					},
					onError: () => {
						expect(ranCount1).toEqual(1);
						expect(ranCount2).toEqual(1);
						task.invalidateById('1');
						throw new RefreshDependencyError();
					}
				},
			],
			context: null,
		});
		await task.run();
		expect(ranCount1).toEqual(2);
		expect(ranCount2).toEqual(2);
		done();
	});
});

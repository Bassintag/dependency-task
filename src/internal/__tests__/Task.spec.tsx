import {Task} from '../Task';
import {ITaskCallable} from '../types';

describe('Task', () => {
    const sampleRunner: ITaskCallable = async () => {
    };

    let task: Task<any>;

    beforeAll(() => {
        task = new Task(undefined, sampleRunner);
    });

    it('should be completed after running', async (done) => {
        expect(task.complete).toBeFalsy();
        await task.run();
        expect(task.complete).toBeTruthy();
        done();
    });
});

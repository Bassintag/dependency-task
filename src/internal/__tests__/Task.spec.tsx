import {Task} from '../Task';
import {ITaskCallable} from '../types';

describe('Task', () => {
    const sampleRunner: ITaskCallable = async () => {
    };

    let task: Task<any>;

    beforeAll(() => {
        task = new Task(undefined, sampleRunner);
    });

    afterAll(() => {
        task.dispose();
    });

    it('should have a complete which is subscribable', () => {
        task.complete.subscribe().unsubscribe();
    });

    it('should be disposable', () => {
        const task = new Task(undefined, sampleRunner);
        expect(task['_subject'].isStopped).toBeFalsy();
        task.dispose();
        expect(task['_subject'].isStopped).toBeTruthy();
    });

    it('should call the observable', (done) => {
        task.complete.subscribe(() => {
            done();
        });
        task.run();
    });
});

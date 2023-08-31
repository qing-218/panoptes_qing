type TaskCallback<T> = (instance: Java.Wrapper) => T;

interface ITask<T> {
    target: Java.Wrapper,
    callback: TaskCallback<T>,
    resolve: (result: T) => void,
    reject: (error: any) => void
}

export default class TaskRunnable {
    private static _instance: TaskRunnable | undefined;

    static get instance() {
        this._instance ??= new TaskRunnable();
        return this._instance;
    }

    private _tasks: Record<string, ITask<any>> = {};
    private _TaskRunnable: Java.Wrapper;

    constructor() {
        const self = this;
        this._TaskRunnable = Java.registerClass({
            name: `com.example.TaskRunnable`,
            implements: [Java.use('java.lang.Runnable')],
            methods: {
                'run': function() {
                    const task = self._tasks[this.hashCode()];
                    try {
                        task.resolve(task.callback(task.target));
                    } catch (err) {
                        task.reject(err);
                    } finally {
                        delete self._tasks[this.hashCode()];
                    }
                }
            }
        });
    }

    runAs<T>(target: Java.Wrapper, callback: TaskCallback<T>) {
        return new Promise<T>((resolve, reject) => {
            const runnable = this._TaskRunnable.$new();
            this._tasks[runnable.hashCode()] = { target, callback, resolve, reject };
            target.post(runnable);
        });
    }
}
export interface PromiseCallback<T> {
    (param?: any): Promise<T>;
}

export function sequentialPromises<T>(values: PromiseCallback<T>[]): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
        const results: T[] = [];
        const copy = values.slice();
        const len = copy.length;

        const iter = (i: number) => {
            if (i < len) {
                copy[i]()
                    .then(partialResult => {
                        results.push(partialResult);
                        iter(i + 1);
                    })
                    .catch(reject);
            }
            else {
                resolve(results);
            }
        };

        iter(0);
    });
}
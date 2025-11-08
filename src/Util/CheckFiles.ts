import { stat } from "node:fs/promises";

export function checkFiles(files: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const len = files.length;

        const file_iter = (i: number) => {
            if (i < len) {
                const f = files[i];
                stat(f)
                    .then(s => {
                        if (s.isFile()) {
                            file_iter(i + 1);
                        }
                        else {
                            reject(new Error(`${f} is not a file`));
                        }
                    })
                    .catch(err => {
                        if (err.code === 'ENOENT') {
                            reject(new Error(`The expected file \`${f}' was not found`));
                        }
                        else {
                            reject(err);
                        }
                    });
            }
            else {
                resolve();
            }
        };

        file_iter(0);
    });
}
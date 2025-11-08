import { getStdOutFromProcessExecution } from "./ExecuteProcess";

export function windowsRegQuery(key: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        getStdOutFromProcessExecution("reg", {
            args: ["query", key]
        })
            .then(result => {
                resolve(result.lines);
            })
            .catch(reject);
    });
}
import { getStdOutFromProcessExecution } from "./ExecuteProcess";

export function findProgram(program: string, verbose?: boolean): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        if (process.platform === 'win32') {
            getStdOutFromProcessExecution((process.env["COMSPEC"] || "cmd").trim(), {
                args: ["/C", "where", program],
                verbose: verbose
            })
                .then(result => {
                    const lines = result.lines;
                    if (lines.length > 0) {
                        resolve(lines[0]);
                    }
                    else {
                        reject(new Error("Internal error: the expected program path was not found."));
                    }
                })
                .catch(err => {
                    reject(new Error(`Unable to find ${program}`));
                });
        }
        else {
            getStdOutFromProcessExecution("which", {
                args: [program],
                verbose: verbose
            })
                .then(result => {
                    const lines = result.lines;
                    if (lines.length > 0) {
                        resolve(lines[0]);
                    }
                    else {
                        reject(new Error("Internal error: the expected program path was not found."));
                    }
                })
                .catch(err => {
                    reject(new Error(`Unable to find ${program}`));
                });
        }
    });
}
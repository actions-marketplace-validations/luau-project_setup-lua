import { spawn } from "node:child_process";

export interface ExecProcessInfo {
    cwd?: string | URL | undefined;
    args?: string[];
    verbose?: boolean;
    stdout?: (chunk: any) => void;
    stderr?: (err: any) => void;
}

export function executeProcess(tool: string, opts?: ExecProcessInfo): Promise<number | null> {
    return new Promise<number | null>((resolve, reject) => {
        const spawnOpts = { cwd: opts?.cwd };
        const p = (opts && opts.args) ? spawn(tool, opts.args, spawnOpts) : spawn(tool, spawnOpts);

        if (opts && opts.args && opts.verbose) {
            const values = [`"${tool}"`];
            for (const a of opts.args) {
                values.push(`"${a.replace(/"/g,"\\\"")}"`);
            }
            console.log(values.join(" "));
        }

        if (opts && opts.stdout) {
            p.stdout.on("data", opts.stdout);
        }
        if (opts && opts.stderr) {
            p.stderr.on("data", opts.stderr);
        }
        p.on("close", code => {
            if (code === 0) {
                resolve(code);
            }
            else {
                reject(code);
            }
        });
        p.on("error", err => {
            reject(err);
        })
    });
}

export interface StdOutFromProcessExecInfo {
    cwd?: string | URL | undefined;
    args?: string[];
    verbose?: boolean;
    stderr?: (err: any) => void;
}

export interface StdOutFromProcessExecResult {
    code: number | null;
    lines: string[];
}

export function getStdOutFromProcessExecution(tool: string, opts?: StdOutFromProcessExecInfo): Promise<StdOutFromProcessExecResult> {
    return new Promise<StdOutFromProcessExecResult>((resolve, reject) => {
        const spawnOpts = { cwd: opts?.cwd };
        const p = (opts && opts.args) ? spawn(tool, opts.args, spawnOpts) : spawn(tool, spawnOpts);
        const stdOutput: string[] = [];

        if (opts && opts.args && opts.verbose) {
            const values = [`"${tool}"`];
            for (const a of opts.args) {
                values.push(`"${a.replace(/"/g,"\\\"")}"`);
            }
            console.log(values.join(" "));
        }
        p.stdout.on("data", (chunk: any) => {
            stdOutput.push(<string>(chunk.toString()));
        });
        if (opts && opts.stderr) {
            p.stderr.on("data", opts.stderr);
        }
        p.on("close", code => {
            if (code === 0) {
                resolve({ code: code, lines: stdOutput.join('').split(/\r\n|\r|\n/) });
            }
            else {
                reject(code);
            }
        });
        p.on("error", err => {
            reject(err);
        })
    });
}

export function getFirstLineFromProcessExecution(tool: string, args: string[], verbose?: boolean): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        getStdOutFromProcessExecution(tool, { args: args, verbose: verbose })
            .then(result => {
                resolve(result.lines[0]);
            })
            .catch(reject);
    });
}
import { executeProcess } from "./ExecuteProcess";

export interface GitCloneOptions {
    ref?: string;
    singleBranch?: boolean;
    dir?: string;
    verbose?: boolean;
}

export function gitClone(url: string | URL, opts?: GitCloneOptions): Promise<number | null> {
    let args: string[] = ["clone"];
    if (opts && opts.ref) {
        args.push(`--branch=${opts.ref}`);
    }
    if (opts && opts.singleBranch) {
        args.push("--single-branch");
    }
    args.push(url.toString());
    if (opts && opts.dir) {
        args.push(opts.dir);
    }
    return executeProcess("git", { args: args, verbose: opts?.verbose })
}
import { executeProcess } from "./ExecuteProcess";

export interface ExtractTarGzOptions {
    cwd?: string;
    verbose?: boolean;
}

export function extractTarGz(inputFile: string, opts?: ExtractTarGzOptions): Promise<number | null> {
    return executeProcess("tar", { args: opts && opts.cwd ? ["-C", opts.cwd, "-xf", inputFile] : ["-xf", inputFile], verbose: opts?.verbose })
}
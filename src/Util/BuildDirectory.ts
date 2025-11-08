import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { IBuildDirectory } from "./IBuildDirectory";

export class BuildDirectory implements IBuildDirectory {
    private dir?: string;
    init(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            mkdtemp(join(tmpdir(), "setup-lua-"))
                .then(d => {
                    this.dir = d;
                    resolve(d);
                })
                .catch(reject)
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.dir) {
                rm(this.dir)
                    .then(resolve)
                    .catch(reject);
            }
            else {
                reject(new Error("BuildDirectory was not initialized"));
            }
        });
    }
}
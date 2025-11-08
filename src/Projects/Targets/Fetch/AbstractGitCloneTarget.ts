import { gitClone, GitCloneOptions } from "../../../Util/GitClone";
import { IProject } from "../../IProject";
import { ITarget } from "../ITarget";

export abstract class AbstractGitCloneTarget implements ITarget {
    private url: string | URL;
    private cloneOptions: GitCloneOptions;

    getUrl(): string | URL {
        return this.url;
    }

    getCloneOptions(): GitCloneOptions {
        return this.cloneOptions;
    }

    constructor(url: string | URL, cloneOptions?: GitCloneOptions) {
        this.url = url;
        this.cloneOptions = {};
        this.cloneOptions.ref = cloneOptions?.ref;
        this.cloneOptions.dir = cloneOptions?.dir;
        this.cloneOptions.singleBranch = cloneOptions?.singleBranch;
        this.cloneOptions.verbose = cloneOptions?.verbose;
    }
    abstract init(): Promise<void>;
    abstract getProject(): IProject;
    abstract getParent(): ITarget | null;
    abstract getNext(): ITarget | null;
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            gitClone(this.url, this.cloneOptions)
                .then(code => {
                    if (code === 0) {
                        resolve();
                    }
                    else {
                        reject(new Error("Failed to clone repository"));
                    }
                })
                .catch(reject);
        });
    }
    abstract finalize(): Promise<void>;
}
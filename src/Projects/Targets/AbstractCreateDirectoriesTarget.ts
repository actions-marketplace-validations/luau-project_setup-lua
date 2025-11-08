import { mkdir, stat } from "fs/promises";
import { ReadOnlyArray } from "../../Util/ReadOnlyArray";
import { ITarget } from "./ITarget";
import { IProject } from "../IProject";
import { IReadOnlyArray } from "../../Util/IReadOnlyArray";

export abstract class AbstractCreateDirectoriesTarget implements ITarget {
    private directories: IReadOnlyArray<string>;

    constructor(dirs: string[]) {
        this.directories = new ReadOnlyArray<string>(dirs);
    }
    abstract init(): Promise<void>;
    abstract finalize(): Promise<void>;
    abstract getProject(): IProject;
    abstract getParent(): ITarget | null;
    abstract getNext(): ITarget | null;

    getDirectories(): IReadOnlyArray<string> {
        return this.directories;
    }

    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const len = this.directories.getLenght();

            const dir_iter = (i: number) => {
                if (i < len) {
                    const dir = this.directories.getItem(i);
                    stat(dir)
                        .then(s => {
                            if (s.isDirectory()) {
                                dir_iter(i + 1);
                            }
                            else {
                                reject(new Error("The chosen path is already on disk, but it is not a directory"));
                            }
                        })
                        .catch(() => {
                            mkdir(dir, { recursive: true })
                                .then(() => {
                                    dir_iter(i + 1);
                                })
                                .catch(reject);
                        });
                }
                else {
                    resolve();
                }
            };

            dir_iter(0);
        });
    }
}
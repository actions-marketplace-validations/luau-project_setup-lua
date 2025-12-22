import { isAbsolute, join } from "node:path";
import { mkdtemp } from "node:fs/promises";
import { defaultStdOutHandler } from "../../Util/DefaultStdOutHandler";
import { executeProcess } from "../../Util/ExecuteProcess";
import { findGitForWindowsInstallDir } from "../../Util/FindGitForWindowsInstallDir";
import { findProgram } from "../../Util/FindProgram";
import { IProject } from "../IProject";
import { ITarget } from "./ITarget";
import { IReadOnlyArray } from "../../Util/IReadOnlyArray";
import { ReadOnlyArray } from "../../Util/ReadOnlyArray";
import { checkFiles } from "../../Util/CheckFiles";
import { downloadFile } from "../../Util/DownloadFile";

export abstract class AbstractApplyPatchesTarget implements ITarget {
    private project: IProject;
    private parent: ITarget | null;
    private dir: string;
    private remotePatchesDir: string;
    private patches: IReadOnlyArray<string>;
    constructor(project: IProject, parent: ITarget | null, dir: string, remotePatchesDir: string, patches: string[]) {
        this.project = project;
        this.parent = parent;
        this.dir = dir;
        this.remotePatchesDir = remotePatchesDir;
        this.patches = new ReadOnlyArray<string>(patches);
    }
    getProject(): IProject {
        return this.project;
    }
    getParent(): ITarget | null {
        return this.parent;
    }
    getDirectory(): string {
        return this.dir;
    }
    abstract init(): Promise<void>;
    abstract finalize(): Promise<void>;
    abstract getNext(): ITarget | null;
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.patches.getLenght() > 0) {
                const applyPatches = (patch: string) => {
                    const patches_iter = (i: number) => {
                        if (i < this.patches.getLenght()) {
                            const patchName = this.patches.getItem(i);
                            const processPatch = (patchPath: string) => {
                                checkFiles([patchPath])
                                    .then(() => {
                                        executeProcess(patch, {
                                            cwd: this.dir,
                                            args: [
                                                "-Np1",
                                                "--force",
                                                "-i",
                                                patchPath
                                            ],
                                            verbose: true,
                                            stdout: defaultStdOutHandler
                                        })
                                            .then(code => {
                                                patches_iter(i + 1);
                                            })
                                            .catch(reject);
                                    })
                                    .catch(reject);
                            };
                            if (/^https?:\/\//.test(patchName)) {
                                const patchPrefix = join(this.remotePatchesDir, "p-");
                                mkdtemp(patchPrefix)
                                    .then(patchDir => {
                                        downloadFile(patchName, join(patchDir, "main.patch"))
                                            .then(patchPath => {
                                                processPatch(patchPath);
                                            })
                                            .catch(reject);
                                    })
                                    .catch(reject);
                            }
                            else {
                                const patchPath = isAbsolute(patchName) ? patchName : join(process.cwd(), patchName);
                                processPatch(patchPath);
                            }
                        }
                        else {
                            resolve();
                        }
                    };
                    patches_iter(0);
                };
                if (process.platform === 'win32') {
                    findProgram("patch", true)
                        .then(applyPatches)
                        .catch(err => {
                            findGitForWindowsInstallDir()
                                .then(gitInstallDir => {
                                    const patch = join(gitInstallDir, "usr", "bin", "patch.exe");
                                    checkFiles([patch])
                                        .then(() => {
                                            applyPatches(patch);
                                        })
                                        .catch(reject);
                                })
                                .catch(err => {
                                    reject(new Error("Unable to find Git For Windows install dir"));
                                });
                        });
                }
                else {
                    findProgram("patch", true)
                        .then(applyPatches)
                        .catch(err => {
                            reject(new Error("Unable to find patch program required to apply patches"));
                        });
                }
            }
            else {
                resolve();
            }
        });
    }
}
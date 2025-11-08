import { join } from "node:path";
import { readdir, stat } from "node:fs/promises";
import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaJitProject } from "../LuaJitProject";
import { AbstractFetchTarballTarget } from "../../Targets/Fetch/AbstractFetchTarballTarget";
import { LuaJitRepositoryVersion, OpenRestyRepositoryVersion } from "../LuaJitRepositoryVersion";
import { LuaJitApplyPatchesTarget } from "./LuaJitApplyPatchesTarget";

export class LuaJitFetchTarget extends AbstractFetchTarballTarget {
    private parent: ITarget | null;
    private project: LuaJitProject;
    private extractedDir?: string;
    constructor(project: LuaJitProject, parent: ITarget | null) {
        super(
            `${project.getVersion().getRepository()}/archive/${project.getVersion().getRef()}.tar.gz`,
            project.getBuildDir(),
            null
        )
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            console.log(`[Start] Fetch ${projectVersion.getName()} ${projectVersion.getRef()} source code`);
            resolve();
        });
    }
    getProject(): IProject {
        return this.project;
    }
    getParent(): ITarget | null {
        return this.parent;
    }
    getExtractedDir(): string {
        return <string>(this.extractedDir);
    }
    override execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            super.execute()
                .then(() => {
                    const workDir = this.getWorkDir();
                    readdir(workDir, { recursive: false })
                        .then(items => {
                            const len = items.length;
                            const dirItem_iter = (i: number) => {
                                if (i < len) {
                                    const dirItem = items[i];
                                    if (
                                        (projectVersion instanceof LuaJitRepositoryVersion && dirItem.startsWith("LuaJIT-"))
                                        ||
                                        (projectVersion instanceof OpenRestyRepositoryVersion && dirItem.startsWith("luajit2-"))
                                    ) {
                                        const dirItemFullPath = join(workDir, dirItem);
                                        stat(dirItemFullPath)
                                            .then(s => {
                                                if (s.isDirectory()) {
                                                    this.extractedDir = dirItemFullPath;
                                                    resolve();
                                                }
                                                else {
                                                    dirItem_iter(i + 1);
                                                }
                                            })
                                            .catch(reject);
                                    }
                                    else {
                                        dirItem_iter(i + 1);
                                    }
                                }
                                else {
                                    reject(new Error(`Extracted directory for ${projectVersion.getName()} ${projectVersion.getRef()} was not found`));
                                }
                            };

                            dirItem_iter(0);
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }
    getNext(): ITarget | null {
        return new LuaJitApplyPatchesTarget(this.project, this);
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            console.log(`[End] Fetch ${projectVersion.getName()} ${projectVersion.getRef()} source code`);
            resolve();
        });
    }
}
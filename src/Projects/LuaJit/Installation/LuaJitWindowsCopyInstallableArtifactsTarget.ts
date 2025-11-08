import { cp } from "node:fs/promises";
import { basename, join } from "node:path";
import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaJitProject } from "../LuaJitProject";
import { LuaJitWindowsCreateInstallationDirectoriesTarget } from "./LuaJitWindowsCreateInstallationDirectoriesTarget";
import { sequentialPromises } from "../../../Util/SequentialPromises";
import { LuaJitPostInstallTarget } from "./LuaJitPostInstallTarget";

export class LuaJitWindowsCopyInstallableArtifactsTarget implements ITarget {
    private project: LuaJitProject;
    private parent: LuaJitWindowsCreateInstallationDirectoriesTarget;
    constructor(project: LuaJitProject, parent: LuaJitWindowsCreateInstallationDirectoriesTarget) {
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            console.log(`[Start] Copy ${projectVersion.getName()} ${projectVersion.getRef()} installation files`);
            resolve();
        });
    }
    getProject(): IProject {
        return this.project;
    }
    getParent(): ITarget | null {
        return this.parent;
    }
    getNext(): ITarget | null {
        return new LuaJitPostInstallTarget(this.project, this);
    }
    private copyInterpreter(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const builtInterpreter = this.parent.getBuildInfo().getInterpreter();
            const binDir = this.project.getInstallBinDir();
            const filesToCopy: string[] = [
                join(binDir, basename(builtInterpreter))
            ];
            if (process.env["GITHUB_PATH"]) {
                filesToCopy.push(join(binDir, "lua.exe"));
            }
            const file_iter = (i: number) => {
                if (i < filesToCopy.length) {
                    const destFile = filesToCopy[i];
                    cp(builtInterpreter, destFile, { force: true })
                        .then(() => {
                            file_iter(i + 1);
                        })
                        .catch(reject);
                }
                else {
                    resolve();
                }
            };
            file_iter(0);
        });
    }
    private copySharedLibrary(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const builtSharedLib = this.parent.getBuildInfo().getSharedLibrary();
            const sharedLib = join(this.project.getInstallBinDir(), basename(builtSharedLib));
    
            cp(builtSharedLib, sharedLib, { force: true })
                .then(resolve)
                .catch(reject);
        });
    }
    private copyImportLibrary(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const builtImpLib = this.parent.getBuildInfo().getImportLibrary();
            if (builtImpLib) {
                const libDir = this.project.getInstallLibDir();
                const impLib = join(libDir, basename(builtImpLib));
        
                cp(builtImpLib, impLib, { force: true })
                    .then(resolve)
                    .catch(reject);
            }
            else {
                resolve();
            }
        });
    }
    private copyHeaders(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const srcInfo = this.parent.getBuildInfo().getSourcesInfo();
            const includeDir = this.project.getInstallIncludeDir(srcInfo.getVersion());
            const headers = srcInfo.getHeaderFiles();
            const len = headers.getLenght();

            const header_iter = (i: number) => {
                if (i < len) {
                    const sourceHeader = headers.getItem(i);
                    const h = join(includeDir, basename(sourceHeader));

                    cp(sourceHeader, h, { force: true })
                        .then(() => {
                            header_iter(i + 1);
                        })
                        .catch(reject);
                }
                else {
                    const sourceHeader = srcInfo.getDelayedHeaderFile();
                    const h = join(includeDir, basename(sourceHeader));

                    cp(sourceHeader, h, { force: true })
                        .then(resolve)
                        .catch(reject);
                }
            };

            header_iter(0);
        });
    }
    private copyManFiles(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const manDir = this.project.getInstallManDir();
            const manFiles = this.parent.getBuildInfo().getSourcesInfo().getManFiles();
            const len = manFiles.getLenght();

            const man_iter = (i: number) => {
                if (i < len) {
                    const sourceMan = manFiles.getItem(i);
                    const man = join(manDir, basename(sourceMan));

                    cp(sourceMan, man, { force: true })
                        .then(() => {
                            man_iter(i + 1);
                        })
                        .catch(reject);
                }
                else {
                    resolve();
                }
            };

            man_iter(0);
        });
    }
    private copyPkgConfigFile(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const builtPkgConfigFile = this.parent.getBuildInfo().getPkgConfigFile();
            const pkgConfigDir = this.project.getInstallPkgConfigDir();
            const pkgConfigFile = join(pkgConfigDir, basename(builtPkgConfigFile));

            cp(builtPkgConfigFile, pkgConfigFile, { force: true })
                .then(resolve)
                .catch(reject);
        });
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            sequentialPromises<void>([
                () => this.copyInterpreter(),
                () => this.copySharedLibrary(),
                () => this.copyImportLibrary(),
                () => this.copyHeaders(),
                () => this.copyManFiles(),
                () => this.copyPkgConfigFile()
            ])
                .then(_ => {
                    resolve();
                })
                .catch(reject);
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            console.log(`[End] Copy ${projectVersion.getName()} ${projectVersion.getRef()} installation files`);
            resolve();
        });
    }
}
import { basename, join } from "node:path";
import { cp } from "node:fs/promises";
import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaRocksProject } from "../LuaRocksProject";
import { LuaRocksUnixBuildInfo, LuaRocksWindowsBuildInfo } from "../Building/LuaRocksBuildInfo";
import { executeProcess } from "../../../Util/ExecuteProcess";
import { LuaRocksWindowsSourcesInfoDetails } from "../Configuration/LuaRocksSourcesInfo";
import { LuaRocksPostInstallTarget } from "./LuaRocksPostInstallTarget";
import { defaultStdOutHandler } from "../../../Util/DefaultStdOutHandler";
import { Console } from "../../../Console";

export class LuaRocksInstallTarget implements ITarget {
    private parent: ITarget | null;
    private project: LuaRocksProject;
    private buildInfo: LuaRocksUnixBuildInfo | LuaRocksWindowsBuildInfo;
    constructor(project: LuaRocksProject, parent: ITarget | null, buildInfo: LuaRocksUnixBuildInfo | LuaRocksWindowsBuildInfo) {
        this.project = project;
        this.parent = parent;
        this.buildInfo = buildInfo;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[Start] Install LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
    getProject(): IProject {
        return this.project;
    }
    getParent(): ITarget | null {
        return this.parent;
    }
    getLuaRocksBuildInfo(): LuaRocksUnixBuildInfo | LuaRocksWindowsBuildInfo {
        return this.buildInfo;
    }
    getNext(): ITarget | null {
        return new LuaRocksPostInstallTarget(this.project, this);
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const info = this.buildInfo;
            if (info instanceof LuaRocksUnixBuildInfo) {
                const makeArgs = info.getMakeArguments().createCopy();
                makeArgs.push("install");
                executeProcess(
                    info.getMake(), {
                        args: makeArgs,
                        verbose: true,
                        stdout: defaultStdOutHandler
                })
                    .then(code => {
                        resolve();
                    })
                    .catch(reject);
            }
            else {
                const sourcesInfo = info.getSourcesInfo();
                const infoDetails = sourcesInfo.getDetails();
                if (infoDetails instanceof LuaRocksWindowsSourcesInfoDetails) {
                    const binDir = this.project.getInstallBinDir();
                    const filesToCopy: string[] = [
                        infoDetails.getLuaRocks(),
                        infoDetails.getLuaRocksAdmin()
                    ];
                    const file_iter = (i: number) => {
                        if (i < filesToCopy.length) {
                            const sourceFile = filesToCopy[i];
                            const destinationFile = join(binDir, basename(sourceFile));

                            cp(sourceFile, destinationFile, { force: true })
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
                }
                else {
                    reject(new Error("Internal error: LuaRocks sources info details for Windows expected."));
                }
            }
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[End] Install LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
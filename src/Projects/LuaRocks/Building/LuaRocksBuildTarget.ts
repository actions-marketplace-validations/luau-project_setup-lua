import { ToolchainEnvironmentVariables } from "../../../Toolchains/ToolchainEnvironmentVariables";
import { executeProcess } from "../../../Util/ExecuteProcess";
import { defaultStdOutHandler } from "../../../Util/DefaultStdOutHandler";
import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaRocksSourcesInfo, LuaRocksUnixSourcesInfoDetails } from "../Configuration/LuaRocksSourcesInfo";
import { LuaRocksProject } from "../LuaRocksProject";
import { LuaRocksUnixBuildInfo, LuaRocksWindowsBuildInfo } from "./LuaRocksBuildInfo";
import { LuaRocksFinishBuildingTarget } from "./LuaRocksFinishBuildingTarget";

export class LuaRocksBuildTarget implements ITarget {
    private parent: ITarget | null;
    private project: LuaRocksProject;
    private srcInfo: LuaRocksSourcesInfo;
    constructor(project: LuaRocksProject, parent: ITarget | null, sourcesInfo: LuaRocksSourcesInfo) {
        this.parent = parent;
        this.project = project;
        this.srcInfo = sourcesInfo;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[Start] Build LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
    getProject(): IProject {
        return this.project;
    }
    getParent(): ITarget | null {
        return this.parent;
    }
    getLuaRocksSourcesInfo(): LuaRocksSourcesInfo {
        return this.srcInfo;
    }
    getNext(): ITarget | null {
        return new LuaRocksFinishBuildingTarget(this.project, this);
    }
    private setUnixBuildResult(make: string, makeArgs: string[]) {
        this.project.buildResult().setValue(
            new LuaRocksUnixBuildInfo(this.srcInfo, make, makeArgs)
        );
    }
    private setWindowsBuildResult(): void {
        this.project.buildResult().setValue(
            new LuaRocksWindowsBuildInfo(this.srcInfo)
        );
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const details = this.srcInfo.getDetails();
            if (details instanceof LuaRocksUnixSourcesInfoDetails) {
                const make = ToolchainEnvironmentVariables.instance().getMake();
                const makeArgs: string[] = ["-C", this.srcInfo.getDir()];
                executeProcess(make, {
                    args: makeArgs,
                    verbose: true,
                    stdout: defaultStdOutHandler
                })
                    .then(code => {
                        this.setUnixBuildResult(make, makeArgs);
                        resolve();
                    })
                    .catch(reject);
            }
            else {
                this.setWindowsBuildResult();
                resolve();
            }
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[End] Build LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
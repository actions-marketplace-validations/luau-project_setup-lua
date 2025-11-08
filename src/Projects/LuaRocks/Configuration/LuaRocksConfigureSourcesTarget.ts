import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaRocksProject } from "../LuaRocksProject";
import { executeProcess } from "../../../Util/ExecuteProcess";
import { LuaRocksApplyPatchesTarget } from "./LuaRocksApplyPatchesTarget";
import { LuaRocksFinishConfigurationTarget } from "./LuaRocksFinishConfigurationTarget";
import { LuaRocksUnixSourcesInfoDetails } from "./LuaRocksSourcesInfo";
import { defaultStdOutHandler } from "../../../Util/DefaultStdOutHandler";

export class LuaRocksConfigureSourcesTarget implements ITarget {
    private parent: LuaRocksApplyPatchesTarget;
    private project: LuaRocksProject;
    constructor(project: LuaRocksProject, parent: LuaRocksApplyPatchesTarget) {
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[Start] Configure LuaRocks ${this.project.getVersion().getIdentifier()}`);
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
        return new LuaRocksFinishConfigurationTarget(this.project, this);
    }
    private setConfigurationResult(): void {
        this.project.configurationResult()
            .setValue(this.parent.getLuaRocksSourcesInfo());
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (process.platform === 'win32') {
                this.setConfigurationResult();
                resolve();
            }
            else {
                const sourcesInfo = this.parent.getLuaRocksSourcesInfo();
                const details = sourcesInfo.getDetails();
                if (details instanceof LuaRocksUnixSourcesInfoDetails) {
                    const installDir = this.project.getInstallDir();
                    executeProcess(details.getConfigureScript(), {
                        cwd: sourcesInfo.getDir(),
                        args: [
                            `--prefix=${installDir}`,
                            `--with-lua=${installDir}`
                        ],
                        verbose: true,
                        stdout: defaultStdOutHandler
                    })
                        .then(code => {
                            this.setConfigurationResult();
                            resolve();
                        })
                        .catch(reject);
                }
                else {
                    reject(new Error("Internal error: unexpected LuaRocks sources info details for Unix systems"));
                }
            }
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[End] Configure LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
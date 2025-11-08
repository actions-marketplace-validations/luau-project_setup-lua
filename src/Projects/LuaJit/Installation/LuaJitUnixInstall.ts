import { join } from "node:path";
import { executeProcess } from "../../../Util/ExecuteProcess";
import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaJitUnixBuildInfo } from "../Building/LuaJitUnixBuildInfo";
import { LuaJitProject } from "../LuaJitProject";
import { LuaJitPostInstallTarget } from "./LuaJitPostInstallTarget";

export class LuaJitUnixInstall implements ITarget {
    private project: LuaJitProject;
    private parent: ITarget | null;
    private buildInfo: LuaJitUnixBuildInfo;
    constructor(project: LuaJitProject, parent: ITarget | null, buildInfo: LuaJitUnixBuildInfo) {
        this.project = project;
        this.parent = parent;
        this.buildInfo = buildInfo;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            console.log(`[Start] Install ${projectVersion.getName()} ${projectVersion.getRef()}`);
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
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const defaultStdOutHandler = (chunk: any) => {
                process.stdout.write(chunk.toString());
            }
            const makeArguments = this.buildInfo.getMakeArguments();
            const makeArgs = makeArguments.createCopy();
            const installTarget = "install";
            makeArgs.push(installTarget);
            executeProcess(this.buildInfo.getMake(), {
                args: makeArgs,
                stdout: defaultStdOutHandler,
                verbose: true
            })
                .then(makeCode => {
                    if (process.env["GITHUB_PATH"]) {
                        const installBinDir = this.project.getInstallBinDir()
                        const luajitInterpreter = join(installBinDir, "luajit");
                        const luaSoftLink = join(installBinDir, "lua");
                        executeProcess("ln", {
                            args: ["-s", luajitInterpreter, luaSoftLink],
                            verbose: true,
                            stdout: defaultStdOutHandler
                        })
                            .then(lnCode => {
                                resolve();
                            })
                            .catch(reject);
                    }
                    else {
                        resolve();
                    }
                })
                .catch(reject);
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            console.log(`[End] Install ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
}
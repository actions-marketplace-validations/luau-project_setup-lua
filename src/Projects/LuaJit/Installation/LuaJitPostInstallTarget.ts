import { ITarget } from "../../Targets/ITarget";
import { LuaJitProject } from "../LuaJitProject";
import { AbstractPkgConfigCMakeEnvVarsTarget } from "../../Targets/AbstractPkgConfigCMakeEnvVarsTarget";
import { LuaJitFinishInstallationTarget } from "./LuaJitFinishInstallationTarget";
import { GitHubInput } from "../../../Util/GitHubInput";

export class LuaJitPostInstallTarget extends AbstractPkgConfigCMakeEnvVarsTarget {
    constructor(project: LuaJitProject, parent: ITarget | null) {
        super(project, parent);
    }
    getProjectInstallDir(): string {
        return (<LuaJitProject>this.getProject()).getInstallDir();
    }
    activateCoreExecution(): boolean {
        return (GitHubInput.instance().getInputLuaRocksVersion() || process.env["LUAROCKS_VERSION"] || "").trim() === "none";
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = (<LuaJitProject>this.getProject()).getVersion();
            console.log(`[Start] Post install for ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getNext(): ITarget | null {
        return new LuaJitFinishInstallationTarget(<LuaJitProject>this.getProject(), this);
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = (<LuaJitProject>this.getProject()).getVersion();
            console.log(`[End] Post install for ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
}
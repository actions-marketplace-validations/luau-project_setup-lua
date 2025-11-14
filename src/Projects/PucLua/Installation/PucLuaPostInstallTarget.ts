import { ITarget } from "../../Targets/ITarget";
import { PucLuaProject } from "../PucLuaProject";
import { AbstractPkgConfigCMakeEnvVarsTarget } from "../../Targets/AbstractPkgConfigCMakeEnvVarsTarget";
import { PucLuaFinishInstallationTarget } from "./PucLuaFinishInstallationTarget";
import { GitHubInput } from "../../../Util/GitHubInput";

export class PucLuaPostInstallTarget extends AbstractPkgConfigCMakeEnvVarsTarget {
    constructor(project: PucLuaProject, parent: ITarget | null) {
        super(project, parent);
    }
    getProjectInstallDir(): string {
        return (<PucLuaProject>this.getProject()).getInstallDir();
    }
    getProjectInstallBinDir(): string {
        return (<PucLuaProject>this.getProject()).getInstallBinDir();
    }
    activateCoreExecution(): boolean {
        return (GitHubInput.instance().getInputLuaRocksVersion() || process.env["LUAROCKS_VERSION"] || "").trim() === "none";
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = (<PucLuaProject>this.getProject()).getVersion();
            console.log(`[Start] Post install for Lua ${projectVersion.getString()}`);
            resolve();
        });
    }
    getNext(): ITarget | null {
        return new PucLuaFinishInstallationTarget(<PucLuaProject>this.getProject(), this);
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = (<PucLuaProject>this.getProject()).getVersion();
            console.log(`[End] Post install for Lua ${projectVersion.getString()}`);
            resolve();
        });
    }
}
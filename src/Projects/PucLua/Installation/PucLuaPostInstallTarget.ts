import { ITarget } from "../../Targets/ITarget";
import { PucLuaProject } from "../PucLuaProject";
import { AbstractUpdateLuaEnvVarsTarget } from "../../Targets/AbstractUpdateLuaEnvVarsTarget";
import { PucLuaFinishInstallationTarget } from "./PucLuaFinishInstallationTarget";

export class PucLuaPostInstallTarget extends AbstractUpdateLuaEnvVarsTarget {
    constructor(project: PucLuaProject, parent: ITarget | null) {
        super(project, parent);
    }
    getProjectInstallDir(): string {
        return (<PucLuaProject>this.getProject()).getInstallDir();
    }
    getProjectInstallLibDir(): string {
        return (<PucLuaProject>this.getProject()).getInstallLibDir();
    }
    getProjectInstallBinDir(): string {
        return (<PucLuaProject>this.getProject()).getInstallBinDir();
    }
    getProjectInstallPkgConfigDir(): string {
        return (<PucLuaProject>this.getProject()).getInstallPkgConfigDir();
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
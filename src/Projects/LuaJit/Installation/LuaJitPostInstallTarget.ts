import { ITarget } from "../../Targets/ITarget";
import { LuaJitProject } from "../LuaJitProject";
import { AbstractUpdateLuaEnvVarsTarget } from "../../Targets/AbstractUpdateLuaEnvVarsTarget";
import { LuaJitFinishInstallationTarget } from "./LuaJitFinishInstallationTarget";

export class LuaJitPostInstallTarget extends AbstractUpdateLuaEnvVarsTarget {
    constructor(project: LuaJitProject, parent: ITarget | null) {
        super(project, parent);
    }
    getProjectInstallDir(): string {
        return (<LuaJitProject>this.getProject()).getInstallDir();
    }
    getProjectInstallLibDir(): string {
        return (<LuaJitProject>this.getProject()).getInstallLibDir();
    }
    getProjectInstallBinDir(): string {
        return (<LuaJitProject>this.getProject()).getInstallBinDir();
    }
    getProjectInstallPkgConfigDir(): string {
        return (<LuaJitProject>this.getProject()).getInstallPkgConfigDir();
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
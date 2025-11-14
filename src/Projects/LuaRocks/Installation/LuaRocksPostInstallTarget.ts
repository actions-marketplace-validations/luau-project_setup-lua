import { ITarget } from "../../Targets/ITarget";
import { LuaRocksProject } from "../LuaRocksProject";
import { AbstractPkgConfigCMakeEnvVarsTarget } from "../../Targets/AbstractPkgConfigCMakeEnvVarsTarget";
import { LuaRocksFinishInstallationTarget } from "./LuaRocksFinishInstallationTarget";

export class LuaRocksPostInstallTarget extends AbstractPkgConfigCMakeEnvVarsTarget {
    constructor(project: LuaRocksProject, parent: ITarget | null) {
        super(project, parent);
    }
    getProjectInstallDir(): string {
        return (<LuaRocksProject>this.getProject()).getInstallDir();
    }
    getProjectInstallBinDir(): string {
        return (<LuaRocksProject>this.getProject()).getInstallBinDir();
    }
    activateCoreExecution(): boolean {
        return true;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = (<LuaRocksProject>this.getProject()).getVersion();
            console.log(`[Start] Post install for LuaRocks ${projectVersion.getIdentifier()}`);
            resolve();
        });
    }
    getNext(): ITarget | null {
        return new LuaRocksFinishInstallationTarget(<LuaRocksProject>this.getProject(), this);
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = (<LuaRocksProject>this.getProject()).getVersion();
            console.log(`[End] Post install for LuaRocks ${projectVersion.getIdentifier()}`);
            resolve();
        });
    }
}
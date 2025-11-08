import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaJitProject } from "../LuaJitProject";
import { LuaJitCreatePkgConfigTarget } from "./LuaJitCreatePkgConfigTarget";
import { LuaJitWindowsBuildInfo } from "./LuaJitWindowsBuildInfo";

export class LuaJitFinishBuildingTarget implements ITarget {
    private project: LuaJitProject;
    private parent: LuaJitCreatePkgConfigTarget;
    constructor(project: LuaJitProject, parent: LuaJitCreatePkgConfigTarget) {
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            console.log(`[Start] Finish the build of ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getNext(): ITarget | null {
        return null;
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (process.platform === "win32") {
                const buildInfo = <LuaJitWindowsBuildInfo>this.project.buildResult().getValue();
                console.log(`Shared Library: ${buildInfo.getSharedLibrary()}`);
                console.log(`Interpreter: ${buildInfo.getInterpreter()}`);
                console.log(`PkgConfig: ${buildInfo.getPkgConfigFile()}`);
                console.log(`Import Library: ${buildInfo.getImportLibrary()}`);
            }
            resolve();
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            console.log(`[End] Finish the build of ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getProject(): IProject {
        return this.project;
    }
    getParent(): ITarget | null {
        return this.parent;
    }
}
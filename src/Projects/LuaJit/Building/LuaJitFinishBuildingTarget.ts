import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaJitProject } from "../LuaJitProject";
import { LuaJitCreatePkgConfigTarget } from "./LuaJitCreatePkgConfigTarget";
import { LuaJitWindowsBuildInfo } from "./LuaJitWindowsBuildInfo";
import { Console } from "../../../Console";

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
            Console.instance().writeLine(`[Start] Finish the build of ${projectVersion.getName()} ${projectVersion.getRef()}`);
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
                Console.instance().writeLine(`Shared Library: ${buildInfo.getSharedLibrary()}`);
                Console.instance().writeLine(`Interpreter: ${buildInfo.getInterpreter()}`);
                Console.instance().writeLine(`PkgConfig: ${buildInfo.getPkgConfigFile()}`);
                Console.instance().writeLine(`Import Library: ${buildInfo.getImportLibrary()}`);
            }
            resolve();
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console.instance().writeLine(`[End] Finish the build of ${projectVersion.getName()} ${projectVersion.getRef()}`);
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
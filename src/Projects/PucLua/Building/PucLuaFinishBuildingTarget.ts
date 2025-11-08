import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { PucLuaProject } from "../PucLuaProject";
import { PucLuaBuildInfo } from "./PucLuaBuildInfo";
import { PucLuaCreatePkgConfigTarget } from "./PucLuaCreatePkgConfigTarget";

export class PucLuaFinishBuildingTarget implements ITarget {
    private parent: PucLuaCreatePkgConfigTarget;
    private project: PucLuaProject;
    constructor(project: PucLuaProject, parent: PucLuaCreatePkgConfigTarget) {
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[Start] Finish the build of Lua ${this.project.getVersion().getString()}`);
            resolve();
        });
    }
    getNext(): ITarget | null {
        return null;
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const buildInfo = <PucLuaBuildInfo>this.project.buildResult().getValue();
            console.log(`Shared Library: ${buildInfo.getSharedLibrary()}`);
            console.log(`Static Library: ${buildInfo.getStaticLibrary()}`);
            console.log(`Interpreter: ${buildInfo.getInterpreter()}`);
            console.log(`Compiler: ${buildInfo.getCompiler()}`);
            console.log(`PkgConfig: ${buildInfo.getPkgConfigFile()}`);
            const impLib = buildInfo.getImportLibrary();
            if (impLib) {
                console.log(`Import Library: ${impLib}`);
            }
            resolve();
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[End] Finish the build of Lua ${this.project.getVersion().getString()}`);
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
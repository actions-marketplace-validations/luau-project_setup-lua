import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { PucLuaProject } from "../PucLuaProject";
import { PucLuaBuildInfo } from "./PucLuaBuildInfo";
import { PucLuaCreatePkgConfigTarget } from "./PucLuaCreatePkgConfigTarget";
import { Console } from "../../../Console";

export class PucLuaFinishBuildingTarget implements ITarget {
    private parent: PucLuaCreatePkgConfigTarget;
    private project: PucLuaProject;
    constructor(project: PucLuaProject, parent: PucLuaCreatePkgConfigTarget) {
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[Start] Finish the build of Lua ${this.project.getVersion().getString()}`);
            resolve();
        });
    }
    getNext(): ITarget | null {
        return null;
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const buildInfo = <PucLuaBuildInfo>this.project.buildResult().getValue();
            Console.instance().writeLine(`Shared Library: ${buildInfo.getSharedLibrary()}`);
            Console.instance().writeLine(`Static Library: ${buildInfo.getStaticLibrary()}`);
            Console.instance().writeLine(`Interpreter: ${buildInfo.getInterpreter()}`);
            Console.instance().writeLine(`Compiler: ${buildInfo.getCompiler()}`);
            Console.instance().writeLine(`PkgConfig: ${buildInfo.getPkgConfigFile()}`);
            const impLib = buildInfo.getImportLibrary();
            if (impLib) {
                Console.instance().writeLine(`Import Library: ${impLib}`);
            }
            resolve();
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[End] Finish the build of Lua ${this.project.getVersion().getString()}`);
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
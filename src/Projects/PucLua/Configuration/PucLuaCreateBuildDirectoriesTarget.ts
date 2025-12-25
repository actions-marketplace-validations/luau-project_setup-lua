import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { PucLuaProject } from "../PucLuaProject";
import { AbstractCreateDirectoriesTarget } from "../../Targets/AbstractCreateDirectoriesTarget";
import { PucLuaCheckDependenciesTarget } from "./PucLuaCheckDependenciesTarget";
import { Console } from "../../../Console";

export class PucLuaCreateBuildDirectoriesTarget extends AbstractCreateDirectoriesTarget {
    private parent: ITarget | null;
    private project: PucLuaProject;
    constructor(project: PucLuaProject, parent: ITarget | null) {
        super([
            project.getBuildDir(),
            project.getLibBuildDir(),
            project.getSharedLibBuildDir(),
            project.getStaticLibBuildDir(),
            project.getRemotePatchesBuildDir(),
            project.getInterpreterBuildDir(),
            project.getCompilerBuildDir()
        ]);
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[Start] Create build directories for Lua ${this.project.getVersion().getString()}`);
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
        return new PucLuaCheckDependenciesTarget(this.project, this);
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[End] Create build directories for Lua ${this.project.getVersion().getString()}`);
            resolve();
        });
    }

}
import { IProject } from "../../IProject";
import { AbstractCreateDirectoriesTarget } from "../../Targets/AbstractCreateDirectoriesTarget";
import { ITarget } from "../../Targets/ITarget";
import { LuaRocksProject } from "../LuaRocksProject";
import { LuaRocksCheckDependenciesTarget } from "./LuaRocksCheckDependenciesTarget";

export class LuaRocksCreateBuildDirectoriesTarget extends AbstractCreateDirectoriesTarget {
    private parent: ITarget | null;
    private project: LuaRocksProject;
    constructor(project: LuaRocksProject, parent: ITarget | null) {
        super([
            project.getBuildDir(), 
            project.getRemotePatchesBuildDir()
        ]);
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[Start] Create build directories for LuaRocks ${this.project.getVersion().getIdentifier()}`);
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
        return new LuaRocksCheckDependenciesTarget(this.project, this);
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[End] Create build directories for LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
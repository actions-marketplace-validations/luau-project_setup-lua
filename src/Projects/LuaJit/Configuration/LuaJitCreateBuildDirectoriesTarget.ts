import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaJitProject } from "../LuaJitProject";
import { AbstractCreateDirectoriesTarget } from "../../Targets/AbstractCreateDirectoriesTarget";
import { LuaJitFetchTarget } from "./LuaJitFetchTarget";

export class LuaJitCreateBuildDirectoriesTarget extends AbstractCreateDirectoriesTarget {
    private parent: ITarget | null;
    private project: LuaJitProject;
    constructor(project: LuaJitProject, parent: ITarget | null) {
        super([
            project.getBuildDir(),
            project.getRemotePatchesBuildDir()
        ]);
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            console.log(`[Start] Create build directories for ${projectVersion.getName()} ${projectVersion.getRef()}`);
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
        return new LuaJitFetchTarget(this.project, this);
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            console.log(`[End] Create build directories for ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
}
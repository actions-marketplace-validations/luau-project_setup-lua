import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaJitProject } from "../LuaJitProject";

export class LuaJitFinishInstallationTarget implements ITarget {
    private parent: ITarget | null;
    private project: LuaJitProject;
    constructor(project: LuaJitProject, parent: ITarget | null) {
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            console.log(`[Start] Finish the installation of ${projectVersion.getName()} ${projectVersion.getRef()} installation`);
            resolve();
        });
    }
    getNext(): ITarget | null {
        return null;
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log("<< done >>");
            resolve();
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            console.log(`[End] Finish the installation of ${projectVersion.getName()} ${projectVersion.getRef()} installation`);
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
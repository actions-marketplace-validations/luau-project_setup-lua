import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaJitProject } from "../LuaJitProject";
import { Console } from "../../../Console";

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
            Console.instance().writeLine(`[Start] Finish the installation of ${projectVersion.getName()} ${projectVersion.getRef()} installation`);
            resolve();
        });
    }
    getNext(): ITarget | null {
        return null;
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine("<< done >>");
            resolve();
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console.instance().writeLine(`[End] Finish the installation of ${projectVersion.getName()} ${projectVersion.getRef()} installation`);
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
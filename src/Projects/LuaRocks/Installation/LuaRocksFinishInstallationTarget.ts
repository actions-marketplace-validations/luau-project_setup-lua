import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaRocksProject } from "../LuaRocksProject";
import { Console } from "../../../Console";

export class LuaRocksFinishInstallationTarget implements ITarget {
    private parent: ITarget | null;
    private project: LuaRocksProject;
    constructor(project: LuaRocksProject, parent: ITarget | null) {
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[Start] Finishing the installation of LuaRocks ${this.project.getVersion().getIdentifier()}`);
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
            Console.instance().writeLine(`[End] Finishing the installation of LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
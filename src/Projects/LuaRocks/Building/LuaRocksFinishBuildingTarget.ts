import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaRocksProject } from "../LuaRocksProject";
import { LuaRocksBuildTarget } from "./LuaRocksBuildTarget";

export class LuaRocksFinishBuildingTarget implements ITarget {
    private parent: LuaRocksBuildTarget;
    private project: LuaRocksProject;
    constructor(project: LuaRocksProject, parent: LuaRocksBuildTarget) {
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[Start] Finish the building of LuaRocks ${this.project.getVersion().getIdentifier()}`);
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
            console.log("LuaRocks was built successfully.");
            resolve();
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[End] Finish the building of LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
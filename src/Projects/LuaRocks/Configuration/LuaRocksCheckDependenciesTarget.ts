import { executeProcess } from "../../../Util/ExecuteProcess";
import { findProgram } from "../../../Util/FindProgram";
import { sequentialPromises } from "../../../Util/SequentialPromises";
import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaRocksProject } from "../LuaRocksProject";
import { LuaRocksFetchPeParserTarget } from "./LuaRocksFetchPeParserTarget";
import { LuaRocksFetchTarget } from "./LuaRocksFetchTarget";

export class LuaRocksCheckDependenciesTarget implements ITarget {
    private parent: ITarget | null;
    private project: LuaRocksProject;
    constructor(project: LuaRocksProject, parent: ITarget | null) {
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[Start] Check dependencies for LuaRocks ${this.project.getVersion().getIdentifier()}`);
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
        return (process.platform === 'win32') ? new LuaRocksFetchPeParserTarget(this.project, this) : new LuaRocksFetchTarget(this.project, this);
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (process.platform === 'win32') {
                resolve();
            }
            else {
                sequentialPromises([
                    () => findProgram("unzip"),
                    () => findProgram("gmake")
                ])
                    .then(_ => {
                        resolve();
                    })
                    .catch(reject);
            }
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[End] Check dependencies for LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
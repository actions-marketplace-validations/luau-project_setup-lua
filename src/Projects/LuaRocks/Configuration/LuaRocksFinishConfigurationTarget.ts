import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaRocksProject } from "../LuaRocksProject";
import { LuaRocksConfigureSourcesTarget } from "./LuaRocksConfigureSourcesTarget";
import { LuaRocksSourcesInfo, LuaRocksWindowsSourcesInfoDetails } from "./LuaRocksSourcesInfo";
import { Console } from "../../../Console";

export class LuaRocksFinishConfigurationTarget implements ITarget {
    private parent: LuaRocksConfigureSourcesTarget;
    private project: LuaRocksProject;
    constructor(project: LuaRocksProject, parent: LuaRocksConfigureSourcesTarget) {
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[Start] Finish LuaRocks ${this.project.getVersion().getIdentifier()} configuration`);
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
            const srcInfo = <LuaRocksSourcesInfo>(this.project.configurationResult().getValue());
            Console.instance().writeLine(`[Directory] ${srcInfo.getDir()}`);
            const details = srcInfo.getDetails();
            if (details instanceof LuaRocksWindowsSourcesInfoDetails) {
                Console.instance().writeLine(`[LuaRocks] ${details.getLuaRocks()}`);
                Console.instance().writeLine(`[LuaRocks admin] ${details.getLuaRocksAdmin()}`);
            }
            else {
                Console.instance().writeLine(`[Configure script] ${details.getConfigureScript()}`);
            }
            resolve();
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[End] Finish LuaRocks ${this.project.getVersion().getIdentifier()} configuration`);
            resolve();
        });
    }
}
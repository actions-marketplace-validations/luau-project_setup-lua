import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaJitProject } from "../LuaJitProject";
import { LuaJitConfigureSourcesTarget } from "./LuaJitConfigureSourcesTarget";
import { LuaJitSourcesInfo } from "./LuaJitSourcesInfo";
import { Console } from "../../../Console";

export class LuaJitFinishConfigurationTarget implements ITarget {
    private parent: LuaJitConfigureSourcesTarget;
    private project: LuaJitProject;
    constructor(project: LuaJitProject, parent: LuaJitConfigureSourcesTarget) {
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console.instance().writeLine(`[Start] Finish ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getNext(): ITarget | null {
        return null;
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const srcInfo = <LuaJitSourcesInfo>(this.project.configurationResult().getValue());
            let len = 0;
            Console.instance().writeLine(`[Delayed Header] ${srcInfo.getDelayedHeaderFile()}`);
            const headerFiles = srcInfo.getHeaderFiles();
            len = headerFiles.getLenght();
            for (let i = 0; i < len; i++) {
                Console.instance().writeLine(`[Header] ${headerFiles.getItem(i)}`);
            }
            const jitFiles = srcInfo.getJitFiles();
            len = jitFiles.getLenght();
            for (let i = 0; i < len; i++) {
                Console.instance().writeLine(`[JIT] ${jitFiles.getItem(i)}`);
            }
            const manFiles = srcInfo.getManFiles();
            len = manFiles.getLenght();
            for (let i = 0; i < len; i++) {
                Console.instance().writeLine(`[MAN] ${manFiles.getItem(i)}`);
            }
            resolve();
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console.instance().writeLine(`[End] Finish ${projectVersion.getName()} ${projectVersion.getRef()}`);
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
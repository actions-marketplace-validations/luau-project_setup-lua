import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { PucLuaProject } from "../PucLuaProject";
import { PucLuaConfigureSourcesTarget } from "./PucLuaConfigureSourcesTarget";
import { PucLuaSourcesInfo } from "./PucLuaSourcesInfo";

export class PucLuaFinishConfigurationTarget implements ITarget {
    private parent: PucLuaConfigureSourcesTarget;
    private project: PucLuaProject;
    constructor(project: PucLuaProject, parent: PucLuaConfigureSourcesTarget) {
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[Start] Finish Lua ${this.project.getVersion().getString()} configuration`);
            resolve();
        });
    }
    getNext(): ITarget | null {
        return null;
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const srcInfo = <PucLuaSourcesInfo>this.project.configurationResult().getValue();
            const compat = srcInfo.getCompatFlag();
            if (compat) {
                console.log(`[Compat] ${compat}`);
            }
            const libSrcFiles = srcInfo.getLibSrcFiles();
            let len = libSrcFiles.getLenght();
            for (let i = 0; i < len; i++) {
                console.log(`[Library] ${libSrcFiles.getItem(i)}`);
            }
            console.log(`[Header Dir] ${srcInfo.getHeadersDir()}`);
            const headerFiles = srcInfo.getHeaderFiles();
            len = headerFiles.getLenght();
            for (let i = 0; i < len; i++) {
                console.log(`[Header] ${headerFiles.getItem(i)}`);
            }
            const interpreterSrcFiles = srcInfo.getInterpreterSrcFiles();
            len = interpreterSrcFiles.getLenght();
            for (let i = 0; i < len; i++) {
                console.log(`[Interpreter] ${interpreterSrcFiles.getItem(i)}`);
            }
            const compilerFiles = srcInfo.getCompilerSrcFiles();
            len = compilerFiles.getLenght();
            for (let i = 0; i < len; i++) {
                console.log(`[Compiler] ${compilerFiles.getItem(i)}`);
            }
            const manFiles = srcInfo.getManFiles();
            len = manFiles.getLenght();
            for (let i = 0; i < len; i++) {
                console.log(`[MAN] ${manFiles.getItem(i)}`);
            }
            resolve();
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[End] Finish Lua ${this.project.getVersion().getString()} configuration`);
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
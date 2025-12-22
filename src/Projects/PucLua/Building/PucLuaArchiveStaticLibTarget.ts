import { join } from "node:path";
import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { PucLuaProject } from "../PucLuaProject";
import { IReadOnlyArray } from "../../../Util/IReadOnlyArray";
import { PucLuaCompileStaticLibTarget } from "./PucLuaCompileStaticLibTarget";
import { isGccLikeToolchain, IGccLikeToolchain } from "../../../Toolchains/GCC/IGccLikeToolchain";
import { PucLuaSourcesInfo } from "../Configuration/PucLuaSourcesInfo";
import { PucLuaCompileInterpreterTarget } from "./PucLuaCompileInterpreterTarget";
import { Console } from "../../../Console";

export class PucLuaArchiveStaticLibTarget implements ITarget {
    private parent: PucLuaCompileStaticLibTarget;
    private project: PucLuaProject;
    private objFiles: IReadOnlyArray<string>;
    private staticLibrary: string | undefined;
    constructor(project: PucLuaProject, parent: PucLuaCompileStaticLibTarget) {
        this.project = project;
        this.parent = parent;
        this.objFiles = parent.getStaticLibObjectFiles();
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[Start] Archive Lua ${this.project.getVersion().getString()} static library`);
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
        return new PucLuaCompileInterpreterTarget(this.project, this);
    }
    getStaticLibObjectFiles(): IReadOnlyArray<string> {
        return this.objFiles;
    }
    getStaticLibrary(): string {
        return <string>this.staticLibrary;
    }
    getSourcesInfo(): PucLuaSourcesInfo {
        return this.parent.getSourcesInfo();
    }
    getSharedLibrary(): string {
        return this.parent.getSharedLibrary();
    }
    getImportLibrary(): string | undefined {
        return this.parent.getImportLibrary();
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const version = this.project.getVersion();
            const libName = `lua${version.getMajor()}${version.getMinor()}`;
            const toolchain = this.project.getToolchain();
            const archiver = toolchain.getArchiver();
            const isGccLike = isGccLikeToolchain(toolchain);
            const archivePrefix = isGccLike ? "lib" : "";
            const archiveSuffix = isGccLike ? "" : "-static";
            const archiveExt = archiver.getArchiveExtension();
            const archiveName = `${archivePrefix}${libName}${archiveSuffix}${archiveExt}`;
            const archive = join(this.project.getStaticLibBuildDir(), archiveName);
            archiver.reset();
            if (isGccLike) {
                archiver.addFlag("cru");
            }
            const len = this.objFiles.getLenght();
            for (let i = 0; i < len; i++) {
                archiver.addInputFile(this.objFiles.getItem(i));
            }
            archiver.setOutputFile(archive);
            archiver.execute()
                .then(() => {
                    if (isGccLike) {
                        const gccLikeToolchain = <IGccLikeToolchain>toolchain;
                        const ranlib = gccLikeToolchain.getRanlib();
                        ranlib.reset();
                        ranlib.setInputFile(archive);
                        ranlib.execute()
                            .then(() => {
                                this.staticLibrary = archive;
                                resolve();
                            })
                            .catch(reject);
                    }
                    else {
                        this.staticLibrary = archive;
                        resolve();
                    }
                })
                .catch(reject);
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[End] Archive Lua ${this.project.getVersion().getString()} static library`);
            resolve();
        });
    }
}
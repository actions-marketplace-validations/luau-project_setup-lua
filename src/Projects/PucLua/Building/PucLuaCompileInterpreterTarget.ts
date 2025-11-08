import { basename, join } from "node:path";
import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { PucLuaProject } from "../PucLuaProject";
import { PucLuaSourcesInfo } from "../Configuration/PucLuaSourcesInfo";
import { PucLuaArchiveStaticLibTarget } from "./PucLuaArchiveStaticLibTarget";
import { IPucLuaVersion, LUA_53_VERSION, LUA_54_VERSION } from "../PucLuaVersion";
import { IReadOnlyArray } from "../../../Util/IReadOnlyArray";
import { ReadOnlyArray } from "../../../Util/ReadOnlyArray";
import { PucLuaLinkInterpreterTarget } from "./PucLuaLinkInterpreterTarget";
import { isGccLikeToolchain } from "../../../Toolchains/GCC/IGccLikeToolchain";
import { ToolchainEnvironmentVariables } from "../../../Toolchains/ToolchainEnvironmentVariables";

export class PucLuaCompileInterpreterTarget implements ITarget {
    private parent: PucLuaArchiveStaticLibTarget;
    private project: PucLuaProject;
    private sourcesInfo: PucLuaSourcesInfo;
    private rawInterpreterObjectFiles: string[];
    constructor(project: PucLuaProject, parent: PucLuaArchiveStaticLibTarget) {
        this.project = project;
        this.parent = parent;
        this.sourcesInfo = parent.getSourcesInfo();
        this.rawInterpreterObjectFiles = [];
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[Start] Compile Lua ${this.project.getVersion().getString()} interpreter`);
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
        return new PucLuaLinkInterpreterTarget(this.project, this);
    }
    getInterpreterObjectFiles(): IReadOnlyArray<string> {
        return new ReadOnlyArray<string>(this.rawInterpreterObjectFiles);
    }
    getStaticLibrary(): string {
        return this.parent.getStaticLibrary();
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
            this.rawInterpreterObjectFiles.splice(0, this.rawInterpreterObjectFiles.length);
            const version = this.project.getVersion();
            const toolchain = this.project.getToolchain();
            const isGccLike = isGccLikeToolchain(toolchain);
            const compiler = toolchain.getCompiler();
            const objExt = compiler.getObjectFileExtension();
            const interpreterSrcFiles = this.sourcesInfo.getInterpreterSrcFiles();
            const len = interpreterSrcFiles.getLenght();

            const file_iter = (i: number) => {
                if (i < len) {
                    const file = interpreterSrcFiles.getItem(i);
                    compiler.reset();
                    if (isGccLike) {
                        compiler.addFlag("-std=gnu99");
                    }
                    compiler.setSpeedOptimizationSwitch();
                    compiler.setWarningSwitch();
                    if (process.platform === 'win32') {
                        if (isGccLike) {
                            /* do nothing */
                        }
                        else {
                            compiler.addFlag("/MD");
                        }
                        compiler.addDefine("LUA_BUILD_AS_DLL");
                    }
                    else if (process.platform === 'linux') {
                        compiler.addDefine("LUA_USE_LINUX");
                    }
                    else if (process.platform === 'darwin') {
                        compiler.addDefine("LUA_USE_MACOSX");
                    }
                    else if (process.platform === 'sunos') {
                        compiler.addDefine("LUA_USE_POSIX");
                        compiler.addDefine("LUA_USE_DLOPEN");
                        compiler.addDefine("_REENTRANT");
                    }
                    else if (process.platform === 'aix') {
                        compiler.addDefine("LUA_USE_POSIX");
                        compiler.addDefine("LUA_USE_DLOPEN");
                    }
                    else if (process.platform === 'freebsd' || process.platform === 'netbsd' || process.platform === 'openbsd')
                    {
                        if (version.compareTo(LUA_53_VERSION) >= 0) {
                            compiler.addDefine("LUA_USE_LINUX");
                        }
                        if (version.compareTo(LUA_54_VERSION) >= 0) {
                            compiler.addDefine("LUA_USE_READLINE");
                        }
                        compiler.addIncludeDir("/usr/include/edit");
                    }
                    else if (process.platform === 'cygwin')
                    {
                        compiler.addDefine("LUA_USE_LINUX");
                    }
                    const compatFlag = this.sourcesInfo.getCompatFlag();
                    if (compatFlag) {
                        compiler.addDefine(compatFlag);
                    }
                    compiler.addIncludeDir(this.sourcesInfo.getHeadersDir());
                    const fileBaseName = basename(file);
                    const outputFile = join(this.project.getInterpreterBuildDir(), fileBaseName.substring(0, fileBaseName.length - 2) + objExt);
                    compiler.setOutputFile(outputFile);
                    compiler.setInputFile(file);
                    const incDirsExtra = ToolchainEnvironmentVariables.instance().getIncDirsExtra();
                    for (const incDir of incDirsExtra) {
                        compiler.addIncludeDir(incDir);
                    }
                    const cflagsExtra = ToolchainEnvironmentVariables.instance().getCflagsExtra();
                    for (const cflag of cflagsExtra) {
                        compiler.addFlag(cflag);
                    }
                    compiler.execute()
                        .then(() => {
                            this.rawInterpreterObjectFiles.push(outputFile);
                            file_iter(i + 1);
                        })
                        .catch(reject);
                }
                else {
                    resolve();
                }
            }

            file_iter(0);
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[End] Compile Lua ${this.project.getVersion().getString()} interpreter`);
            resolve();
        });
    }
}
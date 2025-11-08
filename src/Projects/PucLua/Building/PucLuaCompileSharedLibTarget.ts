import { basename, join } from "node:path";
import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { PucLuaProject } from "../PucLuaProject";
import { PucLuaSourcesInfo } from "../Configuration/PucLuaSourcesInfo";
import { IReadOnlyArray } from "../../../Util/IReadOnlyArray";
import { ReadOnlyArray } from "../../../Util/ReadOnlyArray";
import { PucLuaLinkSharedLibTarget } from "./PucLuaLinkSharedLibTarget";
import { isGccLikeToolchain } from "../../../Toolchains/GCC/IGccLikeToolchain";
import { LUA_52_VERSION, LUA_53_VERSION, LUA_54_VERSION } from "../PucLuaVersion";
import { ToolchainEnvironmentVariables } from "../../../Toolchains/ToolchainEnvironmentVariables";

export class PucLuaCompileSharedLibTarget implements ITarget {
    private parent: ITarget | null;
    private project: PucLuaProject;
    private sourcesInfo: PucLuaSourcesInfo;
    private rawSharedLibObjectFiles: string[];
    constructor(project: PucLuaProject, parent: ITarget | null, sourcesInfo: PucLuaSourcesInfo) {
        this.project = project;
        this.parent = parent;
        this.sourcesInfo = sourcesInfo;
        this.rawSharedLibObjectFiles = [];
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[Start] Compile Lua ${this.project.getVersion().getString()} shared library`);
            resolve();
        });
    }
    getSourcesInfo(): PucLuaSourcesInfo {
        return this.sourcesInfo;
    }
    getProject(): IProject {
        return this.project;
    }
    getParent(): ITarget | null {
        return this.parent;
    }
    getNext(): ITarget | null {
        return new PucLuaLinkSharedLibTarget(this.project, this);
    }
    getSharedLibObjectFiles(): IReadOnlyArray<string> {
        return new ReadOnlyArray<string>(this.rawSharedLibObjectFiles);
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.rawSharedLibObjectFiles.splice(0, this.rawSharedLibObjectFiles.length);
            const version = this.project.getVersion();
            const toolchain = this.project.getToolchain();
            const isGccLike = isGccLikeToolchain(toolchain);
            const compiler = toolchain.getCompiler();
            const objExt = compiler.getObjectFileExtension();
            const libSrcFiles = this.sourcesInfo.getLibSrcFiles();
            const len = libSrcFiles.getLenght();

            const file_iter = (i: number) => {
                if (i < len) {
                    const file = libSrcFiles.getItem(i);
                    compiler.reset();
                    if (isGccLike) {
                        compiler.addFlag("-std=gnu99");
                    }
                    compiler.setSpeedOptimizationSwitch();
                    compiler.setWarningSwitch();
                    if (process.platform === 'win32') {
                        if (isGccLike) {
                            if (version.compareTo(LUA_52_VERSION) >= 0) {
                                compiler.addDefine("l_fseek", "fseeko64");
                                compiler.addDefine("l_ftell", "ftello64");
                                compiler.addDefine("l_seeknum", "off64_t");
                            }
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

                    if (process.platform !== "win32" && isGccLike) {
                        compiler.addFlag("-fPIC");
                    }

                    const compatFlag = this.sourcesInfo.getCompatFlag();
                    if (compatFlag) {
                        compiler.addDefine(compatFlag);
                    }
                    compiler.addIncludeDir(this.sourcesInfo.getHeadersDir());
                    const fileBaseName = basename(file);
                    const outputFile = join(this.project.getSharedLibBuildDir(), fileBaseName.substring(0, fileBaseName.length - 2) + objExt);
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
                            this.rawSharedLibObjectFiles.push(outputFile);
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
            console.log(`[End] Compile Lua ${this.project.getVersion().getString()} shared library`);
            resolve();
        });
    }
}
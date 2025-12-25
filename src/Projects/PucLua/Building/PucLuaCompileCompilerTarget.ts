import { basename, extname, join } from "node:path";
import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { PucLuaProject } from "../PucLuaProject";
import { PucLuaSourcesInfo } from "../Configuration/PucLuaSourcesInfo";
import { IReadOnlyArray } from "../../../Util/IReadOnlyArray";
import { ReadOnlyArray } from "../../../Util/ReadOnlyArray";
import { PucLuaLinkCompilerTarget } from "./PucLuaLinkCompilerTarget";
import { PucLuaLinkInterpreterTarget } from "./PucLuaLinkInterpreterTarget";
import { isGccLikeToolchain } from "../../../Toolchains/GCC/IGccLikeToolchain";
import { LUA_53_VERSION, LUA_54_VERSION } from "../PucLuaVersion";
import { ToolchainEnvironmentVariables } from "../../../Toolchains/ToolchainEnvironmentVariables";
import { Console } from "../../../Console";

export class PucLuaCompileCompilerTarget implements ITarget {
    private parent: PucLuaLinkInterpreterTarget;
    private project: PucLuaProject;
    private sourcesInfo: PucLuaSourcesInfo;
    private rawCompilerObjectFiles: string[];
    constructor(project: PucLuaProject, parent: PucLuaLinkInterpreterTarget) {
        this.project = project;
        this.parent = parent;
        this.sourcesInfo = parent.getSourcesInfo();
        this.rawCompilerObjectFiles = [];
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[Start] Compile Lua ${this.project.getVersion().getString()} compiler`);
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
        return new PucLuaLinkCompilerTarget(this.project, this);
    }
    getCompilerObjectFiles(): IReadOnlyArray<string> {
        return new ReadOnlyArray<string>(this.rawCompilerObjectFiles);
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
    getInterpreter(): string {
        return this.parent.getInterpreter();
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.rawCompilerObjectFiles.splice(0, this.rawCompilerObjectFiles.length);
            const version = this.project.getVersion();
            const toolchain = this.project.getToolchain();
            const isGccLike = isGccLikeToolchain(toolchain);
            const compiler = toolchain.getCompiler();
            const objExt = compiler.getObjectFileExtension();
            const compilerSrcFiles = this.sourcesInfo.getCompilerSrcFiles();
            const len = compilerSrcFiles.getLenght();

            const file_iter = (i: number) => {
                if (i < len) {
                    const file = compilerSrcFiles.getItem(i);
                    compiler.reset();
                    if (isGccLike) {
                        const compilerPath = compiler.path().getValue() || "";
                        const compilerName = basename(compilerPath, extname(compilerPath)).toLowerCase();
                        if (["gcc", "cc", "clang"].includes(compilerName)) {
                            compiler.addFlag("-std=gnu99");
                        }
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
                    const outputFile = join(this.project.getCompilerBuildDir(), fileBaseName.substring(0, fileBaseName.length - 2) + objExt);
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
                            this.rawCompilerObjectFiles.push(outputFile);
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
            Console.instance().writeLine(`[End] Compile Lua ${this.project.getVersion().getString()} compiler`);
            resolve();
        });
    }
}
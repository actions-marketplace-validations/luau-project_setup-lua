import { join } from "node:path";
import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { PucLuaProject } from "../PucLuaProject";
import { IReadOnlyArray } from "../../../Util/IReadOnlyArray";
import { PucLuaCompileCompilerTarget } from "./PucLuaCompileCompilerTarget";
import { isGccLikeToolchain } from "../../../Toolchains/GCC/IGccLikeToolchain";
import { PucLuaCreatePkgConfigTarget } from "./PucLuaCreatePkgConfigTarget";
import { PucLuaSourcesInfo } from "../Configuration/PucLuaSourcesInfo";
import { ToolchainEnvironmentVariables } from "../../../Toolchains/ToolchainEnvironmentVariables";
import { Console } from "../../../Console";

export class PucLuaLinkCompilerTarget implements ITarget {
    private parent: PucLuaCompileCompilerTarget;
    private project: PucLuaProject;
    private compiler?: string;
    private objFiles: IReadOnlyArray<string>;
    constructor(project: PucLuaProject, parent: PucLuaCompileCompilerTarget) {
        this.project = project;
        this.parent = parent;
        this.objFiles = parent.getCompilerObjectFiles();
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[Start] Link Lua ${this.project.getVersion().getString()} compiler`);
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
        return new PucLuaCreatePkgConfigTarget(this.project, this);
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
    getCompiler(): string {
        return <string>this.compiler;
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const toolchain = this.project.getToolchain();
            const linker = toolchain.getLinker();
            linker.reset();
            const isGccLike = isGccLikeToolchain(toolchain);
            const compilerExt = (process.platform === 'win32' || process.platform === 'cygwin') ? ".exe" : "";
            const compilerFile = join(this.project.getCompilerBuildDir(), `luac${compilerExt}`);
            const version = this.project.getVersion();
            linker.setOutputFile(compilerFile);
            const len = this.objFiles.getLenght();
            for (let i = 0; i < len; i++) {
                linker.addObjectFile(this.objFiles.getItem(i));
            }

            if (process.platform === 'win32' || process.platform === 'cygwin')
            {
                linker.addLibrary(this.parent.getStaticLibrary());
                if (isGccLike) {
                    linker.addLinkLibrary("m");
                }
            }
            else
            {
                linker.addLinkLibrary("m");
                linker.addLibrary(this.parent.getStaticLibrary());
                if (process.platform === 'freebsd' || process.platform === 'netbsd' || process.platform === 'openbsd')
                {
                    linker.addFlag("-Wl,-E");
                    linker.addLinkLibrary("edit");
                }
                else if (process.platform === 'linux') {
                    linker.addFlag("-Wl,-E");
                    linker.addLinkLibrary("dl");
                    linker.addLinkLibrary("readline");
                }
                else if (process.platform === 'aix') {
                    linker.addLinkLibrary("dl");
                    linker.addFlag("-brtl");
                    linker.addFlag("-bexpall");
                }
                else if (process.platform === 'darwin')
                {
                    linker.addLinkLibrary("readline");
                }
                else if (process.platform === "sunos") {
                    linker.addLinkLibrary("dl");
                }
                else {
                    linker.addLinkLibrary("dl");
                }
            }

            const libDirs = ToolchainEnvironmentVariables.instance().getLibDirsExtra();
            for (const libDir of libDirs) {
                linker.addLibDir(libDir);
            }
            const libs = ToolchainEnvironmentVariables.instance().getLibsExtra();
            for (const lib of libs) {
                linker.addLinkLibrary(lib);
            }
            const ldFlags = ToolchainEnvironmentVariables.instance().getLdFlagsExtra();
            for (const flag of ldFlags) {
                linker.addFlag(flag);
            }
            linker.execute()
                .then(() => {
                    this.compiler = compilerFile;
                    resolve();
                })
                .catch(reject);
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[End] Link Lua ${this.project.getVersion().getString()} compiler`);
            resolve();
        });
    }
}
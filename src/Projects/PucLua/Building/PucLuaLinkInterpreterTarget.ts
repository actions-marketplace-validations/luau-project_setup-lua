import { join } from "node:path";
import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { PucLuaProject } from "../PucLuaProject";
import { PucLuaSourcesInfo } from "../Configuration/PucLuaSourcesInfo";
import { IReadOnlyArray } from "../../../Util/IReadOnlyArray";
import { PucLuaCompileInterpreterTarget } from "./PucLuaCompileInterpreterTarget";
import { isGccLikeToolchain } from "../../../Toolchains/GCC/IGccLikeToolchain";
import { PucLuaCompileCompilerTarget } from "./PucLuaCompileCompilerTarget";
import { ToolchainEnvironmentVariables } from "../../../Toolchains/ToolchainEnvironmentVariables";

export class PucLuaLinkInterpreterTarget implements ITarget {
    private parent: PucLuaCompileInterpreterTarget;
    private project: PucLuaProject;
    private interpreter?: string;
    private objFiles: IReadOnlyArray<string>;
    constructor(project: PucLuaProject, parent: PucLuaCompileInterpreterTarget) {
        this.project = project;
        this.parent = parent;
        this.objFiles = parent.getInterpreterObjectFiles();
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[Start] Link Lua ${this.project.getVersion().getString()} interpreter`);
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
        return new PucLuaCompileCompilerTarget(this.project, this);
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
        return <string>this.interpreter;
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const toolchain = this.project.getToolchain();
            const linker = toolchain.getLinker();
            linker.reset();
            const isGccLike = isGccLikeToolchain(toolchain);
            const interpreterExt = (process.platform === 'win32' || process.platform === 'cygwin') ? ".exe" : "";
            const interpreterFile = join(this.project.getInterpreterBuildDir(), `lua${interpreterExt}`);
            const version = this.project.getVersion();
            linker.setOutputFile(interpreterFile);
            const len = this.objFiles.getLenght();
            for (let i = 0; i < len; i++) {
                linker.addObjectFile(this.objFiles.getItem(i));
            }

            if (process.platform === 'win32' || process.platform === 'cygwin')
            {
                const impLib = this.parent.getImportLibrary();
                if (impLib) {
                    linker.addLibrary(impLib);
                }
                else {
                    linker.addLibrary(this.parent.getSharedLibrary());
                }
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
                    this.interpreter = interpreterFile;
                    resolve();
                })
                .catch(reject);
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[End] Link Lua ${this.project.getVersion().getString()} interpreter`);
            resolve();
        });
    }
}
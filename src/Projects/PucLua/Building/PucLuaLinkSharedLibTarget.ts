import { join } from "node:path";
import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { PucLuaProject } from "../PucLuaProject";
import { IReadOnlyArray } from "../../../Util/IReadOnlyArray";
import { PucLuaCompileSharedLibTarget } from "./PucLuaCompileSharedLibTarget";
import { hasWin32ImportLibraryDecorator, IWin32ImportLibraryDecorator } from "../../../Toolchains/IWin32ImportLibraryDecorator";
import { isGccLikeToolchain, IGccLikeToolchain } from "../../../Toolchains/GCC/IGccLikeToolchain";
import { PucLuaCompileStaticLibTarget } from "./PucLuaCompileStaticLibTarget";
import { PucLuaSourcesInfo } from "../Configuration/PucLuaSourcesInfo";
import { ToolchainEnvironmentVariables } from "../../../Toolchains/ToolchainEnvironmentVariables";

export class PucLuaLinkSharedLibTarget implements ITarget {
    private parent: PucLuaCompileSharedLibTarget;
    private project: PucLuaProject;
    private objFiles: IReadOnlyArray<string>;
    private sharedLibrary: string | undefined;
    private importLibrary: string | undefined;
    constructor(project: PucLuaProject, parent: PucLuaCompileSharedLibTarget) {
        this.project = project;
        this.parent = parent;
        this.objFiles = parent.getSharedLibObjectFiles();
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[Start] Link Lua ${this.project.getVersion().getString()} shared library`);
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
        return new PucLuaCompileStaticLibTarget(this.project, this);
    }
    getSourcesInfo(): PucLuaSourcesInfo {
        return this.parent.getSourcesInfo();
    }
    getSharedLibObjectFiles(): IReadOnlyArray<string> {
        return this.objFiles;
    }
    getSharedLibrary(): string {
        return <string>this.sharedLibrary;
    }
    getImportLibrary(): string | undefined {
        return this.importLibrary;
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const version = this.project.getVersion();
            const libName = `lua${version.getMajor()}${version.getMinor()}`;
            const toolchain = this.project.getToolchain();
            const linker = toolchain.getLinker();
            linker.reset();
            const isGccLike = isGccLikeToolchain(toolchain);
            if (process.platform === 'win32' || process.platform === 'cygwin')
            {
                const libBaseName = process.platform === 'cygwin' ?
                    `cyg${libName}.dll` :
                    `${libName}.dll`;
                let libraryPath = join(this.project.getSharedLibBuildDir(), libBaseName);
                let impLib: string | undefined;
                if (hasWin32ImportLibraryDecorator(linker)) {
                    const win32Linker = <IWin32ImportLibraryDecorator><any>linker;
                    const implibExt = win32Linker.getImportLibraryExtension();
                    const implibBaseName = isGccLike ?
                        `lib${libName}${implibExt}` :
                        `${libName}${implibExt}`;
                    impLib = join(this.project.getSharedLibBuildDir(), implibBaseName);
                    win32Linker.setImportLibrary(impLib);
                }
                linker.setOutputFile(libraryPath);
                linker.setOutputMode("shared");
                const len = this.objFiles.getLenght();
                for (let i = 0; i < len; i++) {
                    linker.addObjectFile(this.objFiles.getItem(i));
                }
                if (isGccLike) {
                    linker.addLinkLibrary("m");
                }
                linker.execute()
                    .then(() => {
                        if (isGccLike) {
                            const gccLikeToolchain = <IGccLikeToolchain>toolchain;
                            const strip = gccLikeToolchain.getStrip();
                            strip.reset();
                            strip.addStripUnneeded();
                            strip.setInputFile(libraryPath);
                            strip.execute()
                                .then(() => {
                                    this.sharedLibrary = libraryPath;
                                    this.importLibrary = impLib;
                                    resolve();
                                })
                                .catch(reject);
                        }
                        else
                        {
                            this.sharedLibrary = libraryPath;
                            this.importLibrary = impLib;
                            resolve();
                        }
                    })
                    .catch(reject);
            }
            else
            {
                const libExt = process.platform === 'darwin' ? 'dylib' : 'so';
                const libBaseName = `lib${libName}.${libExt}`;
                const libraryPath = join(this.project.getSharedLibBuildDir(), libBaseName);
                linker.setOutputFile(libraryPath);
                linker.setOutputMode("shared");
                linker.addLinkLibrary("m");
                const len = this.objFiles.getLenght();
                for (let i = 0; i < len; i++) {
                    linker.addObjectFile(this.objFiles.getItem(i));
                }
                if (process.platform === 'freebsd' || process.platform === 'netbsd' || process.platform === 'openbsd')
                {
                    linker.addLinkLibrary("edit");
                }
                else if (process.platform === 'linux') {
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
                        if (process.platform === 'darwin') {
                            this.sharedLibrary = libraryPath;
                            resolve();
                        }
                        else {
                            if (isGccLike) {
                                const gccLikeToolchain = <IGccLikeToolchain>toolchain;
                                const strip = gccLikeToolchain.getStrip();
                                strip.reset();
                                strip.addStripUnneeded();
                                strip.setInputFile(libraryPath);
                                strip.execute()
                                    .then(() => {
                                        this.sharedLibrary = libraryPath;
                                        resolve();
                                    })
                                    .catch(reject);
                            }
                            else
                            {
                                this.sharedLibrary = libraryPath;
                                resolve();
                            }
                        }
                    })
                    .catch(reject);
            }
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[End] Link Lua ${this.project.getVersion().getString()} shared library`);
            resolve();
        });
    }
}
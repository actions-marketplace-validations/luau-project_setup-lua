import { basename, extname, join } from "node:path";
import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaJitSourcesInfo } from "../Configuration/LuaJitSourcesInfo";
import { LuaJitProject } from "../LuaJitProject";
import { LuaJitBuildTarget } from "./LuaJitBuildTarget";
import { writeFile } from "node:fs/promises";
import { LuaJitWindowsBuildInfo } from "./LuaJitWindowsBuildInfo";
import { hasWin32ImportLibraryDecorator, IWin32ImportLibraryDecorator } from "../../../Toolchains/IWin32ImportLibraryDecorator";
import { LuaJitFinishBuildingTarget } from "./LuaJitFinishBuildingTarget";
import { LuaJitUnixBuildInfo } from "./LuaJitUnixBuildInfo";
import { Console } from "../../../Console";

export class LuaJitCreatePkgConfigTarget implements ITarget {
    private project: LuaJitProject;
    private parent: LuaJitBuildTarget;
    private pkgConfig?: string;
    constructor(project: LuaJitProject, parent: LuaJitBuildTarget) {
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console.instance().writeLine(`[Start] Create pkgconfig file for ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getProject(): IProject {
        return this.project;
    }
    getParent(): ITarget | null {
        return this.parent;
    }
    getSourcesInfo(): LuaJitSourcesInfo {
        return this.parent.getSourcesInfo();
    }
    getNext(): ITarget | null {
        return new LuaJitFinishBuildingTarget(this.project, this);
    }
    private setWindowsBuildResult(): void {
        this.project.buildResult().setValue(
            new LuaJitWindowsBuildInfo(
                this.parent.getSourcesInfo(),
                <string>this.parent.getSharedLibrary(),
                <string>this.parent.getInterpreter(),
                <string>this.pkgConfig,
                this.parent.getImportLibrary()
            )
        );
    }
    private setUnixBuildResult(): void {
        this.project.buildResult().setValue(
            new LuaJitUnixBuildInfo(
                <string>this.parent.getUnixMake(),
                this.parent.getUnixMakeArguments().createCopy()
            )
        );
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (process.platform === 'win32') {
                const sharedLibrary = this.parent.getSharedLibrary();
                if (sharedLibrary) {
                    const interpreter = this.parent.getInterpreter();
                    if (interpreter) {
                        const furtherProcessing = (libname?: string) => {
                            const srcInfo = this.parent.getSourcesInfo();
                            const version = srcInfo.getVersion();
                            const lines: string[] = [];
                            lines.push(`majver=${version.getMajor()}`);
                            lines.push(`minver=${version.getMinor()}`);
                            lines.push(`relver=${version.getRelease()}`);
                            lines.push("version=${majver}.${minver}.${relver}");
                            lines.push(`abiver=${version.getABI()}`);
                            lines.push("");

                            const prefix = this.project.getInstallDir().replace(/\\/g, "/");
                            const incdir = this.project.getInstallIncludeDir(version).replace(/\\/g, "/");
                            const bindir = this.project.getInstallBinDir().replace(/\\/g, "/");
                            const libdir = libname ? this.project.getInstallLibDir().replace(/\\/g, "/") : bindir;
                            const lmod = this.project.getInstallLuaModulesDir().replace(/\\/g, "/");
                            const cmod = this.project.getInstallCModulesDir().replace(/\\/g, "/");
                            const mandir = this.project.getInstallManDir().replace(/\\/g, "/");

                            lines.push(`prefix=${prefix}`);
                            lines.push(`exec_prefix=${prefix}`);
                            lines.push(`libname=${libname ?? basename(sharedLibrary, extname(sharedLibrary))}`);
                            lines.push(`includedir=${incdir}`);
                            lines.push(`bindir=${bindir}`);
                            lines.push(`libdir=${libdir}`);
                            lines.push("");
                            lines.push(`INSTALL_BIN=${bindir}`);
                            lines.push(`INSTALL_INC=${incdir}`);
                            lines.push(`INSTALL_LIB=${libdir}`);
                            lines.push(`INSTALL_MAN=${mandir}`);
                            lines.push(`INSTALL_LMOD=${lmod}`);
                            lines.push(`INSTALL_CMOD=${cmod}`);
                            lines.push("");
                            lines.push("Name: LuaJIT");
                            lines.push("Description: Just-in-time compiler for Lua");
                            lines.push("URL: https://luajit.org");
                            lines.push("Version: ${version}");
                            lines.push("Requires:");
                            lines.push("Libs: -L${libdir} -l${libname}");
                            lines.push("Cflags: -I${includedir}");

                            const pkgConfigFileName = join(this.project.getBuildDir(), `luajit.pc`);
                            writeFile(pkgConfigFileName, lines.join("\n"), { encoding: "utf8" })
                                .then(() => {
                                    this.pkgConfig = pkgConfigFileName;
                                    this.setWindowsBuildResult();
                                    resolve();
                                })
                                .catch(reject);
                        };

                        const importLibrary = this.parent.getImportLibrary();
                        if (importLibrary) {
                            let libname = basename(importLibrary);
                            if (libname.startsWith("lib")) {
                                libname = libname.substring(3);
                            }
                            const toolchain = this.project.getToolchain();
                            const linker = toolchain.getLinker();
                            if (hasWin32ImportLibraryDecorator(linker)) {
                                const win32Linker = <IWin32ImportLibraryDecorator><any>linker;
                                const implibExt = win32Linker.getImportLibraryExtension();
                                if (libname.endsWith(implibExt)) {
                                    libname = libname.substring(0, libname.length - implibExt.length);

                                    furtherProcessing(libname);
                                }
                                else {
                                    reject(new Error("Unsupported linker: import library extension mismatch."));
                                }
                            }
                            else {
                                reject(new Error("Unsupported linker: linker is expected to implement IWin32ImportLibraryDecorator."));
                            }
                        }
                        else {
                            furtherProcessing();
                        }
                    }
                    else {
                        reject(new Error("Internal error: interpreter has not a value"));
                    }
                }
                else {
                    reject(new Error("Internal error: shared library has not a value"));
                }
            }
            else {
                this.setUnixBuildResult();
                resolve();
            }
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console.instance().writeLine(`[End] Create pkgconfig file for ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
}
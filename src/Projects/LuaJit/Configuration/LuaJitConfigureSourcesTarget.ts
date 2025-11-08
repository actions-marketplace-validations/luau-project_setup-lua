import { extname, join } from "node:path";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline/promises";
import { readdir, readFile, stat } from "node:fs/promises";
import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaJitProject } from "../LuaJitProject";
import { LuaJitSourcesInfo } from "./LuaJitSourcesInfo";
import { ILuaJitVersion, LuaJitVersion, OpenRestyVersion } from "../LuaJitVersion";
import { LuaJitRepositoryVersion, OpenRestyRepositoryVersion } from "../LuaJitRepositoryVersion";
import { LuaJitFinishConfigurationTarget } from "./LuaJitFinishConfigurationTarget";
import { checkFiles } from "../../../Util/CheckFiles";
import { LuaJitApplyPatchesTarget } from "./LuaJitApplyPatchesTarget";

export class LuaJitConfigureSourcesTarget implements ITarget {
    private parent: LuaJitApplyPatchesTarget;
    private project: LuaJitProject;
    private srcDir?: string;
    private majorVer?: string;
    private minorVer?: string;
    private releaseVer?: string;
    private abiVer?: string;
    private unixMakefile?: string;
    private mingwMakefile?: string;
    private msvcBuildBat?: string;
    private delayedHeaderFile?: string;
    private rawHeaderFiles: string[];
    private rawManFiles: string[];
    private rawJitFiles: string[];
    constructor(project: LuaJitProject, parent: LuaJitApplyPatchesTarget) {
        this.project = project;
        this.parent = parent;
        this.rawHeaderFiles = [];
        this.rawManFiles = [];
        this.rawJitFiles = [];
        this.srcDir = undefined;
        this.majorVer = undefined;
        this.minorVer = undefined;
        this.releaseVer = undefined;
        this.abiVer = undefined;
        this.unixMakefile = undefined;
        this.mingwMakefile = undefined;
        this.msvcBuildBat = undefined;
        this.delayedHeaderFile = undefined;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            console.log(`[Start] Configure source code for ${projectVersion.getName()} ${projectVersion.getRef()}`);
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
        return new LuaJitFinishConfigurationTarget(this.project, this);
    }
    private setConfigurationResult(): void {
        const projectVersion = this.project.getVersion();

        let luaJitVersion: ILuaJitVersion;
        if (projectVersion instanceof LuaJitRepositoryVersion) {
            luaJitVersion = new LuaJitVersion(
                <string>this.majorVer,
                <string>this.minorVer,
                <string>this.releaseVer,
                <string>this.abiVer
            );
        }
        else if (projectVersion instanceof OpenRestyRepositoryVersion) {
            luaJitVersion = new OpenRestyVersion(
                <string>this.majorVer,
                <string>this.minorVer,
                <string>this.releaseVer,
                <string>this.abiVer
            );
        }
        else {
            throw new Error("Unknown LuaJIT repository version");
        }

        this.project.configurationResult().setValue(
            new LuaJitSourcesInfo(
                this.parent.getDirectory(),
                <string>this.srcDir,
                luaJitVersion,
                <string>this.unixMakefile,
                <string>this.mingwMakefile,
                <string>this.msvcBuildBat,
                <string>this.delayedHeaderFile,
                this.rawHeaderFiles,
                this.rawManFiles,
                this.rawJitFiles
            )
        );
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.rawHeaderFiles.splice(0, this.rawHeaderFiles.length);
            this.rawManFiles.splice(0, this.rawManFiles.length);
            this.rawJitFiles.splice(0, this.rawJitFiles.length);
            this.srcDir = undefined;
            this.majorVer = undefined;
            this.minorVer = undefined;
            this.releaseVer = undefined;
            this.abiVer = undefined;
            this.unixMakefile = undefined;
            this.mingwMakefile = undefined;
            this.msvcBuildBat = undefined;
            this.delayedHeaderFile = undefined;
            const extractedDir = this.parent.getDirectory();
            const _unixMakeFile = join(extractedDir, "Makefile");
            const _srcDir = join(extractedDir, "src");
            const _etcDir = join(extractedDir, "etc");
            const _jitDir = join(_srcDir, "jit");
            const _pkgConfigFile = join(_etcDir, "luajit.pc");
            const _msvcBuildBat = join(_srcDir, "msvcbuild.bat");
            const _mingwMakeFile = join(_srcDir, "Makefile");
            const _delayedHeaderFile = join(_srcDir, "luajit.h");

            const targetHeaders: string[] = [
                /*
                * the delayed header file above (luajit.h)
                * appears in the build phase
                 */
                join(_srcDir, "lua.h"),
                join(_srcDir, "lua.hpp"),
                join(_srcDir, "luaconf.h"),
                join(_srcDir, "lauxlib.h"),
                join(_srcDir, "lualib.h")
            ];

            const targetManFiles: string[] = [
                join(_etcDir, "luajit.1")
            ];

            checkFiles(targetHeaders)
                .then(() => {
                    for (const header of targetHeaders) {
                        this.rawHeaderFiles.push(header);
                    }

                    checkFiles(targetManFiles)
                        .then(() => {
                            for (const manFile of targetManFiles) {
                                this.rawManFiles.push(manFile);
                            }

                            let dotrelverContent: string | undefined;
                            const furtherProcessing = () => {
                                checkFiles([
                                    _unixMakeFile,
                                    _msvcBuildBat,
                                    _mingwMakeFile,
                                    _pkgConfigFile
                                ])
                                    .then(() => {
                                        this.srcDir = _srcDir;
                                        this.unixMakefile = _unixMakeFile;
                                        this.msvcBuildBat = _msvcBuildBat;
                                        this.mingwMakefile = _mingwMakeFile;

                                        const rl_pkgconfig = createInterface({
                                            input: createReadStream(_pkgConfigFile),
                                            crlfDelay: Infinity
                                        });

                                        rl_pkgconfig.on("line", line => {
                                            const majorMatch = /^majver\=(\d+)$/.exec(line);
                                            if (majorMatch) {
                                                this.majorVer = majorMatch[1];
                                            }
                                            const minorMatch = /^minver\=(\d+)$/.exec(line);
                                            if (minorMatch) {
                                                this.minorVer = minorMatch[1];
                                            }
                                            const abiMatch = /^abiver\=(\d+\.\d+)$/.exec(line);
                                            if (abiMatch) {
                                                this.abiVer = abiMatch[1];
                                            }
                                            const relMatch = /^relver\=(ROLLING|\d+)$/.exec(line);
                                            if (relMatch) {
                                                const pkgConfigRelVer = relMatch[1];
                                                if (pkgConfigRelVer === "ROLLING") {
                                                    this.releaseVer = dotrelverContent;
                                                }
                                                else {
                                                    this.releaseVer = pkgConfigRelVer;
                                                }
                                            }
                                        });

                                        rl_pkgconfig.on("close", () => {
                                            if (this.releaseVer === undefined) {
                                                reject(new Error("Release version not found"));
                                            }
                                            else if (!this.majorVer) {
                                                reject(new Error("Major version not found"));
                                            }
                                            else if (!this.minorVer) {
                                                reject(new Error("Minor version not found"));
                                            }
                                            else if (!this.abiVer) {
                                                reject(new Error("ABI version not found"));
                                            }
                                            else {
                                                readdir(_jitDir)
                                                    .then(jitFiles => {
                                                        const jitfiles_iter = (j: number) => {
                                                            if (j < jitFiles.length) {
                                                                const jf_path = join(_jitDir, jitFiles[j]);
                                                                stat(jf_path)
                                                                    .then(jf_s => {
                                                                        if (jf_s.isFile()) {
                                                                            const ext = extname(jf_path);
                                                                            if (ext === ".lua") {
                                                                                this.rawJitFiles.push(jf_path);
                                                                            }
                                                                        }

                                                                        jitfiles_iter(j + 1);
                                                                    })
                                                                    .catch(reject);
                                                            }
                                                            else {
                                                                this.delayedHeaderFile = _delayedHeaderFile;
                                                                this.setConfigurationResult();
                                                                resolve();
                                                            }
                                                        };

                                                        jitfiles_iter(0);
                                                    })
                                                    .catch(reject);
                                            }
                                        });
                                    })
                                    .catch(reject);
                            };

                            const topLevelRelVer = join(extractedDir, ".relver");
                            readFile(topLevelRelVer, { encoding: "utf-8" })
                                .then(s => {
                                    const dotrelverMatch = /^(\d+)(\r\n|\r|\n)$/.exec(s);
                                    if (dotrelverMatch) {
                                        dotrelverContent = dotrelverMatch[1];
                                    }
                                    else {
                                        dotrelverContent = "";
                                    }
                                    furtherProcessing();
                                })
                                .catch(topLevelRelVerErr => {
                                    dotrelverContent = "";
                                    furtherProcessing();
                                });
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            console.log(`[End] Configure source code for ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
}
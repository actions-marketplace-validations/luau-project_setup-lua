import { mkdtemp, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { EOL } from "node:os";
import { isGccLikeToolchain } from "../../../Toolchains/GCC/IGccLikeToolchain";
import { executeProcess, getStdOutFromProcessExecution } from "../../../Util/ExecuteProcess";
import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaJitSourcesInfo } from "../Configuration/LuaJitSourcesInfo";
import { LuaJitProject } from "../LuaJitProject";
import { checkFiles } from "../../../Util/CheckFiles";
import { LuaJitCreatePkgConfigTarget } from "./LuaJitCreatePkgConfigTarget";
import { IReadOnlyArray } from "../../../Util/IReadOnlyArray";
import { ReadOnlyArray } from "../../../Util/ReadOnlyArray";
import { ToolchainEnvironmentVariables } from "../../../Toolchains/ToolchainEnvironmentVariables";
import { compareVersions } from "../../../Util/CompareVersions";
import { GitHubInput } from "../../../Util/GitHubInput";
import { defaultStdOutHandler } from "../../../Util/DefaultStdOutHandler";

export class LuaJitBuildTarget implements ITarget {
    private project: LuaJitProject;
    private parent: ITarget | null;
    private srcInfo: LuaJitSourcesInfo;
    private sharedLibrary?: string;
    private interpreter?: string;
    private importLibrary?: string;
    private rawMake?: string;
    private rawMakeArguments: string[];
    constructor(project: LuaJitProject, parent: ITarget | null, sourceInfo: LuaJitSourcesInfo) {
        this.project = project;
        this.parent = parent;
        this.srcInfo = sourceInfo;
        this.sharedLibrary = undefined;
        this.interpreter = undefined;
        this.importLibrary = undefined;
        this.rawMake = undefined;
        this.rawMakeArguments = [];
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            console.log(`[Start] Build ${projectVersion.getName()} ${projectVersion.getRef()}`);
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
        return this.srcInfo;
    }
    getSharedLibrary(): string | undefined {
        return this.sharedLibrary;
    }
    getInterpreter(): string | undefined {
        return this.interpreter;
    }
    getImportLibrary(): string | undefined {
        return this.importLibrary;
    }
    getUnixMake(): string | undefined {
        return this.rawMake;
    }
    getUnixMakeArguments(): IReadOnlyArray<string> {
        return new ReadOnlyArray<string>(this.rawMakeArguments);
    }
    getNext(): ITarget | null {
        return new LuaJitCreatePkgConfigTarget(this.project, this);
    }
    private parseMacOSXDeploymentTarget(deploymentTarget: string): string {
        const version: number[] = [];
        const swMatch = /^(\d+)\.(\d+)(\.(\d+))?$/.exec(deploymentTarget);
        if (swMatch) {
            const major = Number(swMatch[1]);
            const minor = Number(swMatch[2]);
            const patch = Number(swMatch[4] || "0");
            if (compareVersions([major, minor, patch], [11, 0]) >= 0) {
                version.push(11);
                version.push(0);
            }
            else if (compareVersions([major, minor, patch], [10, 10]) >= 0) {
                version.push(10);
                version.push(8);
            }
            else if (compareVersions([major, minor, patch], [10, 5]) >= 0) {
                version.push(10);
                version.push(5);
            }
            else {
                version.push(10);
                version.push(3);
            }
        }
        else {
            version.push(10);
            version.push(3);
        }
        return `${version[0]}.${version[1]}`;
    }
    private getMacOSXDeloymentTarget(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let deploymentTarget = (GitHubInput.instance().getInputMacOSXDeploymentTarget() || process.env["MACOSX_DEPLOYMENT_TARGET"] || "").trim();
            if (deploymentTarget) {
                resolve(this.parseMacOSXDeploymentTarget(deploymentTarget));
            }
            else {
                getStdOutFromProcessExecution("sw_vers", {
                    args: ["-productVersion"],
                    verbose: true
                })
                    .then(result => {
                        if (result.lines.length > 0) {
                            deploymentTarget = result.lines[0];
                            resolve(this.parseMacOSXDeploymentTarget(deploymentTarget))
                        }
                        else {
                            reject(new Error("Internal error: Unable to set MACOSX_DEPLOYMENT_TARGET"));
                        }
                    })
                    .catch(reject);
            }
        });
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.sharedLibrary = undefined;
            this.interpreter = undefined;
            this.importLibrary = undefined;
            this.rawMake = undefined;
            this.rawMakeArguments.splice(0, this.rawMakeArguments.length);
            if (process.platform === 'win32') {
                const toolchain = this.project.getToolchain();
                const luaJitSrcDir = this.srcInfo.getSrcDir();
                const luaJitVersion = this.srcInfo.getVersion();
                const isGccLike = isGccLikeToolchain(toolchain);
                const _sharedLibrary = join(luaJitSrcDir, "lua51.dll");
                const _interpreter = join(luaJitSrcDir, "luajit.exe");
                const _importLibrary = join(luaJitSrcDir,
                    isGccLike ?
                        `libluajit-${luaJitVersion.getABI()}.dll.a`:
                        "lua51.lib"
                );
                const filesToCheck: string[] = [
                    _sharedLibrary,
                    _interpreter
                ];
                const cmd = (process.env["COMSPEC"] || "cmd").trim();
                if (isGccLike) {
                    const make = ToolchainEnvironmentVariables.instance().getMake();
                    const cross = ToolchainEnvironmentVariables.instance().getToolchainPrefix();
                    const envCC = ToolchainEnvironmentVariables.instance().getRawCC();
                    const cflags = ToolchainEnvironmentVariables.instance().getCflagsExtra();
                    const incDirs = ToolchainEnvironmentVariables.instance().getIncDirsExtra();
                    const combinedXcflags: string[] = [];
                    for (const flag of cflags) {
                        combinedXcflags.push(`"${flag}"`)
                    }
                    for (const incDir of incDirs) {
                        combinedXcflags.push(`"-I${incDir}"`)
                    }

                    const coreBuildForMinGW: (hasStatusLongJump: boolean) => void = (statusLongJump) => {
                        const MACRO_FOR_STATUS_LONGJUMP = statusLongJump ? "" : `-DSTATUS_LONGJUMP=0x80000026UL`;
                        executeProcess(make, {
                            args: [
                                "-C",
                                luaJitSrcDir,
                                `SHELL=${cmd}`,
                                `DEFAULT_CC=${envCC}`,
                                `CROSS=${cross}`,
                                `XCFLAGS= ${MACRO_FOR_STATUS_LONGJUMP} ${combinedXcflags.join(' ')} `,
                                "all"
                            ],
                            stdout: defaultStdOutHandler,
                            verbose: true
                        })
                            .then(code => {
                                checkFiles(filesToCheck)
                                    .then(() => {
                                        this.sharedLibrary = _sharedLibrary;
                                        this.interpreter = _interpreter;
                                        stat(_importLibrary)
                                            .then(_implibStat => {
                                                this.importLibrary = _implibStat.isFile() ? _importLibrary : undefined;
                                                resolve();
                                            })
                                            .catch(_implibErr => {
                                                this.importLibrary = undefined;
                                                resolve();
                                            });
                                    })
                                    .catch(reject);
                            })
                            .catch(reject);
                    };
                    const testStatusLongJump: string[] = [
                        "#define WIN32_LEAN_AND_MEAN",
                        "#include <windows.h>",
                        "int main() { DWORD value = STATUS_LONGJUMP; return 0; }"
                    ];
                    const sourceCode = testStatusLongJump.join(EOL);
                    const testFileBasename = "test-status-longjump";
                    mkdtemp(join(this.project.getBuildDir(), testFileBasename + "-"))
                        .then(tmpDir => {
                            const testFile = join(tmpDir, testFileBasename + ".c");
                            writeFile(testFile, sourceCode, { encoding: "utf-8" })
                                .then(() => {
                                    const compiler = this.project.getToolchain().getCompiler();
                                    const testOutputObjectFile = join(tmpDir, testFileBasename + compiler.getObjectFileExtension());
                                    compiler.setInputFile(testFile);
                                    compiler.setOutputFile(testOutputObjectFile);
                                    compiler.execute()
                                        .then(() => {
                                            compiler.reset();
                                            coreBuildForMinGW(true);
                                        })
                                        .catch(testErr => {
                                            compiler.reset();
                                            coreBuildForMinGW(false);
                                        });
                                })
                                .catch(reject);
                        })
                        .catch(reject);
                }
                else {
                    filesToCheck.push(_importLibrary);
                    executeProcess(
                        cmd,
                        {
                            args: ["/C", this.srcInfo.getMsvcBuildBat()],
                            cwd: luaJitSrcDir,
                            verbose: true, 
                            stdout: defaultStdOutHandler,
                        }
                    )
                        .then(code => {
                            checkFiles(filesToCheck)
                                .then(() => {
                                    this.sharedLibrary = _sharedLibrary;
                                    this.interpreter = _interpreter;
                                    this.importLibrary = _importLibrary;
                                    resolve();
                                })
                                .catch(reject);
                        })
                        .catch(reject);
                }
            }
            else {
                const make = ToolchainEnvironmentVariables.instance().getMake();
                const cross = ToolchainEnvironmentVariables.instance().getToolchainPrefix();
                const envCC = ToolchainEnvironmentVariables.instance().getCC();
                const cflags = ToolchainEnvironmentVariables.instance().getCflagsExtra();
                const incDirs = ToolchainEnvironmentVariables.instance().getIncDirsExtra();
                const combinedXcflags: string[] = [];
                for (const flag of cflags) {
                    combinedXcflags.push(`"${flag}"`)
                }
                for (const incDir of incDirs) {
                    combinedXcflags.push(`"-I${incDir}"`)
                }
                const makeArguments: string[] = combinedXcflags.length > 0 ? [
                    "-C",
                    this.srcInfo.getDir(),
                    `PREFIX=${this.project.getInstallDir()}`,
                    `DEFAULT_CC=${envCC}`,
                    `XCFLAGS= ${combinedXcflags.join(' ')} `,
                    `CROSS=${cross}`
                ] :  [
                    "-C",
                    this.srcInfo.getDir(),
                    `PREFIX=${this.project.getInstallDir()}`,
                    `DEFAULT_CC=${envCC}`,
                    `CROSS=${cross}`
                ];

                const furtherProcessing = (macOSXDeploymentTarget?: string) => {
                    if (macOSXDeploymentTarget) {
                        makeArguments.push(`MACOSX_DEPLOYMENT_TARGET=${macOSXDeploymentTarget}`);
                    }
                    const buildTarget = "all";

                    const args: string[] = makeArguments.slice();
                    args.push(buildTarget);

                    executeProcess(make, {
                        args: args,
                        stdout: defaultStdOutHandler,
                        verbose: true
                    })
                        .then(code => {
                            this.rawMake = make;
                            for (const makeArg of makeArguments) {
                                this.rawMakeArguments.push(makeArg);
                            }
                            resolve();
                        })
                        .catch(reject);
                };

                if (process.platform === 'darwin') {
                    this.getMacOSXDeloymentTarget()
                        .then(furtherProcessing)
                        .catch(reject);
                }
                else {
                    furtherProcessing();
                }
            }
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            console.log(`[End] Build ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
}
import { basename, join } from "node:path";
import { stat } from "node:fs/promises";
import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { LuaRocksProject } from "../LuaRocksProject";
import { executeProcess, getFirstLineFromProcessExecution } from "../../../Util/ExecuteProcess";
import { checkFiles } from "../../../Util/CheckFiles";
import { LuaRocksInstallTarget } from "./LuaRocksInstallTarget";
import { LuaRocksWindowsSourcesInfoDetails } from "../Configuration/LuaRocksSourcesInfo";
import { appendToGitHubEnvironmentVariables, appendToGitHubPath } from "../../../Util/GitHub";
import { ToolchainEnvironmentVariables } from "../../../Toolchains/ToolchainEnvironmentVariables";
import { sequentialPromises } from "../../../Util/SequentialPromises";
import { ReadOnlyArray } from "../../../Util/ReadOnlyArray";
import { IReadOnlyArray } from "../../../Util/IReadOnlyArray";
import { LuaRocksPostInstallTarget } from "./LuaRocksPostInstallTarget";
import { defaultStdOutHandler } from "../../../Util/DefaultStdOutHandler";

const LUA_INTERPRETER_CANDIDATES: IReadOnlyArray<string> = new ReadOnlyArray<string>([
    "lua.exe",
    "luajit.exe"
]);

interface EnvVar {
    key: string;
    value: string;
}

export class LuaRocksPreparePostInstallTarget implements ITarget {
    private parent: LuaRocksInstallTarget;
    private project: LuaRocksProject;
    constructor(project: LuaRocksProject, parent: LuaRocksInstallTarget) {
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[Start] Preparing the post install for LuaRocks ${this.project.getVersion().getIdentifier()}`);
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
        return new LuaRocksPostInstallTarget(this.project, this);
    }
    private setEnvironmentVariablesOnGitHub(binDir: string, luarocks: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            sequentialPromises<string>([
                () => getFirstLineFromProcessExecution(luarocks, [ "path", "--lr-bin" ], true),
                () => getFirstLineFromProcessExecution(luarocks, [ "path", "--lr-cpath" ], true),
                () => getFirstLineFromProcessExecution(luarocks, [ "path", "--lr-path" ], true)
            ])
                .then(values => {
                    const lrBin = values[0];
                    const lrCPath = values[1];
                    const lrPath = values[2];

                    sequentialPromises<void>([
                        () => appendToGitHubEnvironmentVariables("LUA_PATH", lrPath),
                        () => appendToGitHubEnvironmentVariables("LUA_CPATH", lrCPath),
                        () => appendToGitHubPath(lrBin),
                        () => appendToGitHubPath(binDir)
                    ])
                        .then(_values => {
                            resolve();
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }
    private setLuaRocksConfig(luarocks: string, key: string, value: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            executeProcess(luarocks, {
                args: [
                    "config",
                    key,
                    value
                ],
                verbose: true,
                stdout: defaultStdOutHandler
            })
                .then(_configSetEnvVar => {
                    resolve();
                })
                .catch(reject);
        });
    }
    private setLuaRocksConfigVariable(luarocks: string, key: string, value: string): Promise<void> {
        return this.setLuaRocksConfig(luarocks, `variables.${key}`, value);
    }
    private setLuaRocksToolchainEnvVars(luarocks: string, toolchainEnvVars: EnvVar[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const iter = (i: number) => {
                if (i < toolchainEnvVars.length) {
                    const envVar = toolchainEnvVars[i];
                    this.setLuaRocksConfigVariable(luarocks, envVar.key, envVar.value)
                        .then(() => {
                            iter(i + 1);
                        })
                        .catch(reject);
                }
                else {
                    resolve();
                }
            };
            iter(0);
        });
    }
    private setLuaRocksConfigSetupOnWindows(luarocks: string, luaVersion: string, installDir: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            sequentialPromises<void>([
                () => this.setLuaRocksConfig(luarocks, "lua_version", luaVersion),
                () => this.setLuaRocksConfig(luarocks, "lua_dir", installDir),
            ])
                .then(_values => {
                    resolve();
                })
                .catch(reject);
        });
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const buildInfo = this.parent.getLuaRocksBuildInfo();
            const srcInfo = buildInfo.getSourcesInfo();
            const infoDetails = srcInfo.getDetails();
            const binDir = this.project.getInstallBinDir();
            if (infoDetails instanceof LuaRocksWindowsSourcesInfoDetails) {
                const installDir = this.project.getInstallDir();
                const luarocks = join(binDir, basename(infoDetails.getLuaRocks()));
                const peParser = infoDetails.getPeParser();
                checkFiles([luarocks])
                    .then(() => {
                        const candidateInterpreter_iter = (idx: number) => {
                            if (idx < LUA_INTERPRETER_CANDIDATES.getLenght()) {
                                const advanceCandidate = (err?: any) => {
                                    candidateInterpreter_iter(idx + 1);
                                };
                                const candidateInterpreterBasename = LUA_INTERPRETER_CANDIDATES.getItem(idx);
                                const interpreter = join(binDir, candidateInterpreterBasename);
                                stat(interpreter)
                                    .then(candidateInterpreterBasenameStat => {
                                        if (candidateInterpreterBasenameStat.isFile()) {
                                            getFirstLineFromProcessExecution(interpreter, ["-e", "print(_VERSION:sub(5))"], true)
                                                .then(luaVersion => {
                                                    if (peParser) { /* run pe-parser only on MinGW / MinGW-w64 toolchains */
                                                        const msvcrtScript: string[] = [
                                                            `local pe = assert(loadfile([[${peParser}]]))();`,
                                                            `local rt, _ = pe.msvcrt([[${interpreter}]]);`,
                                                            `print(rt or [[nil]]);`
                                                        ];
                                                        getFirstLineFromProcessExecution(interpreter, [
                                                            "-e",
                                                            msvcrtScript.join(' ')
                                                        ], true)
                                                            .then(msvcrt => {
                                                                const toolchainEnvVars: EnvVar[] = [
                                                                    { key: "MAKE", value: ToolchainEnvironmentVariables.instance().getMake() },
                                                                    { key: "CC", value: ToolchainEnvironmentVariables.instance().getCC() },
                                                                    { key: "LD", value: ToolchainEnvironmentVariables.instance().getLD() },
                                                                    { key: "AR", value: ToolchainEnvironmentVariables.instance().getAR() },
                                                                    { key: "STRIP", value: ToolchainEnvironmentVariables.instance().getSTRIP() },
                                                                    { key: "RANLIB", value: ToolchainEnvironmentVariables.instance().getRANLIB() },
                                                                    { key: "RC", value: ToolchainEnvironmentVariables.instance().getRC() }
                                                                ];
                                                                sequentialPromises<void>((msvcrt === "nil" || msvcrt === "") ? [
                                                                    () => this.setLuaRocksConfigSetupOnWindows(luarocks, luaVersion, installDir),
                                                                    () => this.setLuaRocksToolchainEnvVars(luarocks, toolchainEnvVars),
                                                                    () => this.setEnvironmentVariablesOnGitHub(binDir, luarocks)
                                                                ] :  [
                                                                    () => this.setLuaRocksConfigSetupOnWindows(luarocks, luaVersion, installDir),
                                                                    () => this.setLuaRocksConfigVariable(luarocks, "MSVCRT", msvcrt),
                                                                    () => this.setLuaRocksToolchainEnvVars(luarocks, toolchainEnvVars),
                                                                    () => this.setEnvironmentVariablesOnGitHub(binDir, luarocks)
                                                                ])
                                                                    .then(_values => {
                                                                        resolve();
                                                                    })
                                                                    .catch(advanceCandidate);
                                                            })
                                                            .catch(advanceCandidate);
                                                    }
                                                    else { /* MSVC / clang-cl */
                                                        if (candidateInterpreterBasename === "luajit.exe") {
                                                            /*
                                                            ** For a LuaJIT build using MSVC,
                                                            ** msvcbuild.bat only supports
                                                            ** cl and link, not clang-cl.
                                                            ** So, environment variables for
                                                            ** different toolchains are not set.
                                                            */
                                                            sequentialPromises<void>([
                                                                () => this.setLuaRocksConfigSetupOnWindows(luarocks, luaVersion, installDir),
                                                                () => this.setEnvironmentVariablesOnGitHub(binDir, luarocks)
                                                            ])
                                                                .then(_values => {
                                                                    resolve();
                                                                })
                                                                .catch(advanceCandidate);
                                                        }
                                                        else {
                                                            const toolchainEnvVars: EnvVar[] = [
                                                                { key: "MAKE", value: ToolchainEnvironmentVariables.instance().getMake() },
                                                                { key: "CC", value: ToolchainEnvironmentVariables.instance().getCC() },
                                                                { key: "LD", value: ToolchainEnvironmentVariables.instance().getLD() },
                                                                { key: "AR", value: ToolchainEnvironmentVariables.instance().getAR() }
                                                            ];
                                                            sequentialPromises<void>([
                                                                () => this.setLuaRocksConfigSetupOnWindows(luarocks, luaVersion, installDir),
                                                                () => this.setLuaRocksToolchainEnvVars(luarocks, toolchainEnvVars),
                                                                () => this.setEnvironmentVariablesOnGitHub(binDir, luarocks)
                                                            ])
                                                                .then(_values => {
                                                                    resolve();
                                                                })
                                                                .catch(advanceCandidate);
                                                        }
                                                    }
                                                })
                                                .catch(advanceCandidate);
                                        }
                                        else {
                                            advanceCandidate();
                                        }
                                    })
                                    .catch(advanceCandidate);
                            }
                            else {
                                reject(new Error("Unable to find a working Lua interpreter to setup LuaRocks"));
                            }
                        };

                        candidateInterpreter_iter(0);
                    })
                    .catch(reject);
            }
            else {
                const luarocks = join(binDir, "luarocks");
                const toolchainEnvVars: EnvVar[] = [
                    { key: "MAKE", value: ToolchainEnvironmentVariables.instance().getMake() },
                    { key: "CC", value: ToolchainEnvironmentVariables.instance().getCC() },
                    { key: "LD", value: ToolchainEnvironmentVariables.instance().getLD() },
                    { key: "AR", value: ToolchainEnvironmentVariables.instance().getAR() },
                    { key: "STRIP", value: ToolchainEnvironmentVariables.instance().getSTRIP() },
                    { key: "RANLIB", value: ToolchainEnvironmentVariables.instance().getRANLIB() }
                ];
                sequentialPromises<void>([
                    () => this.setLuaRocksToolchainEnvVars(luarocks, toolchainEnvVars),
                    () => this.setEnvironmentVariablesOnGitHub(binDir, luarocks)
                ])
                    .then(_values => {
                        resolve();
                    })
                    .catch(reject);
            }
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[End] Preparing the post install for LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 2202:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CacheService = void 0;
const CliCacheService_1 = __nccwpck_require__(1652);
exports.CacheService = CliCacheService_1.CliCacheService;


/***/ }),

/***/ 1652:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CliCacheService = void 0;
const promises_1 = __nccwpck_require__(1455);
const node_path_1 = __nccwpck_require__(6760);
const node_os_1 = __nccwpck_require__(8161);
class CliCacheService {
    static instance() {
        if (!CliCacheService._instance) {
            CliCacheService._instance = new CliCacheService();
        }
        return CliCacheService._instance;
    }
    getCacheDirName() {
        return "setup-lua-cache";
    }
    getConfigHomeDir() {
        const configHomeEnvVar = process.platform === 'win32' ? "LOCALAPPDATA" : "XDG_CACHE_HOME";
        return (process.env[configHomeEnvVar] || "").trim();
    }
    useCache() {
        let result = true;
        const useCacheEnvVar = process.env['USE_CACHE'];
        if (useCacheEnvVar === undefined ||
            useCacheEnvVar === "" ||
            useCacheEnvVar === "true" ||
            useCacheEnvVar === "True" ||
            useCacheEnvVar === "TRUE" ||
            useCacheEnvVar === "1" ||
            useCacheEnvVar === "on" ||
            useCacheEnvVar === "ON" ||
            useCacheEnvVar === "y" ||
            useCacheEnvVar === "Y" ||
            useCacheEnvVar === "yes" ||
            useCacheEnvVar === "Yes" ||
            useCacheEnvVar === "YES") {
            /* do nothing */
        }
        else if (useCacheEnvVar === "false" ||
            useCacheEnvVar === "False" ||
            useCacheEnvVar === "FALSE" ||
            useCacheEnvVar === "0" ||
            useCacheEnvVar === "off" ||
            useCacheEnvVar === "Off" ||
            useCacheEnvVar === "OFF" ||
            useCacheEnvVar === "n" ||
            useCacheEnvVar === "N" ||
            useCacheEnvVar === "no" ||
            useCacheEnvVar === "No" ||
            useCacheEnvVar === "NO") {
            result = false;
        }
        return result;
    }
    getCacheDirectory(key) {
        return new Promise((resolve, reject) => {
            const baseDirs = [
                this.getConfigHomeDir(),
                (0, node_path_1.join)((0, node_os_1.homedir)(), ".cache")
            ];
            const dir_iter = (i) => {
                if (i < baseDirs.length) {
                    const dir = baseDirs[i];
                    if (dir) {
                        (0, promises_1.stat)(dir)
                            .then(baseDirStat => {
                            const setupLuaDir = (0, node_path_1.join)(dir, this.getCacheDirName());
                            const furtherProcessing = () => {
                                const keyDir = (0, node_path_1.join)(setupLuaDir, key);
                                (0, promises_1.stat)(keyDir)
                                    .then(keyDirStat => {
                                    if (keyDirStat.isDirectory()) {
                                        resolve(keyDir);
                                    }
                                    else {
                                        dir_iter(i + 1);
                                    }
                                })
                                    .catch(keyDirStatErr => {
                                    if (keyDirStatErr.code === "ENOENT") {
                                        (0, promises_1.mkdir)(keyDir)
                                            .then(() => {
                                            resolve(keyDir);
                                        })
                                            .catch(keyDirMkdirErr => {
                                            dir_iter(i + 1);
                                        });
                                    }
                                    else {
                                        dir_iter(i + 1);
                                    }
                                });
                            };
                            (0, promises_1.stat)(setupLuaDir)
                                .then(setupLuaDirStat => {
                                if (setupLuaDirStat.isDirectory()) {
                                    furtherProcessing();
                                }
                                else {
                                    dir_iter(i + 1);
                                }
                            })
                                .catch(setupLuaDirStatErr => {
                                if (setupLuaDirStatErr.code === "ENOENT") {
                                    (0, promises_1.mkdir)(setupLuaDir)
                                        .then(() => {
                                        furtherProcessing();
                                    })
                                        .catch(setupLuaDirMkdirErr => {
                                        dir_iter(i + 1);
                                    });
                                }
                                else {
                                    dir_iter(i + 1);
                                }
                            });
                        })
                            .catch(baseDirStatErr => {
                            dir_iter(i + 1);
                        });
                    }
                    else {
                        dir_iter(i + 1);
                    }
                }
                else {
                    reject(new Error("Unable to find a directory to store cache files"));
                }
            };
            dir_iter(0);
        });
    }
    save(path, key) {
        return new Promise((resolve, reject) => {
            this.getCacheDirectory(key)
                .then(cacheDir => {
                const cachedFile = (0, node_path_1.join)(cacheDir, (0, node_path_1.basename)(path));
                (0, promises_1.cp)(path, cachedFile, { force: true })
                    .then(resolve)
                    .catch(cpErr => {
                    reject(new Error("Failed to copy the download file to the proper cache location"));
                });
            })
                .catch(reject);
        });
    }
    restore(path, primaryKey) {
        return new Promise((resolve, reject) => {
            this.getCacheDirectory(primaryKey)
                .then(cacheDir => {
                const cachedFile = (0, node_path_1.join)(cacheDir, (0, node_path_1.basename)(path));
                (0, promises_1.cp)(cachedFile, path, { force: true })
                    .then(resolve)
                    .catch(cpErr => {
                    reject(new Error("Failed to copy the cached file to the proper location"));
                });
            })
                .catch(reject);
        });
    }
    constructor() {
    }
}
exports.CliCacheService = CliCacheService;


/***/ }),

/***/ 3436:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CliConsole = void 0;
class CliConsole {
    static instance() {
        if (!CliConsole._instance) {
            CliConsole._instance = new CliConsole();
        }
        return CliConsole._instance;
    }
    write(message) {
        process.stdout.write(message);
    }
    writeLine(message) {
        console.log(message);
    }
    constructor() {
    }
}
exports.CliConsole = CliConsole;


/***/ }),

/***/ 6825:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CliGitHubCore = void 0;
const promises_1 = __nccwpck_require__(1455);
const node_os_1 = __nccwpck_require__(8161);
const node_path_1 = __nccwpck_require__(6760);
function appendContentToGitHubFile(fileKey, content) {
    return new Promise((resolve, reject) => {
        const githubSpecialFile = process.env[fileKey];
        if (githubSpecialFile) {
            (0, promises_1.stat)(githubSpecialFile)
                .then(fileStat => {
                if (fileStat.isFile()) {
                    const newline = node_os_1.EOL;
                    (0, promises_1.appendFile)(githubSpecialFile, `${newline}${content}`, { flush: true })
                        .then(resolve)
                        .catch(reject);
                }
                else {
                    reject(new Error(`\`${githubSpecialFile}' is not a file`));
                }
            })
                .catch(reject);
        }
        else {
            resolve();
        }
    });
}
function appendKeyValueToGitHubFile(fileKey, key, value) {
    return appendContentToGitHubFile(fileKey, `${key.toUpperCase().replace(/\-/g, "_").replace(/\r\n|\r|\n/g, "")}=${value.replace(/\r\n|\r|\n/g, "")}`);
}
class CliGitHubCore {
    static instance() {
        if (!CliGitHubCore._instance) {
            CliGitHubCore._instance = new CliGitHubCore();
        }
        return CliGitHubCore._instance;
    }
    getInput(variable) {
        return process.env[`INPUT_${variable.replace(/ /g, "_").toUpperCase()}`];
    }
    appendToGitHubEnvironmentVariables(key, value) {
        return key.toUpperCase() === "PATH" ? this.appendToGitHubPath(value) : appendKeyValueToGitHubFile("GITHUB_ENV", key, value);
    }
    appendToGitHubPath(value) {
        return new Promise((resolve, reject) => {
            const githubPath = process.env["GITHUB_PATH"];
            if (githubPath) {
                (0, promises_1.stat)(githubPath)
                    .then(fileStat => {
                    if (fileStat.isFile()) {
                        const safeValue = value.replace(/\r\n|\r|\n/g, "");
                        const parts = safeValue.split(node_path_1.delimiter).filter(v => v !== "");
                        const newline = node_os_1.EOL;
                        const content = parts.reverse().join(newline);
                        (0, promises_1.appendFile)(githubPath, `${newline}${content}`)
                            .then(resolve)
                            .catch(reject);
                    }
                    else {
                        reject(new Error(`\`${githubPath}' is not a file`));
                    }
                })
                    .catch(reject);
            }
            else {
                resolve();
            }
        });
    }
    constructor() {
    }
}
exports.CliGitHubCore = CliGitHubCore;


/***/ }),

/***/ 946:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Console = void 0;
const CliConsole_1 = __nccwpck_require__(3436);
exports.Console = CliConsole_1.CliConsole;


/***/ }),

/***/ 7787:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitHubCore = void 0;
const CliGitHubCore_1 = __nccwpck_require__(6825);
exports.GitHubCore = CliGitHubCore_1.CliGitHubCore;


/***/ }),

/***/ 9609:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaJitBuildTarget = void 0;
const promises_1 = __nccwpck_require__(1455);
const node_path_1 = __nccwpck_require__(6760);
const node_os_1 = __nccwpck_require__(8161);
const IGccLikeToolchain_1 = __nccwpck_require__(9372);
const ExecuteProcess_1 = __nccwpck_require__(6522);
const CheckFiles_1 = __nccwpck_require__(8105);
const LuaJitCreatePkgConfigTarget_1 = __nccwpck_require__(2713);
const ReadOnlyArray_1 = __nccwpck_require__(2483);
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
const CompareVersions_1 = __nccwpck_require__(7654);
const GitHubInput_1 = __nccwpck_require__(1621);
const DefaultStdOutHandler_1 = __nccwpck_require__(840);
const Console_1 = __nccwpck_require__(946);
class LuaJitBuildTarget {
    constructor(project, parent, sourceInfo) {
        this.project = project;
        this.parent = parent;
        this.srcInfo = sourceInfo;
        this.sharedLibrary = undefined;
        this.interpreter = undefined;
        this.importLibrary = undefined;
        this.rawMake = undefined;
        this.rawMakeArguments = [];
    }
    init() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[Start] Build ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getSourcesInfo() {
        return this.srcInfo;
    }
    getSharedLibrary() {
        return this.sharedLibrary;
    }
    getInterpreter() {
        return this.interpreter;
    }
    getImportLibrary() {
        return this.importLibrary;
    }
    getUnixMake() {
        return this.rawMake;
    }
    getUnixMakeArguments() {
        return new ReadOnlyArray_1.ReadOnlyArray(this.rawMakeArguments);
    }
    getNext() {
        return new LuaJitCreatePkgConfigTarget_1.LuaJitCreatePkgConfigTarget(this.project, this);
    }
    parseMacOSXDeploymentTarget(deploymentTarget) {
        const version = [];
        const swMatch = /^(\d+)\.(\d+)(\.(\d+))?$/.exec(deploymentTarget);
        if (swMatch) {
            const major = Number(swMatch[1]);
            const minor = Number(swMatch[2]);
            const patch = Number(swMatch[4] || "0");
            if ((0, CompareVersions_1.compareVersions)([major, minor, patch], [11, 0]) >= 0) {
                version.push(11);
                version.push(0);
            }
            else if ((0, CompareVersions_1.compareVersions)([major, minor, patch], [10, 10]) >= 0) {
                version.push(10);
                version.push(8);
            }
            else if ((0, CompareVersions_1.compareVersions)([major, minor, patch], [10, 5]) >= 0) {
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
    getMacOSXDeloymentTarget() {
        return new Promise((resolve, reject) => {
            let deploymentTarget = (GitHubInput_1.GitHubInput.instance().getInputMacOSXDeploymentTarget() || process.env["MACOSX_DEPLOYMENT_TARGET"] || "").trim();
            if (deploymentTarget) {
                resolve(this.parseMacOSXDeploymentTarget(deploymentTarget));
            }
            else {
                (0, ExecuteProcess_1.getStdOutFromProcessExecution)("sw_vers", {
                    args: ["-productVersion"],
                    verbose: true
                })
                    .then(result => {
                    if (result.lines.length > 0) {
                        deploymentTarget = result.lines[0];
                        resolve(this.parseMacOSXDeploymentTarget(deploymentTarget));
                    }
                    else {
                        reject(new Error("Internal error: Unable to set MACOSX_DEPLOYMENT_TARGET"));
                    }
                })
                    .catch(reject);
            }
        });
    }
    execute() {
        return new Promise((resolve, reject) => {
            this.sharedLibrary = undefined;
            this.interpreter = undefined;
            this.importLibrary = undefined;
            this.rawMake = undefined;
            this.rawMakeArguments.splice(0, this.rawMakeArguments.length);
            if (process.platform === 'win32') {
                const toolchain = this.project.getToolchain();
                const luaJitSrcDir = this.srcInfo.getSrcDir();
                const luaJitVersion = this.srcInfo.getVersion();
                const isGccLike = (0, IGccLikeToolchain_1.isGccLikeToolchain)(toolchain);
                const _sharedLibrary = (0, node_path_1.join)(luaJitSrcDir, "lua51.dll");
                const _interpreter = (0, node_path_1.join)(luaJitSrcDir, "luajit.exe");
                const _importLibrary = (0, node_path_1.join)(luaJitSrcDir, isGccLike ?
                    `libluajit-${luaJitVersion.getABI()}.dll.a` :
                    "lua51.lib");
                const filesToCheck = [
                    _sharedLibrary,
                    _interpreter
                ];
                const cmd = (process.env["COMSPEC"] || "cmd").trim();
                if (isGccLike) {
                    const make = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getMake();
                    const cross = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getToolchainPrefix();
                    const envCC = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getRawCC();
                    const cflags = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getCflagsExtra();
                    const incDirs = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getIncDirsExtra();
                    const combinedXcflags = [];
                    for (const flag of cflags) {
                        combinedXcflags.push(`"${flag}"`);
                    }
                    for (const incDir of incDirs) {
                        combinedXcflags.push(`"-I${incDir}"`);
                    }
                    const coreBuildForMinGW = (statusLongJump) => {
                        const MACRO_FOR_STATUS_LONGJUMP = statusLongJump ? "" : `-DSTATUS_LONGJUMP=0x80000026UL`;
                        (0, ExecuteProcess_1.executeProcess)(make, {
                            args: [
                                "-C",
                                luaJitSrcDir,
                                `SHELL=${cmd}`,
                                `DEFAULT_CC=${envCC}`,
                                `CROSS=${cross}`,
                                `XCFLAGS= ${MACRO_FOR_STATUS_LONGJUMP} ${combinedXcflags.join(' ')} `,
                                "all"
                            ],
                            stdout: DefaultStdOutHandler_1.defaultStdOutHandler,
                            verbose: true
                        })
                            .then(code => {
                            (0, CheckFiles_1.checkFiles)(filesToCheck)
                                .then(() => {
                                this.sharedLibrary = _sharedLibrary;
                                this.interpreter = _interpreter;
                                (0, promises_1.stat)(_importLibrary)
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
                    const testStatusLongJump = [
                        "#define WIN32_LEAN_AND_MEAN",
                        "#include <windows.h>",
                        "int main() { DWORD value = STATUS_LONGJUMP; return 0; }"
                    ];
                    const sourceCode = testStatusLongJump.join(node_os_1.EOL);
                    const testFileBasename = "test-status-longjump";
                    (0, promises_1.mkdtemp)((0, node_path_1.join)(this.project.getBuildDir(), testFileBasename + "-"))
                        .then(tmpDir => {
                        const testFile = (0, node_path_1.join)(tmpDir, testFileBasename + ".c");
                        (0, promises_1.writeFile)(testFile, sourceCode, { encoding: "utf-8" })
                            .then(() => {
                            const compiler = this.project.getToolchain().getCompiler();
                            const testOutputObjectFile = (0, node_path_1.join)(tmpDir, testFileBasename + compiler.getObjectFileExtension());
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
                    (0, ExecuteProcess_1.executeProcess)(cmd, {
                        args: ["/C", this.srcInfo.getMsvcBuildBat()],
                        cwd: luaJitSrcDir,
                        verbose: true,
                        stdout: DefaultStdOutHandler_1.defaultStdOutHandler,
                    })
                        .then(code => {
                        (0, CheckFiles_1.checkFiles)(filesToCheck)
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
                const make = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getMake();
                const cross = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getToolchainPrefix();
                const envCC = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getCC();
                const cflags = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getCflagsExtra();
                const incDirs = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getIncDirsExtra();
                const combinedXcflags = [];
                for (const flag of cflags) {
                    combinedXcflags.push(`"${flag}"`);
                }
                for (const incDir of incDirs) {
                    combinedXcflags.push(`"-I${incDir}"`);
                }
                const makeArguments = combinedXcflags.length > 0 ? [
                    "-C",
                    this.srcInfo.getDir(),
                    `PREFIX=${this.project.getInstallDir()}`,
                    `DEFAULT_CC=${envCC}`,
                    `XCFLAGS= ${combinedXcflags.join(' ')} `,
                    `CROSS=${cross}`
                ] : [
                    "-C",
                    this.srcInfo.getDir(),
                    `PREFIX=${this.project.getInstallDir()}`,
                    `DEFAULT_CC=${envCC}`,
                    `CROSS=${cross}`
                ];
                const furtherProcessing = (macOSXDeploymentTarget) => {
                    if (macOSXDeploymentTarget) {
                        makeArguments.push(`MACOSX_DEPLOYMENT_TARGET=${macOSXDeploymentTarget}`);
                    }
                    const buildTarget = "all";
                    const args = makeArguments.slice();
                    args.push(buildTarget);
                    (0, ExecuteProcess_1.executeProcess)(make, {
                        args: args,
                        stdout: DefaultStdOutHandler_1.defaultStdOutHandler,
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
    finalize() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[End] Build ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
}
exports.LuaJitBuildTarget = LuaJitBuildTarget;


/***/ }),

/***/ 2713:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaJitCreatePkgConfigTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const promises_1 = __nccwpck_require__(1455);
const LuaJitWindowsBuildInfo_1 = __nccwpck_require__(2009);
const IWin32ImportLibraryDecorator_1 = __nccwpck_require__(8073);
const LuaJitFinishBuildingTarget_1 = __nccwpck_require__(9440);
const LuaJitUnixBuildInfo_1 = __nccwpck_require__(7834);
const Console_1 = __nccwpck_require__(946);
class LuaJitCreatePkgConfigTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[Start] Create pkgconfig file for ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getSourcesInfo() {
        return this.parent.getSourcesInfo();
    }
    getNext() {
        return new LuaJitFinishBuildingTarget_1.LuaJitFinishBuildingTarget(this.project, this);
    }
    setWindowsBuildResult() {
        this.project.buildResult().setValue(new LuaJitWindowsBuildInfo_1.LuaJitWindowsBuildInfo(this.parent.getSourcesInfo(), this.parent.getSharedLibrary(), this.parent.getInterpreter(), this.pkgConfig, this.parent.getImportLibrary()));
    }
    setUnixBuildResult() {
        this.project.buildResult().setValue(new LuaJitUnixBuildInfo_1.LuaJitUnixBuildInfo(this.parent.getUnixMake(), this.parent.getUnixMakeArguments().createCopy()));
    }
    execute() {
        return new Promise((resolve, reject) => {
            if (process.platform === 'win32') {
                const sharedLibrary = this.parent.getSharedLibrary();
                if (sharedLibrary) {
                    const interpreter = this.parent.getInterpreter();
                    if (interpreter) {
                        const furtherProcessing = (libname) => {
                            const srcInfo = this.parent.getSourcesInfo();
                            const version = srcInfo.getVersion();
                            const lines = [];
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
                            lines.push(`libname=${libname !== null && libname !== void 0 ? libname : (0, node_path_1.basename)(sharedLibrary, (0, node_path_1.extname)(sharedLibrary))}`);
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
                            const pkgConfigFileName = (0, node_path_1.join)(this.project.getBuildDir(), `luajit.pc`);
                            (0, promises_1.writeFile)(pkgConfigFileName, lines.join("\n"), { encoding: "utf8" })
                                .then(() => {
                                this.pkgConfig = pkgConfigFileName;
                                this.setWindowsBuildResult();
                                resolve();
                            })
                                .catch(reject);
                        };
                        const importLibrary = this.parent.getImportLibrary();
                        if (importLibrary) {
                            let libname = (0, node_path_1.basename)(importLibrary);
                            if (libname.startsWith("lib")) {
                                libname = libname.substring(3);
                            }
                            const toolchain = this.project.getToolchain();
                            const linker = toolchain.getLinker();
                            if ((0, IWin32ImportLibraryDecorator_1.hasWin32ImportLibraryDecorator)(linker)) {
                                const win32Linker = linker;
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
    finalize() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[End] Create pkgconfig file for ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
}
exports.LuaJitCreatePkgConfigTarget = LuaJitCreatePkgConfigTarget;


/***/ }),

/***/ 9440:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaJitFinishBuildingTarget = void 0;
const Console_1 = __nccwpck_require__(946);
class LuaJitFinishBuildingTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[Start] Finish the build of ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getNext() {
        return null;
    }
    execute() {
        return new Promise((resolve, reject) => {
            if (process.platform === "win32") {
                const buildInfo = this.project.buildResult().getValue();
                Console_1.Console.instance().writeLine(`Shared Library: ${buildInfo.getSharedLibrary()}`);
                Console_1.Console.instance().writeLine(`Interpreter: ${buildInfo.getInterpreter()}`);
                Console_1.Console.instance().writeLine(`PkgConfig: ${buildInfo.getPkgConfigFile()}`);
                Console_1.Console.instance().writeLine(`Import Library: ${buildInfo.getImportLibrary()}`);
            }
            resolve();
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[End] Finish the build of ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
}
exports.LuaJitFinishBuildingTarget = LuaJitFinishBuildingTarget;


/***/ }),

/***/ 7834:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaJitUnixBuildInfo = void 0;
const ReadOnlyArray_1 = __nccwpck_require__(2483);
class LuaJitUnixBuildInfo {
    constructor(make, makeArguments) {
        this.make = make;
        this.makeArguments = new ReadOnlyArray_1.ReadOnlyArray(makeArguments);
    }
    getMake() {
        return this.make;
    }
    getMakeArguments() {
        return this.makeArguments;
    }
}
exports.LuaJitUnixBuildInfo = LuaJitUnixBuildInfo;


/***/ }),

/***/ 2009:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaJitWindowsBuildInfo = void 0;
class LuaJitWindowsBuildInfo {
    constructor(sourcesInfo, sharedLibrary, interpreter, pkgConfigFile, importLibrary) {
        this.sourcesInfo = sourcesInfo;
        this.sharedLibrary = sharedLibrary;
        this.interpreter = interpreter;
        this.pkgConfigFile = pkgConfigFile;
        this.importLibrary = importLibrary;
    }
    getSourcesInfo() {
        return this.sourcesInfo;
    }
    getSharedLibrary() {
        return this.sharedLibrary;
    }
    getInterpreter() {
        return this.interpreter;
    }
    getPkgConfigFile() {
        return this.pkgConfigFile;
    }
    getImportLibrary() {
        return this.importLibrary;
    }
}
exports.LuaJitWindowsBuildInfo = LuaJitWindowsBuildInfo;


/***/ }),

/***/ 913:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaJitApplyPatchesTarget = void 0;
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
const AbstractApplyPatchesTarget_1 = __nccwpck_require__(3714);
const LuaJitConfigureSourcesTarget_1 = __nccwpck_require__(5605);
const Console_1 = __nccwpck_require__(946);
class LuaJitApplyPatchesTarget extends AbstractApplyPatchesTarget_1.AbstractApplyPatchesTarget {
    constructor(project, parent) {
        super(project, parent, parent.getExtractedDir(), project.getRemotePatchesBuildDir(), ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLuaPatches());
    }
    init() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.getProject().getVersion();
            Console_1.Console.instance().writeLine(`[Start] Apply patches on ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getNext() {
        return new LuaJitConfigureSourcesTarget_1.LuaJitConfigureSourcesTarget(this.getProject(), this);
    }
    finalize() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.getProject().getVersion();
            Console_1.Console.instance().writeLine(`[End] Apply patches on ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
}
exports.LuaJitApplyPatchesTarget = LuaJitApplyPatchesTarget;


/***/ }),

/***/ 5605:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaJitConfigureSourcesTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const node_fs_1 = __nccwpck_require__(3024);
const promises_1 = __nccwpck_require__(6848);
const promises_2 = __nccwpck_require__(1455);
const LuaJitSourcesInfo_1 = __nccwpck_require__(5386);
const LuaJitVersion_1 = __nccwpck_require__(8477);
const LuaJitRepositoryVersion_1 = __nccwpck_require__(1721);
const LuaJitFinishConfigurationTarget_1 = __nccwpck_require__(2470);
const CheckFiles_1 = __nccwpck_require__(8105);
const Console_1 = __nccwpck_require__(946);
class LuaJitConfigureSourcesTarget {
    constructor(project, parent) {
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
    init() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[Start] Configure source code for ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new LuaJitFinishConfigurationTarget_1.LuaJitFinishConfigurationTarget(this.project, this);
    }
    setConfigurationResult() {
        const projectVersion = this.project.getVersion();
        let luaJitVersion;
        if (projectVersion instanceof LuaJitRepositoryVersion_1.LuaJitRepositoryVersion) {
            luaJitVersion = new LuaJitVersion_1.LuaJitVersion(this.majorVer, this.minorVer, this.releaseVer, this.abiVer);
        }
        else if (projectVersion instanceof LuaJitRepositoryVersion_1.OpenRestyRepositoryVersion) {
            luaJitVersion = new LuaJitVersion_1.OpenRestyVersion(this.majorVer, this.minorVer, this.releaseVer, this.abiVer);
        }
        else {
            throw new Error("Unknown LuaJIT repository version");
        }
        this.project.configurationResult().setValue(new LuaJitSourcesInfo_1.LuaJitSourcesInfo(this.parent.getDirectory(), this.srcDir, luaJitVersion, this.unixMakefile, this.mingwMakefile, this.msvcBuildBat, this.delayedHeaderFile, this.rawHeaderFiles, this.rawManFiles, this.rawJitFiles));
    }
    execute() {
        return new Promise((resolve, reject) => {
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
            const _unixMakeFile = (0, node_path_1.join)(extractedDir, "Makefile");
            const _srcDir = (0, node_path_1.join)(extractedDir, "src");
            const _etcDir = (0, node_path_1.join)(extractedDir, "etc");
            const _jitDir = (0, node_path_1.join)(_srcDir, "jit");
            const _pkgConfigFile = (0, node_path_1.join)(_etcDir, "luajit.pc");
            const _msvcBuildBat = (0, node_path_1.join)(_srcDir, "msvcbuild.bat");
            const _mingwMakeFile = (0, node_path_1.join)(_srcDir, "Makefile");
            const _delayedHeaderFile = (0, node_path_1.join)(_srcDir, "luajit.h");
            const targetHeaders = [
                /*
                * the delayed header file above (luajit.h)
                * appears in the build phase
                 */
                (0, node_path_1.join)(_srcDir, "lua.h"),
                (0, node_path_1.join)(_srcDir, "lua.hpp"),
                (0, node_path_1.join)(_srcDir, "luaconf.h"),
                (0, node_path_1.join)(_srcDir, "lauxlib.h"),
                (0, node_path_1.join)(_srcDir, "lualib.h")
            ];
            const targetManFiles = [
                (0, node_path_1.join)(_etcDir, "luajit.1")
            ];
            (0, CheckFiles_1.checkFiles)(targetHeaders)
                .then(() => {
                for (const header of targetHeaders) {
                    this.rawHeaderFiles.push(header);
                }
                (0, CheckFiles_1.checkFiles)(targetManFiles)
                    .then(() => {
                    for (const manFile of targetManFiles) {
                        this.rawManFiles.push(manFile);
                    }
                    let dotrelverContent;
                    const furtherProcessing = () => {
                        (0, CheckFiles_1.checkFiles)([
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
                            const rl_pkgconfig = (0, promises_1.createInterface)({
                                input: (0, node_fs_1.createReadStream)(_pkgConfigFile),
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
                                    (0, promises_2.readdir)(_jitDir)
                                        .then(jitFiles => {
                                        const jitfiles_iter = (j) => {
                                            if (j < jitFiles.length) {
                                                const jf_path = (0, node_path_1.join)(_jitDir, jitFiles[j]);
                                                (0, promises_2.stat)(jf_path)
                                                    .then(jf_s => {
                                                    if (jf_s.isFile()) {
                                                        const ext = (0, node_path_1.extname)(jf_path);
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
                    const topLevelRelVer = (0, node_path_1.join)(extractedDir, ".relver");
                    (0, promises_2.readFile)(topLevelRelVer, { encoding: "utf-8" })
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
    finalize() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[End] Configure source code for ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
}
exports.LuaJitConfigureSourcesTarget = LuaJitConfigureSourcesTarget;


/***/ }),

/***/ 6456:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaJitCreateBuildDirectoriesTarget = void 0;
const AbstractCreateDirectoriesTarget_1 = __nccwpck_require__(6763);
const LuaJitFetchTarget_1 = __nccwpck_require__(5817);
const Console_1 = __nccwpck_require__(946);
class LuaJitCreateBuildDirectoriesTarget extends AbstractCreateDirectoriesTarget_1.AbstractCreateDirectoriesTarget {
    constructor(project, parent) {
        super([
            project.getBuildDir(),
            project.getRemotePatchesBuildDir()
        ]);
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[Start] Create build directories for ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new LuaJitFetchTarget_1.LuaJitFetchTarget(this.project, this);
    }
    finalize() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[End] Create build directories for ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
}
exports.LuaJitCreateBuildDirectoriesTarget = LuaJitCreateBuildDirectoriesTarget;


/***/ }),

/***/ 5817:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaJitFetchTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const promises_1 = __nccwpck_require__(1455);
const AbstractFetchTarballTarget_1 = __nccwpck_require__(1299);
const LuaJitRepositoryVersion_1 = __nccwpck_require__(1721);
const LuaJitApplyPatchesTarget_1 = __nccwpck_require__(913);
const Console_1 = __nccwpck_require__(946);
class LuaJitFetchTarget extends AbstractFetchTarballTarget_1.AbstractFetchTarballTarget {
    constructor(project, parent) {
        super(`${project.getVersion().getRepository()}/archive/${project.getVersion().getRef()}.tar.gz`, project.getBuildDir(), null);
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[Start] Fetch ${projectVersion.getName()} ${projectVersion.getRef()} source code`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getExtractedDir() {
        return (this.extractedDir);
    }
    execute() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            super.execute()
                .then(() => {
                const workDir = this.getWorkDir();
                (0, promises_1.readdir)(workDir, { recursive: false })
                    .then(items => {
                    const len = items.length;
                    const dirItem_iter = (i) => {
                        if (i < len) {
                            const dirItem = items[i];
                            if ((projectVersion instanceof LuaJitRepositoryVersion_1.LuaJitRepositoryVersion && dirItem.startsWith("LuaJIT-"))
                                ||
                                    (projectVersion instanceof LuaJitRepositoryVersion_1.OpenRestyRepositoryVersion && dirItem.startsWith("luajit2-"))) {
                                const dirItemFullPath = (0, node_path_1.join)(workDir, dirItem);
                                (0, promises_1.stat)(dirItemFullPath)
                                    .then(s => {
                                    if (s.isDirectory()) {
                                        this.extractedDir = dirItemFullPath;
                                        resolve();
                                    }
                                    else {
                                        dirItem_iter(i + 1);
                                    }
                                })
                                    .catch(reject);
                            }
                            else {
                                dirItem_iter(i + 1);
                            }
                        }
                        else {
                            reject(new Error(`Extracted directory for ${projectVersion.getName()} ${projectVersion.getRef()} was not found`));
                        }
                    };
                    dirItem_iter(0);
                })
                    .catch(reject);
            })
                .catch(reject);
        });
    }
    getNext() {
        return new LuaJitApplyPatchesTarget_1.LuaJitApplyPatchesTarget(this.project, this);
    }
    finalize() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[End] Fetch ${projectVersion.getName()} ${projectVersion.getRef()} source code`);
            resolve();
        });
    }
}
exports.LuaJitFetchTarget = LuaJitFetchTarget;


/***/ }),

/***/ 2470:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaJitFinishConfigurationTarget = void 0;
const Console_1 = __nccwpck_require__(946);
class LuaJitFinishConfigurationTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[Start] Finish ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getNext() {
        return null;
    }
    execute() {
        return new Promise((resolve, reject) => {
            const srcInfo = (this.project.configurationResult().getValue());
            let len = 0;
            Console_1.Console.instance().writeLine(`[Delayed Header] ${srcInfo.getDelayedHeaderFile()}`);
            const headerFiles = srcInfo.getHeaderFiles();
            len = headerFiles.getLenght();
            for (let i = 0; i < len; i++) {
                Console_1.Console.instance().writeLine(`[Header] ${headerFiles.getItem(i)}`);
            }
            const jitFiles = srcInfo.getJitFiles();
            len = jitFiles.getLenght();
            for (let i = 0; i < len; i++) {
                Console_1.Console.instance().writeLine(`[JIT] ${jitFiles.getItem(i)}`);
            }
            const manFiles = srcInfo.getManFiles();
            len = manFiles.getLenght();
            for (let i = 0; i < len; i++) {
                Console_1.Console.instance().writeLine(`[MAN] ${manFiles.getItem(i)}`);
            }
            resolve();
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[End] Finish ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
}
exports.LuaJitFinishConfigurationTarget = LuaJitFinishConfigurationTarget;


/***/ }),

/***/ 5386:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaJitSourcesInfo = void 0;
const ReadOnlyArray_1 = __nccwpck_require__(2483);
class LuaJitSourcesInfo {
    constructor(dir, srcDir, version, unixMakefile, mingwMakefile, msvcBuildBat, delayedHeaderFile, headerFiles, manFiles, jitFiles) {
        this.dir = dir;
        this.srcDir = srcDir;
        this.version = version;
        this.unixMakefile = unixMakefile;
        this.mingwMakefile = mingwMakefile;
        this.msvcBuildBat = msvcBuildBat;
        this.delayedHeaderFile = delayedHeaderFile;
        this.headerFiles = new ReadOnlyArray_1.ReadOnlyArray(headerFiles);
        this.manFiles = new ReadOnlyArray_1.ReadOnlyArray(manFiles);
        this.jitFiles = new ReadOnlyArray_1.ReadOnlyArray(jitFiles);
    }
    getDir() {
        return this.dir;
    }
    getSrcDir() {
        return this.srcDir;
    }
    getVersion() {
        return this.version;
    }
    getUnixMakefile() {
        return this.unixMakefile;
    }
    getMingwMakefile() {
        return this.mingwMakefile;
    }
    getMsvcBuildBat() {
        return this.msvcBuildBat;
    }
    getDelayedHeaderFile() {
        return this.delayedHeaderFile;
    }
    getHeaderFiles() {
        return this.headerFiles;
    }
    getManFiles() {
        return this.manFiles;
    }
    getJitFiles() {
        return this.jitFiles;
    }
}
exports.LuaJitSourcesInfo = LuaJitSourcesInfo;


/***/ }),

/***/ 9768:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaJitFinishInstallationTarget = void 0;
const Console_1 = __nccwpck_require__(946);
class LuaJitFinishInstallationTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[Start] Finish the installation of ${projectVersion.getName()} ${projectVersion.getRef()} installation`);
            resolve();
        });
    }
    getNext() {
        return null;
    }
    execute() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine("<< done >>");
            resolve();
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[End] Finish the installation of ${projectVersion.getName()} ${projectVersion.getRef()} installation`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
}
exports.LuaJitFinishInstallationTarget = LuaJitFinishInstallationTarget;


/***/ }),

/***/ 1612:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaJitPostInstallTarget = void 0;
const AbstractUpdateLuaEnvVarsTarget_1 = __nccwpck_require__(6962);
const LuaJitFinishInstallationTarget_1 = __nccwpck_require__(9768);
const Console_1 = __nccwpck_require__(946);
class LuaJitPostInstallTarget extends AbstractUpdateLuaEnvVarsTarget_1.AbstractUpdateLuaEnvVarsTarget {
    constructor(project, parent) {
        super(project, parent);
    }
    getProjectInstallDir() {
        return this.getProject().getInstallDir();
    }
    getProjectInstallLibDir() {
        return this.getProject().getInstallLibDir();
    }
    getProjectInstallBinDir() {
        return this.getProject().getInstallBinDir();
    }
    getProjectInstallPkgConfigDir() {
        return this.getProject().getInstallPkgConfigDir();
    }
    init() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.getProject().getVersion();
            Console_1.Console.instance().writeLine(`[Start] Post install for ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getNext() {
        return new LuaJitFinishInstallationTarget_1.LuaJitFinishInstallationTarget(this.getProject(), this);
    }
    finalize() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.getProject().getVersion();
            Console_1.Console.instance().writeLine(`[End] Post install for ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
}
exports.LuaJitPostInstallTarget = LuaJitPostInstallTarget;


/***/ }),

/***/ 8453:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaJitUnixInstall = void 0;
const node_path_1 = __nccwpck_require__(6760);
const ExecuteProcess_1 = __nccwpck_require__(6522);
const LuaJitPostInstallTarget_1 = __nccwpck_require__(1612);
const DefaultStdOutHandler_1 = __nccwpck_require__(840);
const Console_1 = __nccwpck_require__(946);
class LuaJitUnixInstall {
    constructor(project, parent, buildInfo) {
        this.project = project;
        this.parent = parent;
        this.buildInfo = buildInfo;
    }
    init() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[Start] Install ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new LuaJitPostInstallTarget_1.LuaJitPostInstallTarget(this.project, this);
    }
    execute() {
        return new Promise((resolve, reject) => {
            const makeArguments = this.buildInfo.getMakeArguments();
            const makeArgs = makeArguments.createCopy();
            const installTarget = "install";
            makeArgs.push(installTarget);
            (0, ExecuteProcess_1.executeProcess)(this.buildInfo.getMake(), {
                args: makeArgs,
                stdout: DefaultStdOutHandler_1.defaultStdOutHandler,
                verbose: true
            })
                .then(makeCode => {
                if (process.env["GITHUB_PATH"]) {
                    const installBinDir = this.project.getInstallBinDir();
                    const luajitInterpreter = (0, node_path_1.join)(installBinDir, "luajit");
                    const luaSoftLink = (0, node_path_1.join)(installBinDir, "lua");
                    (0, ExecuteProcess_1.executeProcess)("ln", {
                        args: ["-s", luajitInterpreter, luaSoftLink],
                        verbose: true,
                        stdout: DefaultStdOutHandler_1.defaultStdOutHandler
                    })
                        .then(lnCode => {
                        resolve();
                    })
                        .catch(reject);
                }
                else {
                    resolve();
                }
            })
                .catch(reject);
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[End] Install ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
}
exports.LuaJitUnixInstall = LuaJitUnixInstall;


/***/ }),

/***/ 9771:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaJitWindowsCopyInstallableArtifactsTarget = void 0;
const promises_1 = __nccwpck_require__(1455);
const node_path_1 = __nccwpck_require__(6760);
const SequentialPromises_1 = __nccwpck_require__(923);
const LuaJitPostInstallTarget_1 = __nccwpck_require__(1612);
const Console_1 = __nccwpck_require__(946);
class LuaJitWindowsCopyInstallableArtifactsTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[Start] Copy ${projectVersion.getName()} ${projectVersion.getRef()} installation files`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new LuaJitPostInstallTarget_1.LuaJitPostInstallTarget(this.project, this);
    }
    copyInterpreter() {
        return new Promise((resolve, reject) => {
            const builtInterpreter = this.parent.getBuildInfo().getInterpreter();
            const binDir = this.project.getInstallBinDir();
            const filesToCopy = [
                (0, node_path_1.join)(binDir, (0, node_path_1.basename)(builtInterpreter))
            ];
            if (process.env["GITHUB_PATH"]) {
                filesToCopy.push((0, node_path_1.join)(binDir, "lua.exe"));
            }
            const file_iter = (i) => {
                if (i < filesToCopy.length) {
                    const destFile = filesToCopy[i];
                    (0, promises_1.cp)(builtInterpreter, destFile, { force: true })
                        .then(() => {
                        file_iter(i + 1);
                    })
                        .catch(reject);
                }
                else {
                    resolve();
                }
            };
            file_iter(0);
        });
    }
    copySharedLibrary() {
        return new Promise((resolve, reject) => {
            const builtSharedLib = this.parent.getBuildInfo().getSharedLibrary();
            const sharedLib = (0, node_path_1.join)(this.project.getInstallBinDir(), (0, node_path_1.basename)(builtSharedLib));
            (0, promises_1.cp)(builtSharedLib, sharedLib, { force: true })
                .then(resolve)
                .catch(reject);
        });
    }
    copyImportLibrary() {
        return new Promise((resolve, reject) => {
            const builtImpLib = this.parent.getBuildInfo().getImportLibrary();
            if (builtImpLib) {
                const libDir = this.project.getInstallLibDir();
                const impLib = (0, node_path_1.join)(libDir, (0, node_path_1.basename)(builtImpLib));
                (0, promises_1.cp)(builtImpLib, impLib, { force: true })
                    .then(resolve)
                    .catch(reject);
            }
            else {
                resolve();
            }
        });
    }
    copyHeaders() {
        return new Promise((resolve, reject) => {
            const srcInfo = this.parent.getBuildInfo().getSourcesInfo();
            const includeDir = this.project.getInstallIncludeDir(srcInfo.getVersion());
            const headers = srcInfo.getHeaderFiles();
            const len = headers.getLenght();
            const header_iter = (i) => {
                if (i < len) {
                    const sourceHeader = headers.getItem(i);
                    const h = (0, node_path_1.join)(includeDir, (0, node_path_1.basename)(sourceHeader));
                    (0, promises_1.cp)(sourceHeader, h, { force: true })
                        .then(() => {
                        header_iter(i + 1);
                    })
                        .catch(reject);
                }
                else {
                    const sourceHeader = srcInfo.getDelayedHeaderFile();
                    const h = (0, node_path_1.join)(includeDir, (0, node_path_1.basename)(sourceHeader));
                    (0, promises_1.cp)(sourceHeader, h, { force: true })
                        .then(resolve)
                        .catch(reject);
                }
            };
            header_iter(0);
        });
    }
    copyManFiles() {
        return new Promise((resolve, reject) => {
            const manDir = this.project.getInstallManDir();
            const manFiles = this.parent.getBuildInfo().getSourcesInfo().getManFiles();
            const len = manFiles.getLenght();
            const man_iter = (i) => {
                if (i < len) {
                    const sourceMan = manFiles.getItem(i);
                    const man = (0, node_path_1.join)(manDir, (0, node_path_1.basename)(sourceMan));
                    (0, promises_1.cp)(sourceMan, man, { force: true })
                        .then(() => {
                        man_iter(i + 1);
                    })
                        .catch(reject);
                }
                else {
                    resolve();
                }
            };
            man_iter(0);
        });
    }
    copyPkgConfigFile() {
        return new Promise((resolve, reject) => {
            const builtPkgConfigFile = this.parent.getBuildInfo().getPkgConfigFile();
            const pkgConfigDir = this.project.getInstallPkgConfigDir();
            const pkgConfigFile = (0, node_path_1.join)(pkgConfigDir, (0, node_path_1.basename)(builtPkgConfigFile));
            (0, promises_1.cp)(builtPkgConfigFile, pkgConfigFile, { force: true })
                .then(resolve)
                .catch(reject);
        });
    }
    execute() {
        return new Promise((resolve, reject) => {
            (0, SequentialPromises_1.sequentialPromises)([
                () => this.copyInterpreter(),
                () => this.copySharedLibrary(),
                () => this.copyImportLibrary(),
                () => this.copyHeaders(),
                () => this.copyManFiles(),
                () => this.copyPkgConfigFile()
            ])
                .then(_ => {
                resolve();
            })
                .catch(reject);
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[End] Copy ${projectVersion.getName()} ${projectVersion.getRef()} installation files`);
            resolve();
        });
    }
}
exports.LuaJitWindowsCopyInstallableArtifactsTarget = LuaJitWindowsCopyInstallableArtifactsTarget;


/***/ }),

/***/ 9023:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaJitWindowsCreateInstallationDirectoriesTarget = void 0;
const AbstractCreateDirectoriesTarget_1 = __nccwpck_require__(6763);
const LuaJitWindowsCopyInstallableArtifactsTarget_1 = __nccwpck_require__(9771);
const Console_1 = __nccwpck_require__(946);
class LuaJitWindowsCreateInstallationDirectoriesTarget extends AbstractCreateDirectoriesTarget_1.AbstractCreateDirectoriesTarget {
    constructor(project, parent, buildInfo) {
        super([
            project.getInstallDir(),
            project.getInstallIncludeDir(buildInfo.getSourcesInfo().getVersion()),
            project.getInstallBinDir(),
            project.getInstallLibDir(),
            project.getInstallManDir(),
            project.getInstallPkgConfigDir(),
            project.getInstallLuaModulesDir(),
            project.getInstallCModulesDir()
        ]);
        this.project = project;
        this.parent = parent;
        this.buildInfo = buildInfo;
    }
    init() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[Start] Create installation directories for ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new LuaJitWindowsCopyInstallableArtifactsTarget_1.LuaJitWindowsCopyInstallableArtifactsTarget(this.project, this);
    }
    getBuildInfo() {
        return this.buildInfo;
    }
    finalize() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            Console_1.Console.instance().writeLine(`[End] Create installation directories for ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
}
exports.LuaJitWindowsCreateInstallationDirectoriesTarget = LuaJitWindowsCreateInstallationDirectoriesTarget;


/***/ }),

/***/ 2892:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaJitProject = void 0;
const node_path_1 = __nccwpck_require__(6760);
const GetSetProperty_1 = __nccwpck_require__(8195);
const TargetPipeline_1 = __nccwpck_require__(9348);
const LuaJitCreateBuildDirectoriesTarget_1 = __nccwpck_require__(6456);
const LuaJitBuildTarget_1 = __nccwpck_require__(9609);
const LuaJitWindowsCreateInstallationDirectoriesTarget_1 = __nccwpck_require__(9023);
const LuaJitUnixInstall_1 = __nccwpck_require__(8453);
class LuaJitProject {
    getVersion() {
        return this.version;
    }
    getBuildDir() {
        return this.buildDir;
    }
    getRemotePatchesBuildDir() {
        return this.remotePatchesBuildDir;
    }
    getInstallDir() {
        return this.installDir;
    }
    getToolchain() {
        return this.toolchain;
    }
    getInstallBaseIncludeDir() {
        return this.installBaseIncludeDir;
    }
    getInstallIncludeDir(luajitVersion) {
        return (0, node_path_1.join)(this.installBaseIncludeDir, `luajit-${luajitVersion.getMajor()}.${luajitVersion.getMinor()}`);
    }
    getInstallBinDir() {
        return this.installBinDir;
    }
    getInstallLibDir() {
        return this.installLibDir;
    }
    getInstallManDir() {
        return this.installManDir;
    }
    getInstallPkgConfigDir() {
        return this.installPkgConfigDir;
    }
    getInstallLuaModulesDir() {
        return this.installLuaModulesDir;
    }
    getInstallLuaJitModuleDir() {
        return this.installLuaJitModuleDir;
    }
    getInstallCModulesDir() {
        return this.installCModulesDir;
    }
    configurationResult() {
        return this._configurationResult;
    }
    buildResult() {
        return this._buildResult;
    }
    constructor(version, buildDir, installDir, toolchain) {
        this.version = version;
        this.buildDir = buildDir;
        this.installDir = installDir;
        this.toolchain = toolchain;
        this.remotePatchesBuildDir = (0, node_path_1.join)(this.buildDir, "remote-patches");
        this.installBaseIncludeDir = (0, node_path_1.join)(installDir, "include");
        this.installBinDir = (0, node_path_1.join)(installDir, "bin");
        this.installLibDir = (0, node_path_1.join)(installDir, "lib");
        this.installManDir = (0, node_path_1.join)(installDir, "share", "man", "man1");
        this.installPkgConfigDir = (0, node_path_1.join)(this.installLibDir, "pkgconfig");
        if (process.platform === 'win32') {
            this.installLuaModulesDir = (0, node_path_1.join)(this.installBinDir, "lua");
            this.installLuaJitModuleDir = (0, node_path_1.join)(this.installLuaModulesDir, "jit");
            this.installCModulesDir = this.installBinDir;
        }
        else {
            this.installLuaModulesDir = (0, node_path_1.join)(installDir, "share", "lua", "5.1");
            this.installCModulesDir = (0, node_path_1.join)(this.installLibDir, "lua", "5.1");
        }
        this._configurationResult = new GetSetProperty_1.GetSetProperty(null);
        this._buildResult = new GetSetProperty_1.GetSetProperty(null);
    }
    configure() {
        return new Promise((resolve, reject) => {
            const initialConfigureTarget = new LuaJitCreateBuildDirectoriesTarget_1.LuaJitCreateBuildDirectoriesTarget(this, null);
            const pipeline = new TargetPipeline_1.TargetPipeline(initialConfigureTarget);
            pipeline.execute()
                .then(resolve)
                .catch(reject);
        });
    }
    build() {
        return new Promise((resolve, reject) => {
            const initialBuildTarget = new LuaJitBuildTarget_1.LuaJitBuildTarget(this, null, this.configurationResult().getValue());
            const pipeline = new TargetPipeline_1.TargetPipeline(initialBuildTarget);
            pipeline.execute()
                .then(resolve)
                .catch(reject);
        });
    }
    install() {
        return new Promise((resolve, reject) => {
            const initialInstallTarget = process.platform === 'win32' ?
                new LuaJitWindowsCreateInstallationDirectoriesTarget_1.LuaJitWindowsCreateInstallationDirectoriesTarget(this, null, this.buildResult().getValue()) :
                new LuaJitUnixInstall_1.LuaJitUnixInstall(this, null, this.buildResult().getValue());
            const pipeline = new TargetPipeline_1.TargetPipeline(initialInstallTarget);
            pipeline.execute()
                .then(resolve)
                .catch(reject);
        });
    }
}
exports.LuaJitProject = LuaJitProject;


/***/ }),

/***/ 1721:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OpenRestyRepositoryVersion = exports.LuaJitRepositoryVersion = exports.LuaJitBaseRepositoryVersion = void 0;
exports.parseLuaJitRepositoryVersion = parseLuaJitRepositoryVersion;
const CONVERT_LUAJIT = {
    "openresty": {
        name: "OpenResty",
        repository: "https://github.com/openresty/luajit2",
        ref: "v2.1-agentzh",
        create: (opts) => new OpenRestyRepositoryVersion(opts)
    },
    "luajit": {
        name: "LuaJIT",
        repository: "https://github.com/LuaJIT/LuaJIT",
        ref: "v2.1",
        create: (opts) => new LuaJitRepositoryVersion(opts)
    }
};
function parseLuaJitRepositoryVersion(version) {
    return new Promise((resolve, reject) => {
        if (version in CONVERT_LUAJIT) {
            const details = CONVERT_LUAJIT[version];
            const repository = (details.repository);
            const name = (details.name);
            const defaultBranch = (details.ref);
            const create = details.create;
            resolve(create({ name: name, kind: version, repository: repository, ref: defaultBranch }));
        }
        else {
            const match = /^(openresty|luajit)\@(.*)$/.exec(version);
            if (match) {
                const kind = match[1];
                if (kind in CONVERT_LUAJIT) {
                    const details = CONVERT_LUAJIT[kind];
                    const repository = (details.repository);
                    const name = (details.name);
                    const ref = match[2];
                    const create = details.create;
                    resolve(create({ name: name, kind: kind, repository: repository, ref: ref }));
                }
                else {
                    reject(new Error("Internal error: unexpected condition to convert LuaJIT / OpenResty version to the proper repository"));
                }
            }
            else {
                reject(new Error("Unknown format for the LuaJIT / OpenResty version"));
            }
        }
    });
}
class LuaJitBaseRepositoryVersion {
    getName() {
        return this.options.name;
    }
    getKind() {
        return this.options.kind;
    }
    getRepository() {
        return this.options.repository;
    }
    getRef() {
        return this.options.ref;
    }
    getString() {
        return this.options.ref;
    }
    constructor(opts) {
        this.options = {
            name: opts.name,
            kind: opts.kind,
            repository: opts.repository,
            ref: opts.ref
        };
    }
}
exports.LuaJitBaseRepositoryVersion = LuaJitBaseRepositoryVersion;
class LuaJitRepositoryVersion extends LuaJitBaseRepositoryVersion {
    constructor(opts) {
        super(opts);
    }
}
exports.LuaJitRepositoryVersion = LuaJitRepositoryVersion;
class OpenRestyRepositoryVersion extends LuaJitBaseRepositoryVersion {
    constructor(opts) {
        super(opts);
    }
}
exports.OpenRestyRepositoryVersion = OpenRestyRepositoryVersion;


/***/ }),

/***/ 8477:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OpenRestyVersion = exports.LuaJitVersion = exports.LuaJitBaseVersion = void 0;
class LuaJitBaseVersion {
    getMajor() {
        return this.major;
    }
    getMinor() {
        return this.minor;
    }
    getRelease() {
        return this.release;
    }
    getABI() {
        return this.abi;
    }
    constructor(major, minor, release, abi) {
        this.major = major;
        this.minor = minor;
        this.release = release;
        this.abi = abi;
    }
}
exports.LuaJitBaseVersion = LuaJitBaseVersion;
class LuaJitVersion extends LuaJitBaseVersion {
    constructor(major, minor, release, abi) {
        super(major, minor, release, abi);
    }
}
exports.LuaJitVersion = LuaJitVersion;
class OpenRestyVersion extends LuaJitBaseVersion {
    constructor(major, minor, release, abi) {
        super(major, minor, release, abi);
    }
}
exports.OpenRestyVersion = OpenRestyVersion;


/***/ }),

/***/ 5168:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaRocksWindowsBuildInfo = exports.LuaRocksUnixBuildInfo = exports.AbstractLuaRocksBuildInfo = void 0;
const ReadOnlyArray_1 = __nccwpck_require__(2483);
const LuaRocksSourcesInfo_1 = __nccwpck_require__(5724);
class AbstractLuaRocksBuildInfo {
    constructor(sourcesInfo) {
        this.srcInfo = sourcesInfo;
    }
    getSourcesInfo() {
        return this.srcInfo;
    }
}
exports.AbstractLuaRocksBuildInfo = AbstractLuaRocksBuildInfo;
class LuaRocksUnixBuildInfo extends AbstractLuaRocksBuildInfo {
    constructor(sourcesInfo, make, makeArguments) {
        super(sourcesInfo);
        if (!(sourcesInfo.getDetails() instanceof LuaRocksSourcesInfo_1.LuaRocksUnixSourcesInfoDetails)) {
            throw new Error("Unix sources info details expected");
        }
        this.make = make;
        this.makeArguments = new ReadOnlyArray_1.ReadOnlyArray(makeArguments);
    }
    getMake() {
        return this.make;
    }
    getMakeArguments() {
        return this.makeArguments;
    }
}
exports.LuaRocksUnixBuildInfo = LuaRocksUnixBuildInfo;
class LuaRocksWindowsBuildInfo extends AbstractLuaRocksBuildInfo {
    constructor(sourcesInfo) {
        super(sourcesInfo);
        if (!(sourcesInfo.getDetails() instanceof LuaRocksSourcesInfo_1.LuaRocksWindowsSourcesInfoDetails)) {
            throw new Error("Windows sources info details expected");
        }
    }
}
exports.LuaRocksWindowsBuildInfo = LuaRocksWindowsBuildInfo;


/***/ }),

/***/ 8757:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaRocksBuildTarget = void 0;
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
const ExecuteProcess_1 = __nccwpck_require__(6522);
const DefaultStdOutHandler_1 = __nccwpck_require__(840);
const LuaRocksSourcesInfo_1 = __nccwpck_require__(5724);
const LuaRocksBuildInfo_1 = __nccwpck_require__(5168);
const LuaRocksFinishBuildingTarget_1 = __nccwpck_require__(692);
const Console_1 = __nccwpck_require__(946);
class LuaRocksBuildTarget {
    constructor(project, parent, sourcesInfo) {
        this.parent = parent;
        this.project = project;
        this.srcInfo = sourcesInfo;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Build LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getLuaRocksSourcesInfo() {
        return this.srcInfo;
    }
    getNext() {
        return new LuaRocksFinishBuildingTarget_1.LuaRocksFinishBuildingTarget(this.project, this);
    }
    setUnixBuildResult(make, makeArgs) {
        this.project.buildResult().setValue(new LuaRocksBuildInfo_1.LuaRocksUnixBuildInfo(this.srcInfo, make, makeArgs));
    }
    setWindowsBuildResult() {
        this.project.buildResult().setValue(new LuaRocksBuildInfo_1.LuaRocksWindowsBuildInfo(this.srcInfo));
    }
    execute() {
        return new Promise((resolve, reject) => {
            const details = this.srcInfo.getDetails();
            if (details instanceof LuaRocksSourcesInfo_1.LuaRocksUnixSourcesInfoDetails) {
                const make = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getMake();
                const makeArgs = ["-C", this.srcInfo.getDir()];
                (0, ExecuteProcess_1.executeProcess)(make, {
                    args: makeArgs,
                    verbose: true,
                    stdout: DefaultStdOutHandler_1.defaultStdOutHandler
                })
                    .then(code => {
                    this.setUnixBuildResult(make, makeArgs);
                    resolve();
                })
                    .catch(reject);
            }
            else {
                this.setWindowsBuildResult();
                resolve();
            }
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Build LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
exports.LuaRocksBuildTarget = LuaRocksBuildTarget;


/***/ }),

/***/ 692:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaRocksFinishBuildingTarget = void 0;
const Console_1 = __nccwpck_require__(946);
class LuaRocksFinishBuildingTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Finish the building of LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return null;
    }
    execute() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine("LuaRocks was built successfully.");
            resolve();
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Finish the building of LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
exports.LuaRocksFinishBuildingTarget = LuaRocksFinishBuildingTarget;


/***/ }),

/***/ 9199:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaRocksApplyPatchesTarget = void 0;
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
const AbstractApplyPatchesTarget_1 = __nccwpck_require__(3714);
const LuaRocksConfigureSourcesTarget_1 = __nccwpck_require__(3775);
const Console_1 = __nccwpck_require__(946);
class LuaRocksApplyPatchesTarget extends AbstractApplyPatchesTarget_1.AbstractApplyPatchesTarget {
    constructor(project, parent) {
        super(project, parent, parent.getLuaRocksSourcesInfo().getDir(), project.getRemotePatchesBuildDir(), ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLuaRocksPatches());
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Apply patches on LuaRocks ${this.getProject().getVersion().getIdentifier()}`);
            resolve();
        });
    }
    getLuaRocksSourcesInfo() {
        return this.getParent().getLuaRocksSourcesInfo();
    }
    getNext() {
        return new LuaRocksConfigureSourcesTarget_1.LuaRocksConfigureSourcesTarget(this.getProject(), this);
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Apply patches on LuaRocks ${this.getProject().getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
exports.LuaRocksApplyPatchesTarget = LuaRocksApplyPatchesTarget;


/***/ }),

/***/ 6878:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaRocksCheckDependenciesTarget = void 0;
const FindProgram_1 = __nccwpck_require__(2437);
const SequentialPromises_1 = __nccwpck_require__(923);
const LuaRocksFetchTarget_1 = __nccwpck_require__(5955);
const Console_1 = __nccwpck_require__(946);
class LuaRocksCheckDependenciesTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Check dependencies for LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new LuaRocksFetchTarget_1.LuaRocksFetchTarget(this.project, this);
    }
    execute() {
        return new Promise((resolve, reject) => {
            if (process.platform === 'win32') {
                resolve();
            }
            else {
                (0, SequentialPromises_1.sequentialPromises)(process.platform === 'darwin' ? [
                    () => (0, FindProgram_1.findProgram)("unzip")
                ] : [
                    () => (0, FindProgram_1.findProgram)("unzip"),
                    () => (0, FindProgram_1.findProgram)("gmake")
                ])
                    .then(_ => {
                    resolve();
                })
                    .catch(reject);
            }
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Check dependencies for LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
exports.LuaRocksCheckDependenciesTarget = LuaRocksCheckDependenciesTarget;


/***/ }),

/***/ 3775:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaRocksConfigureSourcesTarget = void 0;
const ExecuteProcess_1 = __nccwpck_require__(6522);
const LuaRocksFinishConfigurationTarget_1 = __nccwpck_require__(2764);
const LuaRocksSourcesInfo_1 = __nccwpck_require__(5724);
const DefaultStdOutHandler_1 = __nccwpck_require__(840);
const Console_1 = __nccwpck_require__(946);
class LuaRocksConfigureSourcesTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Configure LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new LuaRocksFinishConfigurationTarget_1.LuaRocksFinishConfigurationTarget(this.project, this);
    }
    setConfigurationResult() {
        this.project.configurationResult()
            .setValue(this.parent.getLuaRocksSourcesInfo());
    }
    execute() {
        return new Promise((resolve, reject) => {
            if (process.platform === 'win32') {
                this.setConfigurationResult();
                resolve();
            }
            else {
                const sourcesInfo = this.parent.getLuaRocksSourcesInfo();
                const details = sourcesInfo.getDetails();
                if (details instanceof LuaRocksSourcesInfo_1.LuaRocksUnixSourcesInfoDetails) {
                    const installDir = this.project.getInstallDir();
                    (0, ExecuteProcess_1.executeProcess)(details.getConfigureScript(), {
                        cwd: sourcesInfo.getDir(),
                        args: [
                            `--prefix=${installDir}`,
                            `--with-lua=${installDir}`
                        ],
                        verbose: true,
                        stdout: DefaultStdOutHandler_1.defaultStdOutHandler
                    })
                        .then(code => {
                        this.setConfigurationResult();
                        resolve();
                    })
                        .catch(reject);
                }
                else {
                    reject(new Error("Internal error: unexpected LuaRocks sources info details for Unix systems"));
                }
            }
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Configure LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
exports.LuaRocksConfigureSourcesTarget = LuaRocksConfigureSourcesTarget;


/***/ }),

/***/ 3038:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaRocksCreateBuildDirectoriesTarget = void 0;
const AbstractCreateDirectoriesTarget_1 = __nccwpck_require__(6763);
const LuaRocksCheckDependenciesTarget_1 = __nccwpck_require__(6878);
const Console_1 = __nccwpck_require__(946);
class LuaRocksCreateBuildDirectoriesTarget extends AbstractCreateDirectoriesTarget_1.AbstractCreateDirectoriesTarget {
    constructor(project, parent) {
        super([
            project.getBuildDir(),
            project.getRemotePatchesBuildDir()
        ]);
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Create build directories for LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new LuaRocksCheckDependenciesTarget_1.LuaRocksCheckDependenciesTarget(this.project, this);
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Create build directories for LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
exports.LuaRocksCreateBuildDirectoriesTarget = LuaRocksCreateBuildDirectoriesTarget;


/***/ }),

/***/ 5955:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaRocksFetchTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const promises_1 = __nccwpck_require__(1455);
const AbstractFetchCompressedTarget_1 = __nccwpck_require__(5378);
const ExtractTarGz_1 = __nccwpck_require__(3143);
const ExtractZip_1 = __nccwpck_require__(8702);
const CheckFiles_1 = __nccwpck_require__(8105);
const LuaRocksSourcesInfo_1 = __nccwpck_require__(5724);
const LuaRocksVersion_1 = __nccwpck_require__(3527);
const LuaRocksApplyPatchesTarget_1 = __nccwpck_require__(9199);
const Console_1 = __nccwpck_require__(946);
class LuaRocksFetchTarget extends AbstractFetchCompressedTarget_1.AbstractFetchCompressedTarget {
    constructor(project, parent) {
        super(project.getVersion().getDownloadUrl(), project.getBuildDir(), project.getVersion() instanceof LuaRocksVersion_1.LuaRocksReleaseVersion ? `luarocks-${project.getVersion().getIdentifier()}` : null, (0, node_path_1.extname)((0, node_path_1.basename)(project.getVersion().getDownloadUrl())) === ".zip" ? ExtractZip_1.extractZip : ExtractTarGz_1.extractTarGz, project.getVersion() instanceof LuaRocksVersion_1.LuaRocksReleaseVersion ? {
            fileHash: {
                algorithm: project.getVersion().getHashAlgorithm(),
                expectedHash: project.getVersion().getHashValue()
            }
        } : undefined);
        this.project = project;
        this.parent = parent;
        this.luaRocksSourcesInfo = undefined;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Fetch LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new LuaRocksApplyPatchesTarget_1.LuaRocksApplyPatchesTarget(this.project, this);
    }
    getLuaRocksSourcesInfo() {
        return this.luaRocksSourcesInfo;
    }
    execute() {
        return new Promise((resolve, reject) => {
            this.luaRocksSourcesInfo = undefined;
            super.execute()
                .then(() => {
                const workDir = this.getWorkDir();
                const filename = (0, node_path_1.basename)(this.project.getVersion().getDownloadUrl());
                if (process.platform === 'win32') {
                    const extension = (0, node_path_1.extname)(filename);
                    if (extension === ".zip") {
                        const extractedDir = filename.substring(0, filename.length - extension.length);
                        const luarocks = (0, node_path_1.join)(workDir, extractedDir, "luarocks.exe");
                        const luarocksAdmin = (0, node_path_1.join)(workDir, extractedDir, "luarocks-admin.exe");
                        (0, CheckFiles_1.checkFiles)([luarocks, luarocksAdmin])
                            .then(() => {
                            this.luaRocksSourcesInfo = new LuaRocksSourcesInfo_1.LuaRocksSourcesInfo(extractedDir, new LuaRocksSourcesInfo_1.LuaRocksWindowsSourcesInfoDetails(luarocks, luarocksAdmin));
                            resolve();
                        })
                            .catch(reject);
                    }
                    else {
                        reject(new Error(".zip extension expected"));
                    }
                }
                else {
                    (0, promises_1.readdir)(workDir, { recursive: false })
                        .then(items => {
                        const len = items.length;
                        const dirItem_iter = (i) => {
                            if (i < len) {
                                const dirItem = items[i];
                                if (dirItem.startsWith("luarocks-")) {
                                    const extractedDir = (0, node_path_1.join)(workDir, dirItem);
                                    (0, promises_1.stat)(extractedDir)
                                        .then(s => {
                                        if (s.isDirectory()) {
                                            const configureScript = (0, node_path_1.join)(extractedDir, "configure");
                                            (0, promises_1.stat)(configureScript)
                                                .then(configureScriptStat => {
                                                if (configureScriptStat.isFile()) {
                                                    if (configureScriptStat.mode & promises_1.constants.X_OK) {
                                                        this.luaRocksSourcesInfo = new LuaRocksSourcesInfo_1.LuaRocksSourcesInfo(extractedDir, new LuaRocksSourcesInfo_1.LuaRocksUnixSourcesInfoDetails(configureScript));
                                                        resolve();
                                                    }
                                                    else {
                                                        reject(new Error("configure script for LuaRocks is not executable"));
                                                    }
                                                }
                                                else {
                                                    reject(new Error("configure script for LuaRocks is not a file"));
                                                }
                                            })
                                                .catch(configureScriptErr => {
                                                if (configureScriptErr.code === "ENOENT") {
                                                    reject(new Error("configure script for LuaRocks was not found"));
                                                }
                                                else {
                                                    reject(configureScriptErr);
                                                }
                                            });
                                        }
                                        else {
                                            dirItem_iter(i + 1);
                                        }
                                    })
                                        .catch(reject);
                                }
                                else {
                                    dirItem_iter(i + 1);
                                }
                            }
                            else {
                                reject(new Error(`Extracted directory for LuaRocks ${this.project.getVersion().getIdentifier()} was not found`));
                            }
                        };
                        dirItem_iter(0);
                    })
                        .catch(reject);
                }
            })
                .catch(reject);
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Fetch LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
exports.LuaRocksFetchTarget = LuaRocksFetchTarget;


/***/ }),

/***/ 2764:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaRocksFinishConfigurationTarget = void 0;
const LuaRocksSourcesInfo_1 = __nccwpck_require__(5724);
const Console_1 = __nccwpck_require__(946);
class LuaRocksFinishConfigurationTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Finish LuaRocks ${this.project.getVersion().getIdentifier()} configuration`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return null;
    }
    execute() {
        return new Promise((resolve, reject) => {
            const srcInfo = (this.project.configurationResult().getValue());
            Console_1.Console.instance().writeLine(`[Directory] ${srcInfo.getDir()}`);
            const details = srcInfo.getDetails();
            if (details instanceof LuaRocksSourcesInfo_1.LuaRocksWindowsSourcesInfoDetails) {
                Console_1.Console.instance().writeLine(`[LuaRocks] ${details.getLuaRocks()}`);
                Console_1.Console.instance().writeLine(`[LuaRocks admin] ${details.getLuaRocksAdmin()}`);
            }
            else {
                Console_1.Console.instance().writeLine(`[Configure script] ${details.getConfigureScript()}`);
            }
            resolve();
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Finish LuaRocks ${this.project.getVersion().getIdentifier()} configuration`);
            resolve();
        });
    }
}
exports.LuaRocksFinishConfigurationTarget = LuaRocksFinishConfigurationTarget;


/***/ }),

/***/ 5724:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaRocksSourcesInfo = exports.LuaRocksUnixSourcesInfoDetails = exports.LuaRocksWindowsSourcesInfoDetails = void 0;
class LuaRocksWindowsSourcesInfoDetails {
    getLuaRocks() {
        return this.luarocks;
    }
    getLuaRocksAdmin() {
        return this.luarocksAdmin;
    }
    constructor(luarocks, luarocksAdmin) {
        this.luarocks = luarocks;
        this.luarocksAdmin = luarocksAdmin;
    }
}
exports.LuaRocksWindowsSourcesInfoDetails = LuaRocksWindowsSourcesInfoDetails;
class LuaRocksUnixSourcesInfoDetails {
    getConfigureScript() {
        return this.configureScript;
    }
    constructor(configureScript) {
        this.configureScript = configureScript;
    }
}
exports.LuaRocksUnixSourcesInfoDetails = LuaRocksUnixSourcesInfoDetails;
class LuaRocksSourcesInfo {
    constructor(dir, details) {
        this.dir = dir;
        this.details = details;
    }
    getDir() {
        return this.dir;
    }
    getDetails() {
        return this.details;
    }
}
exports.LuaRocksSourcesInfo = LuaRocksSourcesInfo;


/***/ }),

/***/ 7563:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaRocksFinishInstallationTarget = void 0;
const Console_1 = __nccwpck_require__(946);
class LuaRocksFinishInstallationTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Finishing the installation of LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return null;
    }
    execute() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine("<< done >>");
            resolve();
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Finishing the installation of LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
exports.LuaRocksFinishInstallationTarget = LuaRocksFinishInstallationTarget;


/***/ }),

/***/ 2614:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaRocksInstallTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const promises_1 = __nccwpck_require__(1455);
const LuaRocksBuildInfo_1 = __nccwpck_require__(5168);
const ExecuteProcess_1 = __nccwpck_require__(6522);
const LuaRocksSourcesInfo_1 = __nccwpck_require__(5724);
const LuaRocksPostInstallTarget_1 = __nccwpck_require__(8444);
const DefaultStdOutHandler_1 = __nccwpck_require__(840);
const Console_1 = __nccwpck_require__(946);
class LuaRocksInstallTarget {
    constructor(project, parent, buildInfo) {
        this.project = project;
        this.parent = parent;
        this.buildInfo = buildInfo;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Install LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getLuaRocksBuildInfo() {
        return this.buildInfo;
    }
    getNext() {
        return new LuaRocksPostInstallTarget_1.LuaRocksPostInstallTarget(this.project, this);
    }
    execute() {
        return new Promise((resolve, reject) => {
            const info = this.buildInfo;
            if (info instanceof LuaRocksBuildInfo_1.LuaRocksUnixBuildInfo) {
                const makeArgs = info.getMakeArguments().createCopy();
                makeArgs.push("install");
                (0, ExecuteProcess_1.executeProcess)(info.getMake(), {
                    args: makeArgs,
                    verbose: true,
                    stdout: DefaultStdOutHandler_1.defaultStdOutHandler
                })
                    .then(code => {
                    resolve();
                })
                    .catch(reject);
            }
            else {
                const sourcesInfo = info.getSourcesInfo();
                const infoDetails = sourcesInfo.getDetails();
                if (infoDetails instanceof LuaRocksSourcesInfo_1.LuaRocksWindowsSourcesInfoDetails) {
                    const binDir = this.project.getInstallBinDir();
                    const filesToCopy = [
                        infoDetails.getLuaRocks(),
                        infoDetails.getLuaRocksAdmin()
                    ];
                    const file_iter = (i) => {
                        if (i < filesToCopy.length) {
                            const sourceFile = filesToCopy[i];
                            const destinationFile = (0, node_path_1.join)(binDir, (0, node_path_1.basename)(sourceFile));
                            (0, promises_1.cp)(sourceFile, destinationFile, { force: true })
                                .then(() => {
                                file_iter(i + 1);
                            })
                                .catch(reject);
                        }
                        else {
                            resolve();
                        }
                    };
                    file_iter(0);
                }
                else {
                    reject(new Error("Internal error: LuaRocks sources info details for Windows expected."));
                }
            }
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Install LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
exports.LuaRocksInstallTarget = LuaRocksInstallTarget;


/***/ }),

/***/ 8444:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaRocksPostInstallTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const promises_1 = __nccwpck_require__(1455);
const ExecuteProcess_1 = __nccwpck_require__(6522);
const CheckFiles_1 = __nccwpck_require__(8105);
const LuaRocksSourcesInfo_1 = __nccwpck_require__(5724);
const GitHub_1 = __nccwpck_require__(5249);
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
const SequentialPromises_1 = __nccwpck_require__(923);
const ReadOnlyArray_1 = __nccwpck_require__(2483);
const DefaultStdOutHandler_1 = __nccwpck_require__(840);
const IGccLikeToolchain_1 = __nccwpck_require__(9372);
const LuaRocksFinishInstallationTarget_1 = __nccwpck_require__(7563);
const Console_1 = __nccwpck_require__(946);
const LUA_INTERPRETER_CANDIDATES = new ReadOnlyArray_1.ReadOnlyArray([
    "lua.exe",
    "luajit.exe"
]);
class LuaRocksPostInstallTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Post install for LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new LuaRocksFinishInstallationTarget_1.LuaRocksFinishInstallationTarget(this.project, this);
    }
    setEnvironmentVariablesOnGitHub(luarocks) {
        return new Promise((resolve, reject) => {
            (0, SequentialPromises_1.sequentialPromises)([
                () => (0, ExecuteProcess_1.getFirstLineFromProcessExecution)(luarocks, ["path", "--lr-bin"], true),
                () => (0, ExecuteProcess_1.getFirstLineFromProcessExecution)(luarocks, ["path", "--lr-cpath"], true),
                () => (0, ExecuteProcess_1.getFirstLineFromProcessExecution)(luarocks, ["path", "--lr-path"], true)
            ])
                .then(values => {
                const lrBin = values[0];
                const lrCPath = values[1];
                const lrPath = values[2];
                (0, SequentialPromises_1.sequentialPromises)([
                    () => (0, GitHub_1.appendToGitHubEnvironmentVariables)("LUA_PATH", lrPath),
                    () => (0, GitHub_1.appendToGitHubEnvironmentVariables)("LUA_CPATH", lrCPath),
                    () => (0, GitHub_1.appendToGitHubPath)(lrBin)
                ])
                    .then(_values => {
                    resolve();
                })
                    .catch(reject);
            })
                .catch(reject);
        });
    }
    setLuaRocksConfig(luarocks, key, value) {
        return new Promise((resolve, reject) => {
            (0, ExecuteProcess_1.executeProcess)(luarocks, {
                args: [
                    "config",
                    key,
                    value
                ],
                verbose: true,
                stdout: DefaultStdOutHandler_1.defaultStdOutHandler
            })
                .then(_configSetEnvVar => {
                resolve();
            })
                .catch(reject);
        });
    }
    setLuaRocksConfigVariable(luarocks, key, value) {
        return this.setLuaRocksConfig(luarocks, `variables.${key}`, value);
    }
    setLuaRocksToolchainEnvVars(luarocks, toolchainEnvVars) {
        return new Promise((resolve, reject) => {
            const iter = (i) => {
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
    setLuaRocksConfigSetupOnWindows(luarocks, luaVersion, installDir) {
        return new Promise((resolve, reject) => {
            (0, SequentialPromises_1.sequentialPromises)([
                () => this.setLuaRocksConfig(luarocks, "lua_version", luaVersion),
                () => this.setLuaRocksConfig(luarocks, "lua_dir", installDir),
            ])
                .then(_values => {
                resolve();
            })
                .catch(reject);
        });
    }
    getWindowsGccExternalDepsDirs() {
        return new Promise((resolve, reject) => {
            const maxDepth = 10;
            const matchFile = (dir, depth, predicate) => {
                return new Promise((_resolve, _reject) => {
                    if (depth > maxDepth) {
                        _reject(new Error(`Not searching further than ${maxDepth} directories deep`));
                    }
                    else {
                        (0, promises_1.readdir)(dir)
                            .then(files => {
                            const file_iter = (i) => {
                                if (i < files.length) {
                                    const fileBasename = files[i];
                                    const file = (0, node_path_1.join)(dir, fileBasename);
                                    (0, promises_1.stat)(file)
                                        .then(fileStat => {
                                        if (fileStat.isFile() && predicate(file)) {
                                            _resolve(file);
                                        }
                                        else if (fileStat.isDirectory()) {
                                            matchFile(file, depth + 1, predicate)
                                                .then(_resolve)
                                                .catch(matchErr => {
                                                file_iter(i + 1);
                                            });
                                        }
                                        else {
                                            file_iter(i + 1);
                                        }
                                    })
                                        .catch(fileStatErr => {
                                        file_iter(i + 1);
                                    });
                                }
                                else {
                                    _reject(new Error("Match not found"));
                                }
                            };
                            file_iter(0);
                        })
                            .catch(_reject);
                    }
                });
            };
            const externalDepsDirs = [];
            const systemDrive = process.env["SYSTEMDRIVE"];
            if (systemDrive) {
                const systemDriveTrimmed = systemDrive.trim();
                if (systemDriveTrimmed.toLowerCase() !== "c:") {
                    externalDepsDirs.push((0, node_path_1.join)(systemDriveTrimmed, "external"));
                }
            }
            externalDepsDirs.push((0, node_path_1.join)("C:", "external"));
            (0, ExecuteProcess_1.getFirstLineFromProcessExecution)("where", [ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getCC()], true)
                .then(ccPath => {
                const ccBinDir = (0, node_path_1.dirname)(ccPath);
                if ((0, node_path_1.basename)(ccBinDir).toLowerCase() === 'bin') {
                    const ccDir = (0, node_path_1.dirname)(ccBinDir);
                    const ccInclude = (0, node_path_1.join)(ccDir, "include");
                    (0, promises_1.stat)(ccInclude)
                        .then(ccIncludeStat => {
                        if (ccIncludeStat.isDirectory()) {
                            externalDepsDirs.push(ccDir);
                            (0, ExecuteProcess_1.getFirstLineFromProcessExecution)(ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getCC(), ["-dumpmachine"])
                                .then(dumpMachine => {
                                matchFile(ccDir, 0, file => (0, node_path_1.basename)(file).toLowerCase() === 'windows.h')
                                    .then(windowsH => {
                                    const windowsHeadersDir = (0, node_path_1.dirname)(windowsH);
                                    if ((0, node_path_1.basename)(windowsHeadersDir).toLowerCase() === "include") {
                                        const windowsHeadersParentDir = (0, node_path_1.dirname)(windowsHeadersDir);
                                        externalDepsDirs.push(windowsHeadersParentDir);
                                    }
                                    resolve(externalDepsDirs);
                                })
                                    .catch(matchErr => {
                                    resolve(externalDepsDirs);
                                });
                            })
                                .catch(dumpMachineErr => {
                                resolve(externalDepsDirs);
                            });
                        }
                        else {
                            resolve(externalDepsDirs);
                        }
                    })
                        .catch(ccIncludeStatErr => {
                        resolve(externalDepsDirs);
                    });
                }
                else {
                    resolve(externalDepsDirs);
                }
            })
                .catch(whereErr => {
                resolve(externalDepsDirs);
            });
        });
    }
    execute() {
        return new Promise((resolve, reject) => {
            const isGccLike = (0, IGccLikeToolchain_1.isGccLikeToolchain)(this.project.getToolchain());
            const buildInfo = this.parent.getLuaRocksBuildInfo();
            const srcInfo = buildInfo.getSourcesInfo();
            const infoDetails = srcInfo.getDetails();
            const binDir = this.project.getInstallBinDir();
            if (infoDetails instanceof LuaRocksSourcesInfo_1.LuaRocksWindowsSourcesInfoDetails) {
                const installDir = this.project.getInstallDir();
                const luarocks = (0, node_path_1.join)(binDir, (0, node_path_1.basename)(infoDetails.getLuaRocks()));
                (0, CheckFiles_1.checkFiles)([luarocks])
                    .then(() => {
                    const candidateInterpreter_iter = (idx) => {
                        if (idx < LUA_INTERPRETER_CANDIDATES.getLenght()) {
                            const advanceCandidate = (err) => {
                                candidateInterpreter_iter(idx + 1);
                            };
                            const candidateInterpreterBasename = LUA_INTERPRETER_CANDIDATES.getItem(idx);
                            const interpreter = (0, node_path_1.join)(binDir, candidateInterpreterBasename);
                            (0, promises_1.stat)(interpreter)
                                .then(candidateInterpreterBasenameStat => {
                                if (candidateInterpreterBasenameStat.isFile()) {
                                    (0, ExecuteProcess_1.getFirstLineFromProcessExecution)(interpreter, ["-e", "print(_VERSION:sub(5))"], true)
                                        .then(luaVersion => {
                                        if (isGccLike) {
                                            this.getWindowsGccExternalDepsDirs()
                                                .then(externalDepsDirs => {
                                                const toolchainEnvVars = [
                                                    { key: "MAKE", value: ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getMake() },
                                                    { key: "CC", value: ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getCC() },
                                                    { key: "LD", value: ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLD() },
                                                    { key: "AR", value: ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getAR() },
                                                    { key: "STRIP", value: ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getSTRIP() },
                                                    { key: "RANLIB", value: ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getRANLIB() },
                                                    { key: "RC", value: ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getRC() }
                                                ];
                                                const configChanges = [
                                                    () => this.setLuaRocksConfigSetupOnWindows(luarocks, luaVersion, installDir),
                                                    () => this.setLuaRocksToolchainEnvVars(luarocks, toolchainEnvVars),
                                                    () => this.setEnvironmentVariablesOnGitHub(luarocks)
                                                ];
                                                const externalDepsDirsPromisesGen = (k) => {
                                                    return () => this.setLuaRocksConfig(luarocks, `external_deps_dirs[${k + 1}]`, externalDepsDirs[k]);
                                                };
                                                for (let idxExternalDepsDirs = 0; idxExternalDepsDirs < externalDepsDirs.length; idxExternalDepsDirs++) {
                                                    configChanges.push(externalDepsDirsPromisesGen(idxExternalDepsDirs));
                                                }
                                                (0, SequentialPromises_1.sequentialPromises)(configChanges)
                                                    .then(_values => {
                                                    resolve();
                                                })
                                                    .catch(advanceCandidate);
                                            })
                                                .catch(advanceCandidate);
                                        }
                                        else { /* MSVC */
                                            if (candidateInterpreterBasename === "luajit.exe") {
                                                /*
                                                ** For a LuaJIT build using MSVC,
                                                ** msvcbuild.bat only supports
                                                ** cl and link, not clang-cl.
                                                ** So, environment variables for
                                                ** different toolchains are not set.
                                                */
                                                (0, SequentialPromises_1.sequentialPromises)([
                                                    () => this.setLuaRocksConfigSetupOnWindows(luarocks, luaVersion, installDir),
                                                    () => this.setEnvironmentVariablesOnGitHub(luarocks)
                                                ])
                                                    .then(_values => {
                                                    resolve();
                                                })
                                                    .catch(advanceCandidate);
                                            }
                                            else {
                                                const toolchainEnvVars = [
                                                    { key: "MAKE", value: ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getMake() },
                                                    { key: "CC", value: ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getCC() },
                                                    { key: "LD", value: ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLD() },
                                                    { key: "AR", value: ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getAR() }
                                                ];
                                                (0, SequentialPromises_1.sequentialPromises)([
                                                    () => this.setLuaRocksConfigSetupOnWindows(luarocks, luaVersion, installDir),
                                                    () => this.setLuaRocksToolchainEnvVars(luarocks, toolchainEnvVars),
                                                    () => this.setEnvironmentVariablesOnGitHub(luarocks)
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
                const luarocks = (0, node_path_1.join)(binDir, "luarocks");
                const toolchainEnvVars = [
                    { key: "MAKE", value: ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getMake() },
                    { key: "CC", value: ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getCC() },
                    { key: "LD", value: ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLD() },
                    { key: "AR", value: ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getAR() },
                    { key: "STRIP", value: ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getSTRIP() },
                    { key: "RANLIB", value: ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getRANLIB() }
                ];
                (0, SequentialPromises_1.sequentialPromises)([
                    () => this.setLuaRocksToolchainEnvVars(luarocks, toolchainEnvVars),
                    () => this.setEnvironmentVariablesOnGitHub(luarocks)
                ])
                    .then(_values => {
                    resolve();
                })
                    .catch(reject);
            }
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Post install for LuaRocks ${this.project.getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
exports.LuaRocksPostInstallTarget = LuaRocksPostInstallTarget;


/***/ }),

/***/ 1146:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaRocksProject = void 0;
const node_path_1 = __nccwpck_require__(6760);
const GetSetProperty_1 = __nccwpck_require__(8195);
const TargetPipeline_1 = __nccwpck_require__(9348);
const LuaRocksCreateBuildDirectoriesTarget_1 = __nccwpck_require__(3038);
const LuaRocksBuildTarget_1 = __nccwpck_require__(8757);
const LuaRocksInstallTarget_1 = __nccwpck_require__(2614);
class LuaRocksProject {
    getVersion() {
        return this.version;
    }
    getBuildDir() {
        return this.buildDir;
    }
    getRemotePatchesBuildDir() {
        return this.remotePatchesBuildDir;
    }
    getInstallDir() {
        return this.installDir;
    }
    getToolchain() {
        return this.toolchain;
    }
    getInstallBinDir() {
        return this.installBinDir;
    }
    configurationResult() {
        return this._configurationResult;
    }
    buildResult() {
        return this._buildResult;
    }
    constructor(version, buildDir, installDir, toolchain) {
        this.version = version;
        this.buildDir = buildDir;
        this.installDir = installDir;
        this.toolchain = toolchain;
        this.remotePatchesBuildDir = (0, node_path_1.join)(this.buildDir, "remote-patches");
        this.installBinDir = (0, node_path_1.join)(installDir, "bin");
        this._configurationResult = new GetSetProperty_1.GetSetProperty(null);
        this._buildResult = new GetSetProperty_1.GetSetProperty(null);
    }
    configure() {
        return new Promise((resolve, reject) => {
            const initialConfigureTarget = new LuaRocksCreateBuildDirectoriesTarget_1.LuaRocksCreateBuildDirectoriesTarget(this, null);
            const pipeline = new TargetPipeline_1.TargetPipeline(initialConfigureTarget);
            pipeline.execute()
                .then(resolve)
                .catch(reject);
        });
    }
    build() {
        return new Promise((resolve, reject) => {
            const initialBuildTarget = new LuaRocksBuildTarget_1.LuaRocksBuildTarget(this, null, this.configurationResult().getValue());
            const pipeline = new TargetPipeline_1.TargetPipeline(initialBuildTarget);
            pipeline.execute()
                .then(resolve)
                .catch(reject);
        });
    }
    install() {
        return new Promise((resolve, reject) => {
            const initialInstallTarget = new LuaRocksInstallTarget_1.LuaRocksInstallTarget(this, null, this.buildResult().getValue());
            const pipeline = new TargetPipeline_1.TargetPipeline(initialInstallTarget);
            pipeline.execute()
                .then(resolve)
                .catch(reject);
        });
    }
}
exports.LuaRocksProject = LuaRocksProject;


/***/ }),

/***/ 3527:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LuaRocksRepositoryVersion = exports.LuaRocksReleaseVersion = exports.LuaRocksBaseVersion = void 0;
exports.parseLuaRocksVersion = parseLuaRocksVersion;
const node_os_1 = __nccwpck_require__(8161);
const LATEST_LUAROCKS = "3.12.2";
const LUAROCKS_RELEASES_WINDOWS_X86 = {
    "3.10.0": { "filename": "luarocks-3.10.0-windows-32.zip", "version": "3.10.0", "hash": { "algorithm": "sha256", "value": "51058b21221dd96642de16d8d17967086761409c257c6d6bb32741dc2243ce84" } },
    "3.11.0": { "filename": "luarocks-3.11.0-windows-32.zip", "version": "3.11.0", "hash": { "algorithm": "sha256", "value": "64014ff939510614c5836b678f121b39a626f56bc5c88366ccbc130deacd1637" } },
    "3.11.1": { "filename": "luarocks-3.11.1-windows-32.zip", "version": "3.11.1", "hash": { "algorithm": "sha256", "value": "44c7034d720a3767df964683722bd303311db9dabed11773dafbfa96add2eda7" } },
    "3.12.0": { "filename": "luarocks-3.12.0-windows-32.zip", "version": "3.12.0", "hash": { "algorithm": "sha256", "value": "f70344d7e88102ebe12c1b2b5c153f2e32fcaf663a90d12fb6cc2b994054ffe0" } },
    "3.12.1": { "filename": "luarocks-3.12.1-windows-32.zip", "version": "3.12.1", "hash": { "algorithm": "sha256", "value": "bf73b9f3576f20d47aeeaa5bee5adac8b4cd7ec3bae8534906735b2bd34bba3e" } },
    "3.12.2": { "filename": "luarocks-3.12.2-windows-32.zip", "version": "3.12.2", "hash": { "algorithm": "sha256", "value": "514f8a9700a98ec11a48adc21bb3afa8a8443018640e3221e124834f056bf6f4" } },
    "3.9.1": { "filename": "luarocks-3.9.1-windows-32.zip", "version": "3.9.1", "hash": { "algorithm": "sha256", "value": "1b473fd3b9494cec31d98f7642babf12cc832551fd69fb7081e8baf4c54e0fa5" } },
    "3.9.2": { "filename": "luarocks-3.9.2-windows-32.zip", "version": "3.9.2", "hash": { "algorithm": "sha256", "value": "e7bf11b9f7d3942db806b3f57d7dfacbe4f7a5b558f3e200b061a1d6e1f62255" } }
};
const LUAROCKS_RELEASES_WINDOWS_X64 = {
    "3.10.0": { "filename": "luarocks-3.10.0-windows-64.zip", "version": "3.10.0", "hash": { "algorithm": "sha256", "value": "fe0bc950187f67e22f237bc144e92a01993128749fd9adfc1764a6b4f4ca900d" } },
    "3.11.0": { "filename": "luarocks-3.11.0-windows-64.zip", "version": "3.11.0", "hash": { "algorithm": "sha256", "value": "a638ea4c8e858106e8e2598e50e9b3fd563c111b44c36d33fe0f0e64d9f42685" } },
    "3.11.1": { "filename": "luarocks-3.11.1-windows-64.zip", "version": "3.11.1", "hash": { "algorithm": "sha256", "value": "c71dba3d03e12305e9ccd022c621c8869aba3d124d9249e214aed5c16f3682a3" } },
    "3.12.0": { "filename": "luarocks-3.12.0-windows-64.zip", "version": "3.12.0", "hash": { "algorithm": "sha256", "value": "76aa3d4943e1d5204f311b232d6b6b72eb00027c54968643b5571d6ec56db57c" } },
    "3.12.1": { "filename": "luarocks-3.12.1-windows-64.zip", "version": "3.12.1", "hash": { "algorithm": "sha256", "value": "8106307ab7fd1a87cc4c6c7898b15231a35ed0353426e15eb0e060cd12ab34ad" } },
    "3.12.2": { "filename": "luarocks-3.12.2-windows-64.zip", "version": "3.12.2", "hash": { "algorithm": "sha256", "value": "d3f4ddda6926618cadf560170a7c18a5ceead5997ba10832cd0e3b624c7de886" } },
    "3.9.1": { "filename": "luarocks-3.9.1-windows-64.zip", "version": "3.9.1", "hash": { "algorithm": "sha256", "value": "f41218504c2c7a0335793cb5e0c0b2295972e261d38d21bdd4045a0c6fc1716d" } },
    "3.9.2": { "filename": "luarocks-3.9.2-windows-64.zip", "version": "3.9.2", "hash": { "algorithm": "sha256", "value": "ab7e34332eedd6270b97f44df462e4584d3a60377205d88ea2806ecc547f074f" } }
};
const LUAROCKS_RELEASES_UNIX = {
    /*"3.0.0": { "filename": "luarocks-3.0.0.tar.gz", "version": "3.0.0", "hash": { "algorithm": "sha256", "value": "a43fffb997100f11cccb529a3db5456ce8dab18171a5cb3645f948147b6f64a1" } },
    "3.0.1": { "filename": "luarocks-3.0.1.tar.gz", "version": "3.0.1", "hash": { "algorithm": "sha256", "value": "b989c4b60d6c9edcd65169e5e42fcffbd39cdbebe6b138fa5aea45102f8d9ec0" } },
    "3.0.2": { "filename": "luarocks-3.0.2.tar.gz", "version": "3.0.2", "hash": { "algorithm": "sha256", "value": "3836267eff2f85fb552234e966602b1e649c58f81f47c7de3785e071c8127f5a" } },
    "3.0.3": { "filename": "luarocks-3.0.3.tar.gz", "version": "3.0.3", "hash": { "algorithm": "sha256", "value": "f9a3fca236c87db55bc128a182ff605731ca15b43b1c4942d98f5e34acc88a6e" } },
    "3.0.4": { "filename": "luarocks-3.0.4.tar.gz", "version": "3.0.4", "hash": { "algorithm": "sha256", "value": "1236a307ca5c556c4fed9fdbd35a7e0e80ccf063024becc8c3bf212f37ff0edf" } },
    "3.1.0": { "filename": "luarocks-3.1.0.tar.gz", "version": "3.1.0", "hash": { "algorithm": "sha256", "value": "865eae1e49b0f701c955c1c8f7b6fae99287c9cef32227d64177509224908921" } },
    "3.1.1": { "filename": "luarocks-3.1.1.tar.gz", "version": "3.1.1", "hash": { "algorithm": "sha256", "value": "3c26c102f8e69f81e12ea39037c770a00b6244e115a4c832e7a92feffdfad1aa" } },
    "3.1.2": { "filename": "luarocks-3.1.2.tar.gz", "version": "3.1.2", "hash": { "algorithm": "sha256", "value": "72a3b74f05b7fd011eed894dc34193ee80b3235fe58016ac9ffdbfceecc88950" } },
    "3.1.3": { "filename": "luarocks-3.1.3.tar.gz", "version": "3.1.3", "hash": { "algorithm": "sha256", "value": "c573435f495aac159e34eaa0a3847172a2298eb6295fcdc35d565f9f9b990513" } },
    "3.2.0": { "filename": "luarocks-3.2.0.tar.gz", "version": "3.2.0", "hash": { "algorithm": "sha256", "value": "66c1848a25924917ddc1901e865add8f19f2585360c44a001a03a8c234d3e796" } },
    "3.2.1": { "filename": "luarocks-3.2.1.tar.gz", "version": "3.2.1", "hash": { "algorithm": "sha256", "value": "f27e20c9cdb3ffb991ccdb85796c36a0690566676f8e1a59b0d0ee6598907d04" } },
    "3.3.0": { "filename": "luarocks-3.3.0.tar.gz", "version": "3.3.0", "hash": { "algorithm": "sha256", "value": "8de54eb851f5245ed3708d94d8872e825b9704049d3ad4febe8e219f419b427d" } },
    "3.3.1": { "filename": "luarocks-3.3.1.tar.gz", "version": "3.3.1", "hash": { "algorithm": "sha256", "value": "eb20cd9814df05535d9aae98da532217c590fc07d48d90ca237e2a7cdcf284fe" } },
    "3.4.0": { "filename": "luarocks-3.4.0.tar.gz", "version": "3.4.0", "hash": { "algorithm": "sha256", "value": "62ce5826f0eeeb760d884ea8330cd1552b5d432138b8bade0fa72f35badd02d0" } },
    "3.5.0": { "filename": "luarocks-3.5.0.tar.gz", "version": "3.5.0", "hash": { "algorithm": "sha256", "value": "701d0cc0c7e97cc2cf2c2f4068fce45e52a8854f5dc6c9e49e2014202eec9a4f" } },
    "3.6.0": { "filename": "luarocks-3.6.0.tar.gz", "version": "3.6.0", "hash": { "algorithm": "sha256", "value": "b0eaf59e7711ca2a886722c0423dabe22ccbdcdf3a042c3f2615596879f8252f" } },
    "3.7.0": { "filename": "luarocks-3.7.0.tar.gz", "version": "3.7.0", "hash": { "algorithm": "sha256", "value": "9255d97fee95cec5b54fc6ac718b11bf5029e45bed7873e053314919cd448551" } },
    "3.8.0": { "filename": "luarocks-3.8.0.tar.gz", "version": "3.8.0", "hash": { "algorithm": "sha256", "value": "56ab9b90f5acbc42eb7a94cf482e6c058a63e8a1effdf572b8b2a6323a06d923" } },
    "3.9.0": { "filename": "luarocks-3.9.0.tar.gz", "version": "3.9.0", "hash": { "algorithm": "sha256", "value": "5e840f0224891de96be4139e9475d3b1de7af3a32b95c1bdf05394563c60175f" } },
    */ "3.9.1": { "filename": "luarocks-3.9.1.tar.gz", "version": "3.9.1", "hash": { "algorithm": "sha256", "value": "ffafd83b1c42aa38042166a59ac3b618c838ce4e63f4ace9d961a5679ef58253" } },
    "3.9.2": { "filename": "luarocks-3.9.2.tar.gz", "version": "3.9.2", "hash": { "algorithm": "sha256", "value": "bca6e4ecc02c203e070acdb5f586045d45c078896f6236eb46aa33ccd9b94edb" } },
    "3.10.0": { "filename": "luarocks-3.10.0.tar.gz", "version": "3.10.0", "hash": { "algorithm": "sha256", "value": "e9bf06d5ec6b8ecc6dbd1530d2d77bdb3377d814a197c46388e9f148548c1c89" } },
    "3.11.0": { "filename": "luarocks-3.11.0.tar.gz", "version": "3.11.0", "hash": { "algorithm": "sha256", "value": "25f56b3c7272fb35b869049371d649a1bbe668a56d24df0a66e3712e35dd44a6" } },
    "3.11.1": { "filename": "luarocks-3.11.1.tar.gz", "version": "3.11.1", "hash": { "algorithm": "sha256", "value": "c3fb3d960dffb2b2fe9de7e3cb004dc4d0b34bb3d342578af84f84325c669102" } },
    "3.12.0": { "filename": "luarocks-3.12.0.tar.gz", "version": "3.12.0", "hash": { "algorithm": "sha256", "value": "3d4c8acddf9b975e77da68cbf748d5baf483d0b6e9d703a844882db25dd61cdf" } },
    "3.12.1": { "filename": "luarocks-3.12.1.tar.gz", "version": "3.12.1", "hash": { "algorithm": "sha256", "value": "f56b85a2a7a481f0321845807b79a05237860b04e4a9d186da632770029b3290" } },
    "3.12.2": { "filename": "luarocks-3.12.2.tar.gz", "version": "3.12.2", "hash": { "algorithm": "sha256", "value": "b0e0c85205841ddd7be485f53d6125766d18a81d226588d2366931e9a1484492" } }
};
function parseLuaRocksVersion(version) {
    return new Promise((resolve, reject) => {
        const luaRocksVersion = version === "" ? LATEST_LUAROCKS : version;
        if (luaRocksVersion === "none") {
            resolve(undefined);
        }
        else if (process.platform === 'win32') {
            const osArch = (0, node_os_1.arch)();
            if (osArch === 'ia32' || osArch === 'arm64') {
                if (luaRocksVersion in LUAROCKS_RELEASES_WINDOWS_X86) {
                    const zipInfo = LUAROCKS_RELEASES_WINDOWS_X86[luaRocksVersion];
                    const downloadUrl = "https://luarocks.github.io/luarocks/releases/" + zipInfo.filename;
                    const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(luaRocksVersion);
                    if (match) {
                        const major = Number(match[1]);
                        const minor = Number(match[2]);
                        const patch = Number(match[3]);
                        const hash = zipInfo.hash;
                        resolve(new LuaRocksReleaseVersion(major, minor, patch, downloadUrl, hash.algorithm, hash.value));
                    }
                    else {
                        reject(new Error("Internal error: regex mismatch for a LuaRocks release version"));
                    }
                }
                else {
                    reject(new Error("LuaRocks version is too old"));
                }
            }
            else if (osArch === 'x64') {
                if (luaRocksVersion in LUAROCKS_RELEASES_WINDOWS_X64) {
                    const zipInfo = LUAROCKS_RELEASES_WINDOWS_X64[luaRocksVersion];
                    const downloadUrl = "https://luarocks.github.io/luarocks/releases/" + zipInfo.filename;
                    const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(luaRocksVersion);
                    if (match) {
                        const major = Number(match[1]);
                        const minor = Number(match[2]);
                        const patch = Number(match[3]);
                        const hash = zipInfo.hash;
                        resolve(new LuaRocksReleaseVersion(major, minor, patch, downloadUrl, hash.algorithm, hash.value));
                    }
                    else {
                        reject(new Error("Internal error: regex mismatch for a LuaRocks release version"));
                    }
                }
                else {
                    reject(new Error("LuaRocks version is too old"));
                }
            }
            else {
                reject(new Error("Unsupported architecture to install LuaRocks on Windows"));
            }
        }
        else if (luaRocksVersion.startsWith("@")) {
            const ref = luaRocksVersion.substring(1);
            const downloadUrl = `https://github.com/luarocks/luarocks/archive/${ref}.tar.gz`;
            resolve(new LuaRocksRepositoryVersion(ref, downloadUrl));
        }
        else if (luaRocksVersion in LUAROCKS_RELEASES_UNIX) {
            const tarballInfo = LUAROCKS_RELEASES_UNIX[luaRocksVersion];
            const downloadUrl = "https://luarocks.github.io/luarocks/releases/" + tarballInfo.filename;
            const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(luaRocksVersion);
            if (match) {
                const major = Number(match[1]);
                const minor = Number(match[2]);
                const patch = Number(match[3]);
                const hash = tarballInfo.hash;
                resolve(new LuaRocksReleaseVersion(major, minor, patch, downloadUrl, hash.algorithm, hash.value));
            }
            else {
                reject(new Error("Internal error: regex mismatch for a LuaRocks release version"));
            }
        }
        else {
            reject(new Error("Unknown LuaRocks version to install on Unix-like systems"));
        }
    });
}
class LuaRocksBaseVersion {
    getIdentifier() {
        return this.identifier;
    }
    getDownloadUrl() {
        return this.downloadUrl;
    }
    constructor(identifier, downloadUrl) {
        this.identifier = identifier;
        this.downloadUrl = downloadUrl;
    }
}
exports.LuaRocksBaseVersion = LuaRocksBaseVersion;
class LuaRocksReleaseVersion extends LuaRocksBaseVersion {
    getMajor() {
        return this.major;
    }
    getMinor() {
        return this.minor;
    }
    getPatch() {
        return this.patch;
    }
    getHashAlgorithm() {
        return this.hashAlgorithm;
    }
    getHashValue() {
        return this.hashValue;
    }
    constructor(major, minor, patch, downloadUrl, hashAlgorithm, hashValue) {
        super(`${major}.${minor}.${patch}`, downloadUrl);
        this.major = major;
        this.minor = minor;
        this.patch = patch;
        this.hashAlgorithm = hashAlgorithm;
        this.hashValue = hashValue;
    }
}
exports.LuaRocksReleaseVersion = LuaRocksReleaseVersion;
class LuaRocksRepositoryVersion extends LuaRocksBaseVersion {
    constructor(identifier, downloadUrl) {
        super(identifier, downloadUrl);
    }
}
exports.LuaRocksRepositoryVersion = LuaRocksRepositoryVersion;


/***/ }),

/***/ 6084:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaArchiveStaticLibTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const IGccLikeToolchain_1 = __nccwpck_require__(9372);
const PucLuaCompileInterpreterTarget_1 = __nccwpck_require__(9202);
const Console_1 = __nccwpck_require__(946);
class PucLuaArchiveStaticLibTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
        this.objFiles = parent.getStaticLibObjectFiles();
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Archive Lua ${this.project.getVersion().getString()} static library`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new PucLuaCompileInterpreterTarget_1.PucLuaCompileInterpreterTarget(this.project, this);
    }
    getStaticLibObjectFiles() {
        return this.objFiles;
    }
    getStaticLibrary() {
        return this.staticLibrary;
    }
    getSourcesInfo() {
        return this.parent.getSourcesInfo();
    }
    getSharedLibrary() {
        return this.parent.getSharedLibrary();
    }
    getImportLibrary() {
        return this.parent.getImportLibrary();
    }
    execute() {
        return new Promise((resolve, reject) => {
            const version = this.project.getVersion();
            const libName = `lua${version.getMajor()}${version.getMinor()}`;
            const toolchain = this.project.getToolchain();
            const archiver = toolchain.getArchiver();
            const isGccLike = (0, IGccLikeToolchain_1.isGccLikeToolchain)(toolchain);
            const archivePrefix = isGccLike ? "lib" : "";
            const archiveSuffix = isGccLike ? "" : "-static";
            const archiveExt = archiver.getArchiveExtension();
            const archiveName = `${archivePrefix}${libName}${archiveSuffix}${archiveExt}`;
            const archive = (0, node_path_1.join)(this.project.getStaticLibBuildDir(), archiveName);
            archiver.reset();
            if (isGccLike) {
                archiver.addFlag("cru");
            }
            const len = this.objFiles.getLenght();
            for (let i = 0; i < len; i++) {
                archiver.addInputFile(this.objFiles.getItem(i));
            }
            archiver.setOutputFile(archive);
            archiver.execute()
                .then(() => {
                if (isGccLike) {
                    const gccLikeToolchain = toolchain;
                    const ranlib = gccLikeToolchain.getRanlib();
                    ranlib.reset();
                    ranlib.setInputFile(archive);
                    ranlib.execute()
                        .then(() => {
                        this.staticLibrary = archive;
                        resolve();
                    })
                        .catch(reject);
                }
                else {
                    this.staticLibrary = archive;
                    resolve();
                }
            })
                .catch(reject);
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Archive Lua ${this.project.getVersion().getString()} static library`);
            resolve();
        });
    }
}
exports.PucLuaArchiveStaticLibTarget = PucLuaArchiveStaticLibTarget;


/***/ }),

/***/ 3988:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaBuildInfo = void 0;
class PucLuaBuildInfo {
    constructor(sourcesInfo, sharedLibrary, staticLibrary, interpreter, compiler, pkgConfigFile, importLibrary) {
        this.sourcesInfo = sourcesInfo;
        this.sharedLibrary = sharedLibrary;
        this.staticLibrary = staticLibrary;
        this.interpreter = interpreter;
        this.compiler = compiler;
        this.pkgConfigFile = pkgConfigFile;
        this.importLibrary = importLibrary;
    }
    getSourcesInfo() {
        return this.sourcesInfo;
    }
    getSharedLibrary() {
        return this.sharedLibrary;
    }
    getStaticLibrary() {
        return this.staticLibrary;
    }
    getInterpreter() {
        return this.interpreter;
    }
    getCompiler() {
        return this.compiler;
    }
    getPkgConfigFile() {
        return this.pkgConfigFile;
    }
    getImportLibrary() {
        return this.importLibrary;
    }
}
exports.PucLuaBuildInfo = PucLuaBuildInfo;


/***/ }),

/***/ 5509:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaCompileCompilerTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const ReadOnlyArray_1 = __nccwpck_require__(2483);
const PucLuaLinkCompilerTarget_1 = __nccwpck_require__(7782);
const IGccLikeToolchain_1 = __nccwpck_require__(9372);
const PucLuaVersion_1 = __nccwpck_require__(5991);
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
const Console_1 = __nccwpck_require__(946);
class PucLuaCompileCompilerTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
        this.sourcesInfo = parent.getSourcesInfo();
        this.rawCompilerObjectFiles = [];
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Compile Lua ${this.project.getVersion().getString()} compiler`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new PucLuaLinkCompilerTarget_1.PucLuaLinkCompilerTarget(this.project, this);
    }
    getCompilerObjectFiles() {
        return new ReadOnlyArray_1.ReadOnlyArray(this.rawCompilerObjectFiles);
    }
    getStaticLibrary() {
        return this.parent.getStaticLibrary();
    }
    getSourcesInfo() {
        return this.parent.getSourcesInfo();
    }
    getSharedLibrary() {
        return this.parent.getSharedLibrary();
    }
    getImportLibrary() {
        return this.parent.getImportLibrary();
    }
    getInterpreter() {
        return this.parent.getInterpreter();
    }
    execute() {
        return new Promise((resolve, reject) => {
            this.rawCompilerObjectFiles.splice(0, this.rawCompilerObjectFiles.length);
            const version = this.project.getVersion();
            const toolchain = this.project.getToolchain();
            const isGccLike = (0, IGccLikeToolchain_1.isGccLikeToolchain)(toolchain);
            const compiler = toolchain.getCompiler();
            const objExt = compiler.getObjectFileExtension();
            const compilerSrcFiles = this.sourcesInfo.getCompilerSrcFiles();
            const len = compilerSrcFiles.getLenght();
            const file_iter = (i) => {
                if (i < len) {
                    const file = compilerSrcFiles.getItem(i);
                    compiler.reset();
                    if (isGccLike) {
                        const compilerPath = compiler.path().getValue() || "";
                        const compilerName = (0, node_path_1.basename)(compilerPath, (0, node_path_1.extname)(compilerPath)).toLowerCase();
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
                    else if (process.platform === 'freebsd' || process.platform === 'netbsd' || process.platform === 'openbsd') {
                        if (version.compareTo(PucLuaVersion_1.LUA_53_VERSION) >= 0) {
                            compiler.addDefine("LUA_USE_LINUX");
                        }
                        if (version.compareTo(PucLuaVersion_1.LUA_54_VERSION) >= 0) {
                            compiler.addDefine("LUA_USE_READLINE");
                        }
                        compiler.addIncludeDir("/usr/include/edit");
                    }
                    else if (process.platform === 'cygwin') {
                        compiler.addDefine("LUA_USE_LINUX");
                    }
                    const compatFlag = this.sourcesInfo.getCompatFlag();
                    if (compatFlag) {
                        compiler.addDefine(compatFlag);
                    }
                    compiler.addIncludeDir(this.sourcesInfo.getHeadersDir());
                    const fileBaseName = (0, node_path_1.basename)(file);
                    const outputFile = (0, node_path_1.join)(this.project.getCompilerBuildDir(), fileBaseName.substring(0, fileBaseName.length - 2) + objExt);
                    compiler.setOutputFile(outputFile);
                    compiler.setInputFile(file);
                    const incDirsExtra = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getIncDirsExtra();
                    for (const incDir of incDirsExtra) {
                        compiler.addIncludeDir(incDir);
                    }
                    const cflagsExtra = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getCflagsExtra();
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
            };
            file_iter(0);
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Compile Lua ${this.project.getVersion().getString()} compiler`);
            resolve();
        });
    }
}
exports.PucLuaCompileCompilerTarget = PucLuaCompileCompilerTarget;


/***/ }),

/***/ 9202:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaCompileInterpreterTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const PucLuaVersion_1 = __nccwpck_require__(5991);
const ReadOnlyArray_1 = __nccwpck_require__(2483);
const PucLuaLinkInterpreterTarget_1 = __nccwpck_require__(2011);
const IGccLikeToolchain_1 = __nccwpck_require__(9372);
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
const Console_1 = __nccwpck_require__(946);
class PucLuaCompileInterpreterTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
        this.sourcesInfo = parent.getSourcesInfo();
        this.rawInterpreterObjectFiles = [];
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Compile Lua ${this.project.getVersion().getString()} interpreter`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new PucLuaLinkInterpreterTarget_1.PucLuaLinkInterpreterTarget(this.project, this);
    }
    getInterpreterObjectFiles() {
        return new ReadOnlyArray_1.ReadOnlyArray(this.rawInterpreterObjectFiles);
    }
    getStaticLibrary() {
        return this.parent.getStaticLibrary();
    }
    getSourcesInfo() {
        return this.parent.getSourcesInfo();
    }
    getSharedLibrary() {
        return this.parent.getSharedLibrary();
    }
    getImportLibrary() {
        return this.parent.getImportLibrary();
    }
    execute() {
        return new Promise((resolve, reject) => {
            this.rawInterpreterObjectFiles.splice(0, this.rawInterpreterObjectFiles.length);
            const version = this.project.getVersion();
            const toolchain = this.project.getToolchain();
            const isGccLike = (0, IGccLikeToolchain_1.isGccLikeToolchain)(toolchain);
            const compiler = toolchain.getCompiler();
            const objExt = compiler.getObjectFileExtension();
            const interpreterSrcFiles = this.sourcesInfo.getInterpreterSrcFiles();
            const len = interpreterSrcFiles.getLenght();
            const file_iter = (i) => {
                if (i < len) {
                    const file = interpreterSrcFiles.getItem(i);
                    compiler.reset();
                    if (isGccLike) {
                        const compilerPath = compiler.path().getValue() || "";
                        const compilerName = (0, node_path_1.basename)(compilerPath, (0, node_path_1.extname)(compilerPath)).toLowerCase();
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
                    else if (process.platform === 'freebsd' || process.platform === 'netbsd' || process.platform === 'openbsd') {
                        if (version.compareTo(PucLuaVersion_1.LUA_53_VERSION) >= 0) {
                            compiler.addDefine("LUA_USE_LINUX");
                        }
                        if (version.compareTo(PucLuaVersion_1.LUA_54_VERSION) >= 0) {
                            compiler.addDefine("LUA_USE_READLINE");
                        }
                        compiler.addIncludeDir("/usr/include/edit");
                    }
                    else if (process.platform === 'cygwin') {
                        compiler.addDefine("LUA_USE_LINUX");
                    }
                    const compatFlag = this.sourcesInfo.getCompatFlag();
                    if (compatFlag) {
                        compiler.addDefine(compatFlag);
                    }
                    compiler.addIncludeDir(this.sourcesInfo.getHeadersDir());
                    const fileBaseName = (0, node_path_1.basename)(file);
                    const outputFile = (0, node_path_1.join)(this.project.getInterpreterBuildDir(), fileBaseName.substring(0, fileBaseName.length - 2) + objExt);
                    compiler.setOutputFile(outputFile);
                    compiler.setInputFile(file);
                    const incDirsExtra = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getIncDirsExtra();
                    for (const incDir of incDirsExtra) {
                        compiler.addIncludeDir(incDir);
                    }
                    const cflagsExtra = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getCflagsExtra();
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
            };
            file_iter(0);
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Compile Lua ${this.project.getVersion().getString()} interpreter`);
            resolve();
        });
    }
}
exports.PucLuaCompileInterpreterTarget = PucLuaCompileInterpreterTarget;


/***/ }),

/***/ 1424:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaCompileSharedLibTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const ReadOnlyArray_1 = __nccwpck_require__(2483);
const PucLuaLinkSharedLibTarget_1 = __nccwpck_require__(7493);
const IGccLikeToolchain_1 = __nccwpck_require__(9372);
const PucLuaVersion_1 = __nccwpck_require__(5991);
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
const Console_1 = __nccwpck_require__(946);
class PucLuaCompileSharedLibTarget {
    constructor(project, parent, sourcesInfo) {
        this.project = project;
        this.parent = parent;
        this.sourcesInfo = sourcesInfo;
        this.rawSharedLibObjectFiles = [];
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Compile Lua ${this.project.getVersion().getString()} shared library`);
            resolve();
        });
    }
    getSourcesInfo() {
        return this.sourcesInfo;
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new PucLuaLinkSharedLibTarget_1.PucLuaLinkSharedLibTarget(this.project, this);
    }
    getSharedLibObjectFiles() {
        return new ReadOnlyArray_1.ReadOnlyArray(this.rawSharedLibObjectFiles);
    }
    execute() {
        return new Promise((resolve, reject) => {
            this.rawSharedLibObjectFiles.splice(0, this.rawSharedLibObjectFiles.length);
            const version = this.project.getVersion();
            const toolchain = this.project.getToolchain();
            const isGccLike = (0, IGccLikeToolchain_1.isGccLikeToolchain)(toolchain);
            const compiler = toolchain.getCompiler();
            const objExt = compiler.getObjectFileExtension();
            const libSrcFiles = this.sourcesInfo.getLibSrcFiles();
            const len = libSrcFiles.getLenght();
            const file_iter = (i) => {
                if (i < len) {
                    const file = libSrcFiles.getItem(i);
                    compiler.reset();
                    if (isGccLike) {
                        const compilerPath = compiler.path().getValue() || "";
                        const compilerName = (0, node_path_1.basename)(compilerPath, (0, node_path_1.extname)(compilerPath)).toLowerCase();
                        if (["gcc", "cc", "clang"].includes(compilerName)) {
                            compiler.addFlag("-std=gnu99");
                        }
                    }
                    compiler.setSpeedOptimizationSwitch();
                    compiler.setWarningSwitch();
                    if (process.platform === 'win32') {
                        if (isGccLike) {
                            if (version.compareTo(PucLuaVersion_1.LUA_52_VERSION) >= 0) {
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
                    else if (process.platform === 'freebsd' || process.platform === 'netbsd' || process.platform === 'openbsd') {
                        if (version.compareTo(PucLuaVersion_1.LUA_53_VERSION) >= 0) {
                            compiler.addDefine("LUA_USE_LINUX");
                        }
                        if (version.compareTo(PucLuaVersion_1.LUA_54_VERSION) >= 0) {
                            compiler.addDefine("LUA_USE_READLINE");
                        }
                        compiler.addIncludeDir("/usr/include/edit");
                    }
                    else if (process.platform === 'cygwin') {
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
                    const fileBaseName = (0, node_path_1.basename)(file);
                    const outputFile = (0, node_path_1.join)(this.project.getSharedLibBuildDir(), fileBaseName.substring(0, fileBaseName.length - 2) + objExt);
                    compiler.setOutputFile(outputFile);
                    compiler.setInputFile(file);
                    const incDirsExtra = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getIncDirsExtra();
                    for (const incDir of incDirsExtra) {
                        compiler.addIncludeDir(incDir);
                    }
                    const cflagsExtra = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getCflagsExtra();
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
            };
            file_iter(0);
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Compile Lua ${this.project.getVersion().getString()} shared library`);
            resolve();
        });
    }
}
exports.PucLuaCompileSharedLibTarget = PucLuaCompileSharedLibTarget;


/***/ }),

/***/ 9285:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaCompileStaticLibTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const ReadOnlyArray_1 = __nccwpck_require__(2483);
const PucLuaArchiveStaticLibTarget_1 = __nccwpck_require__(6084);
const IGccLikeToolchain_1 = __nccwpck_require__(9372);
const PucLuaVersion_1 = __nccwpck_require__(5991);
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
const Console_1 = __nccwpck_require__(946);
class PucLuaCompileStaticLibTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
        this.sourcesInfo = parent.getSourcesInfo();
        this.rawStaticLibObjectFiles = [];
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Compile Lua ${this.project.getVersion().getString()} static library`);
            resolve();
        });
    }
    getSourcesInfo() {
        return this.sourcesInfo;
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new PucLuaArchiveStaticLibTarget_1.PucLuaArchiveStaticLibTarget(this.project, this);
    }
    getStaticLibObjectFiles() {
        return new ReadOnlyArray_1.ReadOnlyArray(this.rawStaticLibObjectFiles);
    }
    getSharedLibrary() {
        return this.parent.getSharedLibrary();
    }
    getImportLibrary() {
        return this.parent.getImportLibrary();
    }
    execute() {
        return new Promise((resolve, reject) => {
            this.rawStaticLibObjectFiles.splice(0, this.rawStaticLibObjectFiles.length);
            const version = this.project.getVersion();
            const toolchain = this.project.getToolchain();
            const isGccLike = (0, IGccLikeToolchain_1.isGccLikeToolchain)(toolchain);
            const compiler = toolchain.getCompiler();
            const objExt = compiler.getObjectFileExtension();
            const libSrcFiles = this.sourcesInfo.getLibSrcFiles();
            const len = libSrcFiles.getLenght();
            const file_iter = (i) => {
                if (i < len) {
                    const file = libSrcFiles.getItem(i);
                    compiler.reset();
                    if (isGccLike) {
                        const compilerPath = compiler.path().getValue() || "";
                        const compilerName = (0, node_path_1.basename)(compilerPath, (0, node_path_1.extname)(compilerPath)).toLowerCase();
                        if (["gcc", "cc", "clang"].includes(compilerName)) {
                            compiler.addFlag("-std=gnu99");
                        }
                    }
                    compiler.setSpeedOptimizationSwitch();
                    compiler.setWarningSwitch();
                    if (process.platform === 'win32') {
                        if (isGccLike) {
                            if (version.compareTo(PucLuaVersion_1.LUA_52_VERSION) >= 0) {
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
                    else if (process.platform === 'freebsd' || process.platform === 'netbsd' || process.platform === 'openbsd') {
                        if (version.compareTo(PucLuaVersion_1.LUA_53_VERSION) >= 0) {
                            compiler.addDefine("LUA_USE_LINUX");
                        }
                        if (version.compareTo(PucLuaVersion_1.LUA_54_VERSION) >= 0) {
                            compiler.addDefine("LUA_USE_READLINE");
                        }
                        compiler.addIncludeDir("/usr/include/edit");
                    }
                    else if (process.platform === 'cygwin') {
                        compiler.addDefine("LUA_USE_LINUX");
                    }
                    const compatFlag = this.sourcesInfo.getCompatFlag();
                    if (compatFlag) {
                        compiler.addDefine(compatFlag);
                    }
                    compiler.addIncludeDir(this.sourcesInfo.getHeadersDir());
                    const fileBaseName = (0, node_path_1.basename)(file);
                    const outputFile = (0, node_path_1.join)(this.project.getStaticLibBuildDir(), fileBaseName.substring(0, fileBaseName.length - 2) + objExt);
                    compiler.setOutputFile(outputFile);
                    compiler.setInputFile(file);
                    const incDirsExtra = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getIncDirsExtra();
                    for (const incDir of incDirsExtra) {
                        compiler.addIncludeDir(incDir);
                    }
                    const cflagsExtra = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getCflagsExtra();
                    for (const cflag of cflagsExtra) {
                        compiler.addFlag(cflag);
                    }
                    compiler.execute()
                        .then(() => {
                        this.rawStaticLibObjectFiles.push(outputFile);
                        file_iter(i + 1);
                    })
                        .catch(reject);
                }
                else {
                    resolve();
                }
            };
            file_iter(0);
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Compile Lua ${this.project.getVersion().getString()} static library`);
            resolve();
        });
    }
}
exports.PucLuaCompileStaticLibTarget = PucLuaCompileStaticLibTarget;


/***/ }),

/***/ 1233:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaCreatePkgConfigTarget = void 0;
const promises_1 = __nccwpck_require__(1455);
const node_path_1 = __nccwpck_require__(6760);
const PucLuaBuildInfo_1 = __nccwpck_require__(3988);
const IGccLikeToolchain_1 = __nccwpck_require__(9372);
const PucLuaFinishBuildingTarget_1 = __nccwpck_require__(9496);
const Console_1 = __nccwpck_require__(946);
class PucLuaCreatePkgConfigTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Create pkgconfig file for Lua ${this.project.getVersion().getString()} building`);
            resolve();
        });
    }
    getNext() {
        return new PucLuaFinishBuildingTarget_1.PucLuaFinishBuildingTarget(this.project, this);
    }
    setBuildResult() {
        this.project.buildResult().setValue(new PucLuaBuildInfo_1.PucLuaBuildInfo(this.parent.getSourcesInfo(), this.parent.getSharedLibrary(), this.parent.getStaticLibrary(), this.parent.getInterpreter(), this.parent.getCompiler(), this.pkgConfig, this.parent.getImportLibrary()));
    }
    execute() {
        return new Promise((resolve, reject) => {
            const lines = [];
            const version = this.project.getVersion();
            const compatFlag = this.parent.getSourcesInfo().getCompatFlag();
            const libname = `lua${version.getMajor()}${version.getMinor()}`;
            let prefix = this.project.getInstallDir();
            let incdir = this.project.getInstallIncludeDir();
            let bindir = this.project.getInstallBinDir();
            let libdir = this.project.getInstallLibDir();
            let lmod = this.project.getInstallLuaModulesDir();
            let cmod = this.project.getInstallCModulesDir();
            let mandir = this.project.getInstallManDir();
            if (process.platform === "win32") {
                prefix = prefix.replace(/\\/g, "/");
                incdir = incdir.replace(/\\/g, "/");
                bindir = bindir.replace(/\\/g, "/");
                libdir = libdir.replace(/\\/g, "/");
                lmod = lmod.replace(/\\/g, "/");
                cmod = cmod.replace(/\\/g, "/");
                mandir = mandir.replace(/\\/g, "/");
            }
            lines.push(`prefix=${prefix}`);
            lines.push(`exec_prefix=${prefix}`);
            lines.push(`lib_name=${libname}`);
            lines.push(`includedir=${incdir}`);
            lines.push(`bindir=${bindir}`);
            lines.push(`libdir=${libdir}`);
            lines.push(`V=${version.getMajor()}.${version.getMinor()}`);
            lines.push(`R=${version.getString()}`);
            lines.push("");
            lines.push(`INSTALL_BIN=${bindir}`);
            lines.push(`INSTALL_INC=${incdir}`);
            lines.push(`INSTALL_LIB=${libdir}`);
            lines.push(`INSTALL_MAN=${mandir}`);
            lines.push(`INSTALL_LMOD=${lmod}`);
            lines.push(`INSTALL_CMOD=${cmod}`);
            lines.push("");
            lines.push("Name: Lua");
            lines.push("Description: An Extensible Extension Language");
            lines.push("Version: ${R}");
            lines.push("Requires:");
            lines.push("Libs: -L${libdir} -l${lib_name}");
            let syslibs = '';
            if (process.platform === 'win32') {
                const toolchain = this.project.getToolchain();
                if ((0, IGccLikeToolchain_1.isGccLikeToolchain)(toolchain)) {
                    syslibs = "-lm";
                }
            }
            else if (process.platform === 'linux' || process.platform === 'cygwin') {
                syslibs = "-lm -ldl -lreadline";
            }
            else if (process.platform === "darwin") {
                syslibs = "-lm -lreadline";
            }
            else if (process.platform === 'freebsd' || process.platform === 'netbsd' || process.platform === 'openbsd') {
                syslibs = "-lm -ledit";
            }
            else if (process.platform === 'sunos' || process.platform === 'aix') {
                syslibs = '-lm -ldl';
            }
            lines.push(`Libs.private: ${syslibs}`);
            if (compatFlag) {
                lines.push("Cflags: -I${includedir} " + `-D${compatFlag}`);
            }
            else {
                lines.push("Cflags: -I${includedir}");
            }
            const pkgConfigFileName = (0, node_path_1.join)(this.project.getSharedLibBuildDir(), `${libname}.pc`);
            (0, promises_1.writeFile)(pkgConfigFileName, lines.join("\n"), { encoding: "utf8" })
                .then(() => {
                this.pkgConfig = pkgConfigFileName;
                this.setBuildResult();
                resolve();
            })
                .catch(reject);
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Create pkgconfig file for Lua ${this.project.getVersion().getString()} building`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
}
exports.PucLuaCreatePkgConfigTarget = PucLuaCreatePkgConfigTarget;


/***/ }),

/***/ 9496:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaFinishBuildingTarget = void 0;
const Console_1 = __nccwpck_require__(946);
class PucLuaFinishBuildingTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Finish the build of Lua ${this.project.getVersion().getString()}`);
            resolve();
        });
    }
    getNext() {
        return null;
    }
    execute() {
        return new Promise((resolve, reject) => {
            const buildInfo = this.project.buildResult().getValue();
            Console_1.Console.instance().writeLine(`Shared Library: ${buildInfo.getSharedLibrary()}`);
            Console_1.Console.instance().writeLine(`Static Library: ${buildInfo.getStaticLibrary()}`);
            Console_1.Console.instance().writeLine(`Interpreter: ${buildInfo.getInterpreter()}`);
            Console_1.Console.instance().writeLine(`Compiler: ${buildInfo.getCompiler()}`);
            Console_1.Console.instance().writeLine(`PkgConfig: ${buildInfo.getPkgConfigFile()}`);
            const impLib = buildInfo.getImportLibrary();
            if (impLib) {
                Console_1.Console.instance().writeLine(`Import Library: ${impLib}`);
            }
            resolve();
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Finish the build of Lua ${this.project.getVersion().getString()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
}
exports.PucLuaFinishBuildingTarget = PucLuaFinishBuildingTarget;


/***/ }),

/***/ 7782:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaLinkCompilerTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const IGccLikeToolchain_1 = __nccwpck_require__(9372);
const PucLuaCreatePkgConfigTarget_1 = __nccwpck_require__(1233);
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
const Console_1 = __nccwpck_require__(946);
class PucLuaLinkCompilerTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
        this.objFiles = parent.getCompilerObjectFiles();
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Link Lua ${this.project.getVersion().getString()} compiler`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new PucLuaCreatePkgConfigTarget_1.PucLuaCreatePkgConfigTarget(this.project, this);
    }
    getStaticLibrary() {
        return this.parent.getStaticLibrary();
    }
    getSourcesInfo() {
        return this.parent.getSourcesInfo();
    }
    getSharedLibrary() {
        return this.parent.getSharedLibrary();
    }
    getImportLibrary() {
        return this.parent.getImportLibrary();
    }
    getInterpreter() {
        return this.parent.getInterpreter();
    }
    getCompiler() {
        return this.compiler;
    }
    execute() {
        return new Promise((resolve, reject) => {
            const toolchain = this.project.getToolchain();
            const linker = toolchain.getLinker();
            linker.reset();
            const isGccLike = (0, IGccLikeToolchain_1.isGccLikeToolchain)(toolchain);
            const compilerExt = (process.platform === 'win32' || process.platform === 'cygwin') ? ".exe" : "";
            const compilerFile = (0, node_path_1.join)(this.project.getCompilerBuildDir(), `luac${compilerExt}`);
            const version = this.project.getVersion();
            linker.setOutputFile(compilerFile);
            const len = this.objFiles.getLenght();
            for (let i = 0; i < len; i++) {
                linker.addObjectFile(this.objFiles.getItem(i));
            }
            if (process.platform === 'win32' || process.platform === 'cygwin') {
                linker.addLibrary(this.parent.getStaticLibrary());
                if (isGccLike) {
                    linker.addLinkLibrary("m");
                }
            }
            else {
                linker.addLinkLibrary("m");
                linker.addLibrary(this.parent.getStaticLibrary());
                if (process.platform === 'freebsd' || process.platform === 'netbsd' || process.platform === 'openbsd') {
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
                else if (process.platform === 'darwin') {
                    linker.addLinkLibrary("readline");
                }
                else if (process.platform === "sunos") {
                    linker.addLinkLibrary("dl");
                }
                else {
                    linker.addLinkLibrary("dl");
                }
            }
            const libDirs = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLibDirsExtra();
            for (const libDir of libDirs) {
                linker.addLibDir(libDir);
            }
            const libs = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLibsExtra();
            for (const lib of libs) {
                linker.addLinkLibrary(lib);
            }
            const ldFlags = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLdFlagsExtra();
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
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Link Lua ${this.project.getVersion().getString()} compiler`);
            resolve();
        });
    }
}
exports.PucLuaLinkCompilerTarget = PucLuaLinkCompilerTarget;


/***/ }),

/***/ 2011:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaLinkInterpreterTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const IGccLikeToolchain_1 = __nccwpck_require__(9372);
const PucLuaCompileCompilerTarget_1 = __nccwpck_require__(5509);
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
const Console_1 = __nccwpck_require__(946);
class PucLuaLinkInterpreterTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
        this.objFiles = parent.getInterpreterObjectFiles();
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Link Lua ${this.project.getVersion().getString()} interpreter`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new PucLuaCompileCompilerTarget_1.PucLuaCompileCompilerTarget(this.project, this);
    }
    getStaticLibrary() {
        return this.parent.getStaticLibrary();
    }
    getSourcesInfo() {
        return this.parent.getSourcesInfo();
    }
    getSharedLibrary() {
        return this.parent.getSharedLibrary();
    }
    getImportLibrary() {
        return this.parent.getImportLibrary();
    }
    getInterpreter() {
        return this.interpreter;
    }
    execute() {
        return new Promise((resolve, reject) => {
            const toolchain = this.project.getToolchain();
            const linker = toolchain.getLinker();
            linker.reset();
            const isGccLike = (0, IGccLikeToolchain_1.isGccLikeToolchain)(toolchain);
            const interpreterExt = (process.platform === 'win32' || process.platform === 'cygwin') ? ".exe" : "";
            const interpreterFile = (0, node_path_1.join)(this.project.getInterpreterBuildDir(), `lua${interpreterExt}`);
            const version = this.project.getVersion();
            linker.setOutputFile(interpreterFile);
            const len = this.objFiles.getLenght();
            for (let i = 0; i < len; i++) {
                linker.addObjectFile(this.objFiles.getItem(i));
            }
            if (process.platform === 'win32' || process.platform === 'cygwin') {
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
            else {
                linker.addLinkLibrary("m");
                linker.addLibrary(this.parent.getStaticLibrary());
                if (process.platform === 'freebsd' || process.platform === 'netbsd' || process.platform === 'openbsd') {
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
                else if (process.platform === 'darwin') {
                    linker.addLinkLibrary("readline");
                }
                else if (process.platform === "sunos") {
                    linker.addLinkLibrary("dl");
                }
                else {
                    linker.addLinkLibrary("dl");
                }
            }
            const libDirs = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLibDirsExtra();
            for (const libDir of libDirs) {
                linker.addLibDir(libDir);
            }
            const libs = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLibsExtra();
            for (const lib of libs) {
                linker.addLinkLibrary(lib);
            }
            const ldFlags = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLdFlagsExtra();
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
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Link Lua ${this.project.getVersion().getString()} interpreter`);
            resolve();
        });
    }
}
exports.PucLuaLinkInterpreterTarget = PucLuaLinkInterpreterTarget;


/***/ }),

/***/ 7493:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaLinkSharedLibTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const IWin32ImportLibraryDecorator_1 = __nccwpck_require__(8073);
const IGccLikeToolchain_1 = __nccwpck_require__(9372);
const PucLuaCompileStaticLibTarget_1 = __nccwpck_require__(9285);
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
const Console_1 = __nccwpck_require__(946);
class PucLuaLinkSharedLibTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
        this.objFiles = parent.getSharedLibObjectFiles();
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Link Lua ${this.project.getVersion().getString()} shared library`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new PucLuaCompileStaticLibTarget_1.PucLuaCompileStaticLibTarget(this.project, this);
    }
    getSourcesInfo() {
        return this.parent.getSourcesInfo();
    }
    getSharedLibObjectFiles() {
        return this.objFiles;
    }
    getSharedLibrary() {
        return this.sharedLibrary;
    }
    getImportLibrary() {
        return this.importLibrary;
    }
    execute() {
        return new Promise((resolve, reject) => {
            const version = this.project.getVersion();
            const libName = `lua${version.getMajor()}${version.getMinor()}`;
            const toolchain = this.project.getToolchain();
            const linker = toolchain.getLinker();
            linker.reset();
            const isGccLike = (0, IGccLikeToolchain_1.isGccLikeToolchain)(toolchain);
            if (process.platform === 'win32' || process.platform === 'cygwin') {
                const libBaseName = process.platform === 'cygwin' ?
                    `cyg${libName}.dll` :
                    `${libName}.dll`;
                let libraryPath = (0, node_path_1.join)(this.project.getSharedLibBuildDir(), libBaseName);
                let impLib;
                if ((0, IWin32ImportLibraryDecorator_1.hasWin32ImportLibraryDecorator)(linker)) {
                    const win32Linker = linker;
                    const implibExt = win32Linker.getImportLibraryExtension();
                    const implibBaseName = isGccLike ?
                        `lib${libName}${implibExt}` :
                        `${libName}${implibExt}`;
                    impLib = (0, node_path_1.join)(this.project.getSharedLibBuildDir(), implibBaseName);
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
                        const gccLikeToolchain = toolchain;
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
                    else {
                        this.sharedLibrary = libraryPath;
                        this.importLibrary = impLib;
                        resolve();
                    }
                })
                    .catch(reject);
            }
            else {
                const libExt = process.platform === 'darwin' ? 'dylib' : 'so';
                const libBaseName = `lib${libName}.${libExt}`;
                const libraryPath = (0, node_path_1.join)(this.project.getSharedLibBuildDir(), libBaseName);
                linker.setOutputFile(libraryPath);
                linker.setOutputMode("shared");
                linker.addLinkLibrary("m");
                const len = this.objFiles.getLenght();
                for (let i = 0; i < len; i++) {
                    linker.addObjectFile(this.objFiles.getItem(i));
                }
                if (process.platform === 'freebsd' || process.platform === 'netbsd' || process.platform === 'openbsd') {
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
                else if (process.platform === 'darwin') {
                    linker.addLinkLibrary("readline");
                }
                else if (process.platform === "sunos") {
                    linker.addLinkLibrary("dl");
                }
                else {
                    linker.addLinkLibrary("dl");
                }
                const libDirs = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLibDirsExtra();
                for (const libDir of libDirs) {
                    linker.addLibDir(libDir);
                }
                const libs = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLibsExtra();
                for (const lib of libs) {
                    linker.addLinkLibrary(lib);
                }
                const ldFlags = ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLdFlagsExtra();
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
                            const gccLikeToolchain = toolchain;
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
                        else {
                            this.sharedLibrary = libraryPath;
                            resolve();
                        }
                    }
                })
                    .catch(reject);
            }
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Link Lua ${this.project.getVersion().getString()} shared library`);
            resolve();
        });
    }
}
exports.PucLuaLinkSharedLibTarget = PucLuaLinkSharedLibTarget;


/***/ }),

/***/ 1371:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaApplyPatchesTarget = void 0;
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
const AbstractApplyPatchesTarget_1 = __nccwpck_require__(3714);
const PucLuaConfigureSourcesTarget_1 = __nccwpck_require__(7819);
const Console_1 = __nccwpck_require__(946);
class PucLuaApplyPatchesTarget extends AbstractApplyPatchesTarget_1.AbstractApplyPatchesTarget {
    constructor(project, parent) {
        super(project, parent, parent.getExtractedDir(), project.getRemotePatchesBuildDir(), ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLuaPatches());
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Apply patches on Lua ${this.getProject().getVersion().getString()}`);
            resolve();
        });
    }
    getNext() {
        return new PucLuaConfigureSourcesTarget_1.PucLuaConfigureSourcesTarget(this.getProject(), this);
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Apply patches on Lua ${this.getProject().getVersion().getString()}`);
            resolve();
        });
    }
}
exports.PucLuaApplyPatchesTarget = PucLuaApplyPatchesTarget;


/***/ }),

/***/ 8418:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaCheckDependenciesTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const node_os_1 = __nccwpck_require__(8161);
const promises_1 = __nccwpck_require__(1455);
const PucLuaFetchTarget_1 = __nccwpck_require__(6327);
const ExecuteProcess_1 = __nccwpck_require__(6522);
const DefaultStdOutHandler_1 = __nccwpck_require__(840);
const Console_1 = __nccwpck_require__(946);
class PucLuaCheckDependenciesTarget {
    constructor(project, parent) {
        this.parent = parent;
        this.project = project;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Check dependencies for Lua ${this.project.getVersion().getString()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new PucLuaFetchTarget_1.PucLuaFetchTarget(this.project, this);
    }
    unixCheckReadline(isRetest) {
        return new Promise((resolve, reject) => {
            const githubTryInstallReadline = (errorMsg) => {
                if (isRetest) {
                    reject(new Error(errorMsg));
                }
                else if (process.env["RUNNER_OS"] === "macOS") {
                    (0, ExecuteProcess_1.executeProcess)("brew", {
                        args: ["install", "readline"],
                        verbose: true,
                        stdout: DefaultStdOutHandler_1.defaultStdOutHandler
                    })
                        .then(code => {
                        this.unixCheckReadline(true)
                            .then(resolve)
                            .catch(reject);
                    })
                        .catch(reject);
                }
                else if (process.env["RUNNER_OS"] === "Linux") {
                    (0, ExecuteProcess_1.executeProcess)("sudo", {
                        args: ["apt", "install", "-y", "libreadline-dev"],
                        verbose: true,
                        stdout: DefaultStdOutHandler_1.defaultStdOutHandler
                    })
                        .then(code => {
                        this.unixCheckReadline(true)
                            .then(resolve)
                            .catch(reject);
                    })
                        .catch(reject);
                }
                else {
                    reject(new Error(errorMsg));
                }
            };
            const testReadLine = [
                "#include <stdio.h>",
                "#include <stdlib.h>",
                "#include <readline/readline.h>",
                "int main(int argc, const char **argv) {",
                "\tchar *input = readline(\"enter text > \");",
                "\tif (input) {",
                "\t\tprintf(\"Entered input: %s\\n\", input);",
                "\t\tfree(input);",
                "\t}",
                "\treturn 0;",
                "}"
            ];
            const sourceCode = testReadLine.join(node_os_1.EOL);
            const readlineLibrary = (process.platform === 'freebsd' ||
                process.platform === 'netbsd' ||
                process.platform === 'openbsd') ? "edit" : "readline";
            const testFileBasename = `test-${readlineLibrary}`;
            (0, promises_1.mkdtemp)((0, node_path_1.join)(this.project.getBuildDir(), testFileBasename + "-"))
                .then(tmpDir => {
                const testFile = (0, node_path_1.join)(tmpDir, testFileBasename + ".c");
                (0, promises_1.writeFile)(testFile, sourceCode, { encoding: "utf-8" })
                    .then(() => {
                    const toolchain = this.project.getToolchain();
                    const compiler = toolchain.getCompiler();
                    compiler.reset();
                    const testOutputObjectFile = (0, node_path_1.join)(tmpDir, testFileBasename + compiler.getObjectFileExtension());
                    if (process.platform === 'freebsd' || process.platform === 'netbsd' || process.platform === 'openbsd') {
                        compiler.addIncludeDir("/usr/include/edit");
                    }
                    compiler.setInputFile(testFile);
                    compiler.setOutputFile(testOutputObjectFile);
                    compiler.execute()
                        .then(() => {
                        const readlineProgram = (0, node_path_1.join)(tmpDir, testFileBasename);
                        const linker = toolchain.getLinker();
                        linker.reset();
                        linker.addObjectFile(testOutputObjectFile);
                        linker.addLinkLibrary(readlineLibrary);
                        linker.setOutputFile(readlineProgram);
                        linker.execute()
                            .then(resolve)
                            .catch(linkErr => {
                            githubTryInstallReadline(`Failed to link a test program for the ${readlineLibrary} library. Please, install the ${readlineLibrary} library`);
                        });
                    })
                        .catch(compileErr => {
                        githubTryInstallReadline(`Failed to compile a test program for the ${readlineLibrary} library. Please, install the ${readlineLibrary} library`);
                    });
                })
                    .catch(reject);
            })
                .catch(reject);
        });
    }
    execute() {
        return new Promise((resolve, reject) => {
            if (process.platform === 'win32') {
                resolve();
            }
            else {
                this.unixCheckReadline(false)
                    .then(resolve)
                    .catch(reject);
            }
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Check dependencies for Lua ${this.project.getVersion().getString()}`);
            resolve();
        });
    }
}
exports.PucLuaCheckDependenciesTarget = PucLuaCheckDependenciesTarget;


/***/ }),

/***/ 7819:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaConfigureSourcesTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const node_fs_1 = __nccwpck_require__(3024);
const promises_1 = __nccwpck_require__(6848);
const promises_2 = __nccwpck_require__(1455);
const PucLuaSourcesInfo_1 = __nccwpck_require__(7464);
const PucLuaVersion_1 = __nccwpck_require__(5991);
const PucLuaFinishConfigurationTarget_1 = __nccwpck_require__(9944);
const Console_1 = __nccwpck_require__(946);
class PucLuaConfigureSourcesTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
        this.rawlibFiles = [];
        this.rawHeaderFiles = [];
        this.rawManFiles = [];
        this.compatFlag = undefined;
        this.rawInterpreterFiles = [];
        this.rawCompilerFiles = [];
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Configure source code for the Lua ${this.project.getVersion().getString()} library`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new PucLuaFinishConfigurationTarget_1.PucLuaFinishConfigurationTarget(this.project, this);
    }
    setConfigurationResult() {
        this.project.configurationResult().setValue(new PucLuaSourcesInfo_1.PucLuaSourcesInfo(this.headersDir, this.rawHeaderFiles, this.rawManFiles, this.rawlibFiles, this.rawInterpreterFiles, this.rawCompilerFiles, this.compatFlag));
    }
    execute() {
        return new Promise((resolve, reject) => {
            let hasluah = false;
            let hasluahpp = false;
            let hasluaconfh = false;
            let haslauxlibh = false;
            let haslualibh = false;
            const targetHeaders = {
                "lua.h": () => { hasluah = true; },
                "lua.hpp": () => { hasluahpp = true; },
                "luaconf.h": () => { hasluaconfh = true; },
                "lauxlib.h": () => { haslauxlibh = true; },
                "lualib.h": () => { haslualibh = true; }
            };
            let hasManLua = false;
            let hasManLuac = false;
            const targetManFiles = {
                "lua.1": () => { hasManLua = true; },
                "luac.1": () => { hasManLuac = true; }
            };
            this.rawHeaderFiles.splice(0, this.rawHeaderFiles.length);
            this.rawManFiles.splice(0, this.rawManFiles.length);
            this.rawlibFiles.splice(0, this.rawHeaderFiles.length);
            this.rawCompilerFiles.splice(0, this.rawCompilerFiles.length);
            this.rawInterpreterFiles.splice(0, this.rawInterpreterFiles.length);
            this.compatFlag = undefined;
            this.headersDir = undefined;
            const extractedDir = this.parent.getDirectory();
            const srcDir = (0, node_path_1.join)(extractedDir, "src");
            const docDir = (0, node_path_1.join)(extractedDir, "doc");
            this.headersDir = srcDir;
            const makeFile = (0, node_path_1.join)(srcDir, "Makefile");
            (0, promises_2.stat)(makeFile)
                .then(makeFileStat => {
                if (makeFileStat.isFile()) {
                    const rl = (0, promises_1.createInterface)({
                        input: (0, node_fs_1.createReadStream)(makeFile),
                        crlfDelay: Infinity
                    });
                    const lines = [];
                    rl.on("line", line => {
                        lines.push(line);
                    });
                    rl.on("close", () => {
                        const line_iter = (j) => {
                            if (j < lines.length) {
                                const pattern = /\-D(LUA_COMPAT[A-Za-z0-9_]+)/;
                                const match = pattern.exec(lines[j]);
                                if (match) {
                                    this.compatFlag = match[1];
                                    line_iter(lines.length);
                                }
                                else {
                                    line_iter(j + 1);
                                }
                            }
                            else { /* starting to process each expected file */
                                (0, promises_2.readdir)(docDir)
                                    .then(docFiles => {
                                    const docfile_iter = (k) => {
                                        if (k < docFiles.length) {
                                            const docFile = docFiles[k];
                                            if (targetManFiles[docFile]) {
                                                const docFilePath = (0, node_path_1.join)(docDir, docFile);
                                                (0, promises_2.stat)(docFilePath)
                                                    .then(docStat => {
                                                    if (docStat.isFile()) {
                                                        targetManFiles[docFile]();
                                                        this.rawManFiles.push(docFilePath);
                                                        docfile_iter(k + 1);
                                                    }
                                                    else {
                                                        reject(new Error(`${docFile} is not a file`));
                                                    }
                                                })
                                                    .catch(reject);
                                            }
                                            else {
                                                docfile_iter(k + 1);
                                            }
                                        }
                                        else if (!hasManLua) {
                                            reject(new Error("lua.1 man file missing"));
                                        }
                                        else if (!hasManLuac) {
                                            reject(new Error("luac.1 man file missing"));
                                        }
                                        else { /* All man files were found. Now, iterating source files */
                                            (0, promises_2.readdir)(srcDir)
                                                .then(files => {
                                                const file_iter = (i) => {
                                                    if (i < files.length) {
                                                        const f = files[i];
                                                        if (f.endsWith(".c")) {
                                                            const fpath = (0, node_path_1.join)(srcDir, f);
                                                            (0, promises_2.stat)(fpath)
                                                                .then(s => {
                                                                if (s.isFile()) {
                                                                    if (f === "lua.c") {
                                                                        this.rawInterpreterFiles.push(fpath);
                                                                    }
                                                                    else if (f.startsWith("l") && f !== "luac.c") {
                                                                        this.rawlibFiles.push(fpath);
                                                                    }
                                                                    else {
                                                                        this.rawCompilerFiles.push(fpath);
                                                                    }
                                                                }
                                                                file_iter(i + 1);
                                                            })
                                                                .catch(reject);
                                                        }
                                                        else if (targetHeaders[f]) {
                                                            const fpath = (0, node_path_1.join)(srcDir, f);
                                                            (0, promises_2.stat)(fpath)
                                                                .then(s => {
                                                                if (s.isFile()) {
                                                                    targetHeaders[f]();
                                                                    this.rawHeaderFiles.push(fpath);
                                                                }
                                                                file_iter(i + 1);
                                                            })
                                                                .catch(reject);
                                                        }
                                                        else {
                                                            file_iter(i + 1);
                                                        }
                                                    }
                                                    else if (!hasluah) {
                                                        reject(new Error("lua.h missing"));
                                                    }
                                                    else if (!hasluaconfh) {
                                                        reject(new Error("luaconf.h missing"));
                                                    }
                                                    else if (!haslauxlibh) {
                                                        reject(new Error("lauxlib.h missing"));
                                                    }
                                                    else if (!haslualibh) {
                                                        reject(new Error("lualib.h missing"));
                                                    }
                                                    else if (this.rawInterpreterFiles.length === 0) {
                                                        reject(new Error("lua.c missing"));
                                                    }
                                                    else if (this.rawCompilerFiles.length === 0) {
                                                        reject(new Error("luac files missing"));
                                                    }
                                                    else if (!hasluahpp) {
                                                        if (this.project.getVersion().compareTo(PucLuaVersion_1.LUA_52_VERSION) < 0) {
                                                            /*
                                                            ** Note: on Lua 5.1 - Lua 5.1.5,
                                                            **       lua.hpp is stored at
                                                            **       ${lua-sources}/etc/lua.hpp
                                                            */
                                                            const f = "lua.hpp";
                                                            const fpath = (0, node_path_1.join)(extractedDir, "etc", f);
                                                            (0, promises_2.stat)(fpath)
                                                                .then(s => {
                                                                if (s.isFile()) {
                                                                    targetHeaders[f]();
                                                                    this.rawHeaderFiles.push(fpath);
                                                                    this.setConfigurationResult();
                                                                    resolve();
                                                                }
                                                                else {
                                                                    reject(new Error("lua.hpp is not a file"));
                                                                }
                                                            })
                                                                .catch(reject);
                                                        }
                                                        else {
                                                            reject(new Error("lua.hpp missing"));
                                                        }
                                                    }
                                                    else {
                                                        this.setConfigurationResult();
                                                        resolve();
                                                    }
                                                };
                                                file_iter(0);
                                            })
                                                .catch(reject);
                                        }
                                    };
                                    docfile_iter(0);
                                })
                                    .catch(reject);
                            }
                        };
                        line_iter(0);
                    });
                }
                else {
                    reject(new Error(`${makeFile} is not a file`));
                }
            })
                .catch(reject);
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Configure source code for the Lua ${this.project.getVersion().getString()} library`);
            resolve();
        });
    }
}
exports.PucLuaConfigureSourcesTarget = PucLuaConfigureSourcesTarget;


/***/ }),

/***/ 1130:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaCreateBuildDirectoriesTarget = void 0;
const AbstractCreateDirectoriesTarget_1 = __nccwpck_require__(6763);
const PucLuaCheckDependenciesTarget_1 = __nccwpck_require__(8418);
const Console_1 = __nccwpck_require__(946);
class PucLuaCreateBuildDirectoriesTarget extends AbstractCreateDirectoriesTarget_1.AbstractCreateDirectoriesTarget {
    constructor(project, parent) {
        super([
            project.getBuildDir(),
            project.getLibBuildDir(),
            project.getSharedLibBuildDir(),
            project.getStaticLibBuildDir(),
            project.getRemotePatchesBuildDir(),
            project.getInterpreterBuildDir(),
            project.getCompilerBuildDir()
        ]);
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Create build directories for Lua ${this.project.getVersion().getString()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new PucLuaCheckDependenciesTarget_1.PucLuaCheckDependenciesTarget(this.project, this);
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Create build directories for Lua ${this.project.getVersion().getString()}`);
            resolve();
        });
    }
}
exports.PucLuaCreateBuildDirectoriesTarget = PucLuaCreateBuildDirectoriesTarget;


/***/ }),

/***/ 6327:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaFetchTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const AbstractFetchTarballTarget_1 = __nccwpck_require__(1299);
const PucLuaApplyPatchesTarget_1 = __nccwpck_require__(1371);
const PucLuaVersion_1 = __nccwpck_require__(5991);
const Console_1 = __nccwpck_require__(946);
class PucLuaFetchTarget extends AbstractFetchTarballTarget_1.AbstractFetchTarballTarget {
    constructor(project, parent) {
        super(project.getVersion().getDownloadUrl(), project.getBuildDir(), `lua-${project.getVersion().getString()}`, {
            fileHash: {
                algorithm: project.getVersion().getHashAlgorithm(),
                expectedHash: project.getVersion().getHashValue()
            }
        });
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Fetch Lua ${this.project.getVersion().getString()} source code`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getExtractedDir() {
        const version = this.project.getVersion();
        let dirName = `lua-${version.getString()}`;
        if (version instanceof PucLuaVersion_1.PucLuaWorkVersion) {
            const match = /^(lua\-.*)\-rc\d+$/.exec(dirName);
            if (match) {
                dirName = match[1];
            }
        }
        return (0, node_path_1.join)(this.getWorkDir(), dirName);
    }
    getNext() {
        return new PucLuaApplyPatchesTarget_1.PucLuaApplyPatchesTarget(this.project, this);
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Fetch Lua ${this.project.getVersion().getString()} source code`);
            resolve();
        });
    }
}
exports.PucLuaFetchTarget = PucLuaFetchTarget;


/***/ }),

/***/ 9944:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaFinishConfigurationTarget = void 0;
const Console_1 = __nccwpck_require__(946);
class PucLuaFinishConfigurationTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Finish Lua ${this.project.getVersion().getString()} configuration`);
            resolve();
        });
    }
    getNext() {
        return null;
    }
    execute() {
        return new Promise((resolve, reject) => {
            const srcInfo = this.project.configurationResult().getValue();
            const compat = srcInfo.getCompatFlag();
            if (compat) {
                Console_1.Console.instance().writeLine(`[Compat] ${compat}`);
            }
            const libSrcFiles = srcInfo.getLibSrcFiles();
            let len = libSrcFiles.getLenght();
            for (let i = 0; i < len; i++) {
                Console_1.Console.instance().writeLine(`[Library] ${libSrcFiles.getItem(i)}`);
            }
            Console_1.Console.instance().writeLine(`[Header Dir] ${srcInfo.getHeadersDir()}`);
            const headerFiles = srcInfo.getHeaderFiles();
            len = headerFiles.getLenght();
            for (let i = 0; i < len; i++) {
                Console_1.Console.instance().writeLine(`[Header] ${headerFiles.getItem(i)}`);
            }
            const interpreterSrcFiles = srcInfo.getInterpreterSrcFiles();
            len = interpreterSrcFiles.getLenght();
            for (let i = 0; i < len; i++) {
                Console_1.Console.instance().writeLine(`[Interpreter] ${interpreterSrcFiles.getItem(i)}`);
            }
            const compilerFiles = srcInfo.getCompilerSrcFiles();
            len = compilerFiles.getLenght();
            for (let i = 0; i < len; i++) {
                Console_1.Console.instance().writeLine(`[Compiler] ${compilerFiles.getItem(i)}`);
            }
            const manFiles = srcInfo.getManFiles();
            len = manFiles.getLenght();
            for (let i = 0; i < len; i++) {
                Console_1.Console.instance().writeLine(`[MAN] ${manFiles.getItem(i)}`);
            }
            resolve();
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Finish Lua ${this.project.getVersion().getString()} configuration`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
}
exports.PucLuaFinishConfigurationTarget = PucLuaFinishConfigurationTarget;


/***/ }),

/***/ 7464:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaSourcesInfo = void 0;
const ReadOnlyArray_1 = __nccwpck_require__(2483);
class PucLuaSourcesInfo {
    constructor(headersDir, headerFiles, manFiles, libSrcFiles, interpreterSrcFiles, compilerSrcFiles, compatFlag) {
        this.headersDir = headersDir;
        this.headerFiles = new ReadOnlyArray_1.ReadOnlyArray(headerFiles);
        this.manFiles = new ReadOnlyArray_1.ReadOnlyArray(manFiles);
        this.libSrcFiles = new ReadOnlyArray_1.ReadOnlyArray(libSrcFiles);
        this.interpreterSrcFiles = new ReadOnlyArray_1.ReadOnlyArray(interpreterSrcFiles);
        this.compilerSrcFiles = new ReadOnlyArray_1.ReadOnlyArray(compilerSrcFiles);
        this.compatFlag = compatFlag;
    }
    getCompatFlag() {
        return this.compatFlag;
    }
    getHeadersDir() {
        return this.headersDir;
    }
    getHeaderFiles() {
        return this.headerFiles;
    }
    getManFiles() {
        return this.manFiles;
    }
    getLibSrcFiles() {
        return this.libSrcFiles;
    }
    getInterpreterSrcFiles() {
        return this.interpreterSrcFiles;
    }
    getCompilerSrcFiles() {
        return this.compilerSrcFiles;
    }
}
exports.PucLuaSourcesInfo = PucLuaSourcesInfo;


/***/ }),

/***/ 7032:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaCopyInstallableArtifactsTarget = void 0;
const promises_1 = __nccwpck_require__(1455);
const node_path_1 = __nccwpck_require__(6760);
const SequentialPromises_1 = __nccwpck_require__(923);
const PucLuaPostInstallTarget_1 = __nccwpck_require__(5308);
const Console_1 = __nccwpck_require__(946);
class PucLuaCopyInstallableArtifactsTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Copy Lua ${this.project.getVersion().getString()} installation files`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new PucLuaPostInstallTarget_1.PucLuaPostInstallTarget(this.project, this);
    }
    copyInterpreter() {
        return new Promise((resolve, reject) => {
            const builtInterpreter = this.parent.getBuildInfo().getInterpreter();
            const binDir = this.project.getInstallBinDir();
            const interpreter = (0, node_path_1.join)(binDir, (0, node_path_1.basename)(builtInterpreter));
            (0, promises_1.cp)(builtInterpreter, interpreter, { force: true })
                .then(resolve)
                .catch(reject);
        });
    }
    copyCompiler() {
        return new Promise((resolve, reject) => {
            const builtCompiler = this.parent.getBuildInfo().getCompiler();
            const binDir = this.project.getInstallBinDir();
            const compiler = (0, node_path_1.join)(binDir, (0, node_path_1.basename)(builtCompiler));
            (0, promises_1.cp)(builtCompiler, compiler, { force: true })
                .then(resolve)
                .catch(reject);
        });
    }
    copySharedLibrary() {
        return new Promise((resolve, reject) => {
            const builtSharedLib = this.parent.getBuildInfo().getSharedLibrary();
            const targetInstallDir = process.platform === 'win32' || process.platform === 'cygwin' ?
                this.project.getInstallBinDir() :
                this.project.getInstallLibDir();
            const sharedLib = (0, node_path_1.join)(targetInstallDir, (0, node_path_1.basename)(builtSharedLib));
            (0, promises_1.cp)(builtSharedLib, sharedLib, { force: true })
                .then(resolve)
                .catch(reject);
        });
    }
    copyStaticLibrary() {
        return new Promise((resolve, reject) => {
            const builtStaticLib = this.parent.getBuildInfo().getStaticLibrary();
            const libDir = this.project.getInstallLibDir();
            const staticLib = (0, node_path_1.join)(libDir, (0, node_path_1.basename)(builtStaticLib));
            (0, promises_1.cp)(builtStaticLib, staticLib, { force: true })
                .then(resolve)
                .catch(reject);
        });
    }
    copyImportLibrary() {
        return new Promise((resolve, reject) => {
            const builtImpLib = this.parent.getBuildInfo().getImportLibrary();
            if (builtImpLib) {
                const libDir = this.project.getInstallLibDir();
                const impLib = (0, node_path_1.join)(libDir, (0, node_path_1.basename)(builtImpLib));
                (0, promises_1.cp)(builtImpLib, impLib, { force: true })
                    .then(resolve)
                    .catch(reject);
            }
            else {
                resolve();
            }
        });
    }
    copyHeaders() {
        return new Promise((resolve, reject) => {
            const includeDir = this.project.getInstallIncludeDir();
            const headers = this.parent.getBuildInfo().getSourcesInfo().getHeaderFiles();
            const len = headers.getLenght();
            const header_iter = (i) => {
                if (i < len) {
                    const sourceHeader = headers.getItem(i);
                    const h = (0, node_path_1.join)(includeDir, (0, node_path_1.basename)(sourceHeader));
                    (0, promises_1.cp)(sourceHeader, h, { force: true })
                        .then(() => {
                        header_iter(i + 1);
                    })
                        .catch(reject);
                }
                else {
                    resolve();
                }
            };
            header_iter(0);
        });
    }
    copyManFiles() {
        return new Promise((resolve, reject) => {
            const manDir = this.project.getInstallManDir();
            const manFiles = this.parent.getBuildInfo().getSourcesInfo().getManFiles();
            const len = manFiles.getLenght();
            const man_iter = (i) => {
                if (i < len) {
                    const sourceMan = manFiles.getItem(i);
                    const man = (0, node_path_1.join)(manDir, (0, node_path_1.basename)(sourceMan));
                    (0, promises_1.cp)(sourceMan, man, { force: true })
                        .then(() => {
                        man_iter(i + 1);
                    })
                        .catch(reject);
                }
                else {
                    resolve();
                }
            };
            man_iter(0);
        });
    }
    copyPkgConfigFile() {
        return new Promise((resolve, reject) => {
            const builtPkgConfigFile = this.parent.getBuildInfo().getPkgConfigFile();
            const pkgConfigDir = this.project.getInstallPkgConfigDir();
            const pkgConfigFile = (0, node_path_1.join)(pkgConfigDir, (0, node_path_1.basename)(builtPkgConfigFile));
            (0, promises_1.cp)(builtPkgConfigFile, pkgConfigFile, { force: true })
                .then(resolve)
                .catch(reject);
        });
    }
    execute() {
        return new Promise((resolve, reject) => {
            (0, SequentialPromises_1.sequentialPromises)([
                () => this.copyInterpreter(),
                () => this.copyCompiler(),
                () => this.copySharedLibrary(),
                () => this.copyStaticLibrary(),
                () => this.copyImportLibrary(),
                () => this.copyHeaders(),
                () => this.copyManFiles(),
                () => this.copyPkgConfigFile()
            ])
                .then(value => {
                resolve();
            })
                .catch(reject);
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Copy Lua ${this.project.getVersion().getString()} installation files`);
            resolve();
        });
    }
}
exports.PucLuaCopyInstallableArtifactsTarget = PucLuaCopyInstallableArtifactsTarget;


/***/ }),

/***/ 9886:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaCreateInstallationDirectoriesTarget = void 0;
const PucLuaCopyInstallableArtifactsTarget_1 = __nccwpck_require__(7032);
const AbstractCreateDirectoriesTarget_1 = __nccwpck_require__(6763);
const Console_1 = __nccwpck_require__(946);
class PucLuaCreateInstallationDirectoriesTarget extends AbstractCreateDirectoriesTarget_1.AbstractCreateDirectoriesTarget {
    constructor(project, parent, buildInfo) {
        super([
            project.getInstallDir(),
            project.getInstallIncludeDir(),
            project.getInstallBinDir(),
            project.getInstallLibDir(),
            project.getInstallManDir(),
            project.getInstallPkgConfigDir(),
            project.getInstallLuaModulesDir(),
            project.getInstallCModulesDir()
        ]);
        this.project = project;
        this.parent = parent;
        this.buildInfo = buildInfo;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Create installation directories for Lua ${this.project.getVersion().getString()}`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getNext() {
        return new PucLuaCopyInstallableArtifactsTarget_1.PucLuaCopyInstallableArtifactsTarget(this.project, this);
    }
    getBuildInfo() {
        return this.buildInfo;
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Create installation directories for Lua ${this.project.getVersion().getString()}`);
            resolve();
        });
    }
}
exports.PucLuaCreateInstallationDirectoriesTarget = PucLuaCreateInstallationDirectoriesTarget;


/***/ }),

/***/ 7336:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaFinishInstallationTarget = void 0;
const Console_1 = __nccwpck_require__(946);
class PucLuaFinishInstallationTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
    }
    init() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[Start] Finish Lua ${this.project.getVersion().getString()} installation`);
            resolve();
        });
    }
    getNext() {
        return null;
    }
    execute() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine("<< done >>");
            resolve();
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            Console_1.Console.instance().writeLine(`[End] Finish Lua ${this.project.getVersion().getString()} installation`);
            resolve();
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
}
exports.PucLuaFinishInstallationTarget = PucLuaFinishInstallationTarget;


/***/ }),

/***/ 5308:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaPostInstallTarget = void 0;
const AbstractUpdateLuaEnvVarsTarget_1 = __nccwpck_require__(6962);
const PucLuaFinishInstallationTarget_1 = __nccwpck_require__(7336);
const Console_1 = __nccwpck_require__(946);
class PucLuaPostInstallTarget extends AbstractUpdateLuaEnvVarsTarget_1.AbstractUpdateLuaEnvVarsTarget {
    constructor(project, parent) {
        super(project, parent);
    }
    getProjectInstallDir() {
        return this.getProject().getInstallDir();
    }
    getProjectInstallLibDir() {
        return this.getProject().getInstallLibDir();
    }
    getProjectInstallBinDir() {
        return this.getProject().getInstallBinDir();
    }
    getProjectInstallPkgConfigDir() {
        return this.getProject().getInstallPkgConfigDir();
    }
    init() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.getProject().getVersion();
            Console_1.Console.instance().writeLine(`[Start] Post install for Lua ${projectVersion.getString()}`);
            resolve();
        });
    }
    getNext() {
        return new PucLuaFinishInstallationTarget_1.PucLuaFinishInstallationTarget(this.getProject(), this);
    }
    finalize() {
        return new Promise((resolve, reject) => {
            const projectVersion = this.getProject().getVersion();
            Console_1.Console.instance().writeLine(`[End] Post install for Lua ${projectVersion.getString()}`);
            resolve();
        });
    }
}
exports.PucLuaPostInstallTarget = PucLuaPostInstallTarget;


/***/ }),

/***/ 2810:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PucLuaProject = void 0;
const node_path_1 = __nccwpck_require__(6760);
const PucLuaVersion_1 = __nccwpck_require__(5991);
const TargetPipeline_1 = __nccwpck_require__(9348);
const GetSetProperty_1 = __nccwpck_require__(8195);
const PucLuaCompileSharedLibTarget_1 = __nccwpck_require__(1424);
const PucLuaCreateBuildDirectoriesTarget_1 = __nccwpck_require__(1130);
const PucLuaCreateInstallationDirectoriesTarget_1 = __nccwpck_require__(9886);
class PucLuaProject {
    getVersion() {
        return this.version;
    }
    getBuildDir() {
        return this.buildDir;
    }
    getInstallDir() {
        return this.installDir;
    }
    getToolchain() {
        return this.toolchain;
    }
    getInterpreterBuildDir() {
        return this.interpreterBuildDir;
    }
    getCompilerBuildDir() {
        return this.compilerBuildDir;
    }
    getLibBuildDir() {
        return this.libBuildDir;
    }
    getSharedLibBuildDir() {
        return this.sharedLibBuildDir;
    }
    getStaticLibBuildDir() {
        return this.staticLibBuildDir;
    }
    getRemotePatchesBuildDir() {
        return this.remotePatchesBuildDir;
    }
    getInstallIncludeDir() {
        return this.installIncludeDir;
    }
    getInstallBinDir() {
        return this.installBinDir;
    }
    getInstallLibDir() {
        return this.installLibDir;
    }
    getInstallManDir() {
        return this.installManDir;
    }
    getInstallPkgConfigDir() {
        return this.installPkgConfigDir;
    }
    getInstallLuaModulesDir() {
        return this.installLuaModulesDir;
    }
    getInstallCModulesDir() {
        return this.installCModulesDir;
    }
    configurationResult() {
        return this._configurationResult;
    }
    buildResult() {
        return this._buildResult;
    }
    constructor(version, buildDir, installDir, toolchain) {
        this.version = version;
        this.buildDir = buildDir;
        this.installDir = installDir;
        this.toolchain = toolchain;
        this.interpreterBuildDir = (0, node_path_1.join)(buildDir, "interpreter");
        this.compilerBuildDir = (0, node_path_1.join)(buildDir, "compiler");
        this.libBuildDir = (0, node_path_1.join)(buildDir, "lib");
        this.sharedLibBuildDir = (0, node_path_1.join)(this.libBuildDir, "shared");
        this.staticLibBuildDir = (0, node_path_1.join)(this.libBuildDir, "static");
        this.remotePatchesBuildDir = (0, node_path_1.join)(this.buildDir, "remote-patches");
        this.installIncludeDir = (0, node_path_1.join)(installDir, "include");
        this.installBinDir = (0, node_path_1.join)(installDir, "bin");
        this.installLibDir = (0, node_path_1.join)(installDir, "lib");
        this.installManDir = (0, node_path_1.join)(installDir, "share", "man", "man1");
        this.installPkgConfigDir = (0, node_path_1.join)(this.installLibDir, "pkgconfig");
        if (process.platform === 'win32' && version.compareTo(PucLuaVersion_1.LUA_53_VERSION) < 0) {
            this.installLuaModulesDir = (0, node_path_1.join)(this.installBinDir, "lua");
            this.installCModulesDir = this.installBinDir;
        }
        else {
            this.installLuaModulesDir = (0, node_path_1.join)(installDir, "share", "lua", `${version.getMajor()}.${version.getMinor()}`);
            this.installCModulesDir = (0, node_path_1.join)(this.installLibDir, "lua", `${version.getMajor()}.${version.getMinor()}`);
        }
        this._configurationResult = new GetSetProperty_1.GetSetProperty(null);
        this._buildResult = new GetSetProperty_1.GetSetProperty(null);
    }
    configure() {
        return new Promise((resolve, reject) => {
            const initialConfigureTarget = new PucLuaCreateBuildDirectoriesTarget_1.PucLuaCreateBuildDirectoriesTarget(this, null);
            const pipeline = new TargetPipeline_1.TargetPipeline(initialConfigureTarget);
            pipeline.execute()
                .then(resolve)
                .catch(reject);
        });
    }
    build() {
        return new Promise((resolve, reject) => {
            const initialBuildTarget = new PucLuaCompileSharedLibTarget_1.PucLuaCompileSharedLibTarget(this, null, this.configurationResult().getValue());
            const pipeline = new TargetPipeline_1.TargetPipeline(initialBuildTarget);
            pipeline.execute()
                .then(resolve)
                .catch(reject);
        });
    }
    install() {
        return new Promise((resolve, reject) => {
            const initialInstallTarget = new PucLuaCreateInstallationDirectoriesTarget_1.PucLuaCreateInstallationDirectoriesTarget(this, null, this.buildResult().getValue());
            const pipeline = new TargetPipeline_1.TargetPipeline(initialInstallTarget);
            pipeline.execute()
                .then(resolve)
                .catch(reject);
        });
    }
}
exports.PucLuaProject = PucLuaProject;


/***/ }),

/***/ 5991:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LUA_55_VERSION = exports.LUA_54_VERSION = exports.LUA_53_VERSION = exports.LUA_52_VERSION = exports.LUA_51_VERSION = exports.PucLuaWorkVersion = exports.PucLuaReleaseVersion = exports.AbstractPucLuaVersion = void 0;
exports.parsePucLuaVersion = parsePucLuaVersion;
const CompareVersions_1 = __nccwpck_require__(7654);
const LATEST_LUA_RELEASE_VERSION = "5.4.8";
const CONVERT_LUA_RELEASE_VERSION = {
    "5.1": "5.1.5",
    "5.2": "5.2.4",
    "5.3": "5.3.6",
    "5.4": LATEST_LUA_RELEASE_VERSION,
    "5.5": "5.5.0"
};
const LUA_RELEASES = {
    "5.5.0": { "version": "5.5.0", "hash": { "algorithm": "sha256", "value": "57ccc32bbbd005cab75bcc52444052535af691789dba2b9016d5c50640d68b3d" } },
    "5.4.8": { "version": "5.4.8", "hash": { "algorithm": "sha256", "value": "4f18ddae154e793e46eeab727c59ef1c0c0c2b744e7b94219710d76f530629ae" } },
    "5.4.7": { "version": "5.4.7", "hash": { "algorithm": "sha256", "value": "9fbf5e28ef86c69858f6d3d34eccc32e911c1a28b4120ff3e84aaa70cfbf1e30" } },
    "5.4.6": { "version": "5.4.6", "hash": { "algorithm": "sha256", "value": "7d5ea1b9cb6aa0b59ca3dde1c6adcb57ef83a1ba8e5432c0ecd06bf439b3ad88" } },
    "5.4.5": { "version": "5.4.5", "hash": { "algorithm": "sha256", "value": "59df426a3d50ea535a460a452315c4c0d4e1121ba72ff0bdde58c2ef31d6f444" } },
    "5.4.4": { "version": "5.4.4", "hash": { "algorithm": "sha256", "value": "164c7849653b80ae67bec4b7473b884bf5cc8d2dca05653475ec2ed27b9ebf61" } },
    "5.4.3": { "version": "5.4.3", "hash": { "algorithm": "sha256", "value": "f8612276169e3bfcbcfb8f226195bfc6e466fe13042f1076cbde92b7ec96bbfb" } },
    "5.4.2": { "version": "5.4.2", "hash": { "algorithm": "sha256", "value": "11570d97e9d7303c0a59567ed1ac7c648340cd0db10d5fd594c09223ef2f524f" } },
    "5.4.1": { "version": "5.4.1", "hash": { "algorithm": "sha256", "value": "4ba786c3705eb9db6567af29c91a01b81f1c0ac3124fdbf6cd94bdd9e53cca7d" } },
    "5.4.0": { "version": "5.4.0", "hash": { "algorithm": "sha256", "value": "eac0836eb7219e421a96b7ee3692b93f0629e4cdb0c788432e3d10ce9ed47e28" } },
    "5.3.6": { "version": "5.3.6", "hash": { "algorithm": "sha256", "value": "fc5fd69bb8736323f026672b1b7235da613d7177e72558893a0bdcd320466d60" } },
    "5.3.5": { "version": "5.3.5", "hash": { "algorithm": "sha256", "value": "0c2eed3f960446e1a3e4b9a1ca2f3ff893b6ce41942cf54d5dd59ab4b3b058ac" } },
    "5.3.4": { "version": "5.3.4", "hash": { "algorithm": "sha256", "value": "f681aa518233bc407e23acf0f5887c884f17436f000d453b2491a9f11a52400c" } },
    "5.3.3": { "version": "5.3.3", "hash": { "algorithm": "sha256", "value": "5113c06884f7de453ce57702abaac1d618307f33f6789fa870e87a59d772aca2" } },
    "5.3.2": { "version": "5.3.2", "hash": { "algorithm": "sha256", "value": "c740c7bb23a936944e1cc63b7c3c5351a8976d7867c5252c8854f7b2af9da68f" } },
    "5.3.1": { "version": "5.3.1", "hash": { "algorithm": "sha256", "value": "072767aad6cc2e62044a66e8562f51770d941e972dc1e4068ba719cd8bffac17" } },
    "5.3.0": { "version": "5.3.0", "hash": { "algorithm": "sha256", "value": "ae4a5eb2d660515eb191bfe3e061f2b8ffe94dce73d32cfd0de090ddcc0ddb01" } },
    "5.2.4": { "version": "5.2.4", "hash": { "algorithm": "sha256", "value": "b9e2e4aad6789b3b63a056d442f7b39f0ecfca3ae0f1fc0ae4e9614401b69f4b" } },
    "5.2.3": { "version": "5.2.3", "hash": { "algorithm": "sha256", "value": "13c2fb97961381f7d06d5b5cea55b743c163800896fd5c5e2356201d3619002d" } },
    "5.2.2": { "version": "5.2.2", "hash": { "algorithm": "sha256", "value": "3fd67de3f5ed133bf312906082fa524545c6b9e1b952e8215ffbd27113f49f00" } },
    "5.2.1": { "version": "5.2.1", "hash": { "algorithm": "sha256", "value": "64304da87976133196f9e4c15250b70f444467b6ed80d7cfd7b3b982b5177be5" } },
    "5.2.0": { "version": "5.2.0", "hash": { "algorithm": "sha256", "value": "cabe379465aa8e388988073d59b69e76ba0025429d2c1da80821a252cdf6be0d" } },
    "5.1.5": { "version": "5.1.5", "hash": { "algorithm": "sha256", "value": "2640fc56a795f29d28ef15e13c34a47e223960b0240e8cb0a82d9b0738695333" } },
    "5.1.4": { "version": "5.1.4", "hash": { "algorithm": "sha256", "value": "b038e225eaf2a5b57c9bcc35cd13aa8c6c8288ef493d52970c9545074098af3a" } },
    "5.1.3": { "version": "5.1.3", "hash": { "algorithm": "sha256", "value": "6b5df2edaa5e02bf1a2d85e1442b2e329493b30b0c0780f77199d24f087d296d" } },
    "5.1.2": { "version": "5.1.2", "hash": { "algorithm": "sha256", "value": "5cf098c6fe68d3d2d9221904f1017ff0286e4a9cc166a1452a456df9b88b3d9e" } },
    "5.1.1": { "version": "5.1.1", "hash": { "algorithm": "sha256", "value": "c5daeed0a75d8e4dd2328b7c7a69888247868154acbda69110e97d4a6e17d1f0" } }
};
const LUA_WORKS = {
    "5.5.0-rc4": { "version": "5.5.0-rc4", "hash": { "algorithm": "sha256", "value": "57ccc32bbbd005cab75bcc52444052535af691789dba2b9016d5c50640d68b3d" } },
    "5.5.0-rc3": { "version": "5.5.0-rc3", "hash": { "algorithm": "sha256", "value": "f1a812cdcc3916f7441aec725014403177e0ef08ace097189548208f9605b2b3" } },
    "5.5.0-rc2": { "version": "5.5.0-rc2", "hash": { "algorithm": "sha256", "value": "50b24b8fce4644a4590af0f23c65945836161515b9e87c45ee1f0e62b0255a1d" } },
    "5.5.0-rc1": { "version": "5.5.0-rc1", "hash": { "algorithm": "sha256", "value": "34a4dcca0c04877fbce4baff54054b9793b70bca5d8c676ca4d3504dd47c3772" } },
    "5.5.0-beta": { "version": "5.5.0-beta", "hash": { "algorithm": "sha256", "value": "30897f95fc72565cb6c1792f721ad44e1a42e7ac587f62f7587807b3cbff1645" } },
    "5.4.8-rc1": { "version": "5.4.8-rc1", "hash": { "algorithm": "sha256", "value": "4f18ddae154e793e46eeab727c59ef1c0c0c2b744e7b94219710d76f530629ae" } },
    "5.4.7-rc4": { "version": "5.4.7-rc4", "hash": { "algorithm": "sha256", "value": "9fbf5e28ef86c69858f6d3d34eccc32e911c1a28b4120ff3e84aaa70cfbf1e30" } },
    "5.4.7-rc3": { "version": "5.4.7-rc3", "hash": { "algorithm": "sha256", "value": "9bfdb269aefaa8a8c671cb509943bb2bac0704ea3fce3e6c00d92908326cd144" } },
    "5.4.7-rc2": { "version": "5.4.7-rc2", "hash": { "algorithm": "sha256", "value": "047417676188278ee86a15c2136f400f9f2a0c21ff2b0d30ab8e2c9e217853ac" } },
    "5.4.7-rc1": { "version": "5.4.7-rc1", "hash": { "algorithm": "sha256", "value": "9f51aeeaba66df34df7b63dfb8f94cb33000aad4d8788f66ac913a9efb5a64f7" } },
    "5.4.6-rc1": { "version": "5.4.6-rc1", "hash": { "algorithm": "sha256", "value": "7d5ea1b9cb6aa0b59ca3dde1c6adcb57ef83a1ba8e5432c0ecd06bf439b3ad88" } },
    "5.4.5-rc2": { "version": "5.4.5-rc2", "hash": { "algorithm": "sha256", "value": "59df426a3d50ea535a460a452315c4c0d4e1121ba72ff0bdde58c2ef31d6f444" } },
    "5.4.5-rc1": { "version": "5.4.5-rc1", "hash": { "algorithm": "sha256", "value": "6fedab336aeae90ea4eed1f0b86ac3e0367d58176153a97323c9098a6fe9daad" } },
    "5.4.4-rc3": { "version": "5.4.4-rc3", "hash": { "algorithm": "sha256", "value": "164c7849653b80ae67bec4b7473b884bf5cc8d2dca05653475ec2ed27b9ebf61" } },
    "5.4.4-rc2": { "version": "5.4.4-rc2", "hash": { "algorithm": "sha256", "value": "2c4460fa5ef62c54111323a59b510dffe8a76148da3d48cbc2b32234019ad105" } },
    "5.4.4-rc1": { "version": "5.4.4-rc1", "hash": { "algorithm": "sha256", "value": "9f93b571e287c76541b0ed4ec54a815ecb5d5bf481285ca8170ac6c8294efaa5" } },
    "5.4.3-rc2": { "version": "5.4.3-rc2", "hash": { "algorithm": "sha256", "value": "f8612276169e3bfcbcfb8f226195bfc6e466fe13042f1076cbde92b7ec96bbfb" } },
    "5.4.3-rc1": { "version": "5.4.3-rc1", "hash": { "algorithm": "sha256", "value": "989c98e30452d60adc6820f5323205e77ee22f6f88403fedb21a69d262107a92" } },
    "5.4.2-rc1": { "version": "5.4.2-rc1", "hash": { "algorithm": "sha256", "value": "11570d97e9d7303c0a59567ed1ac7c648340cd0db10d5fd594c09223ef2f524f" } },
    "5.4.1-rc1": { "version": "5.4.1-rc1", "hash": { "algorithm": "sha256", "value": "4ba786c3705eb9db6567af29c91a01b81f1c0ac3124fdbf6cd94bdd9e53cca7d" } },
    "5.3.6-rc3": { "version": "5.3.6-rc3", "hash": { "algorithm": "sha256", "value": "fc5fd69bb8736323f026672b1b7235da613d7177e72558893a0bdcd320466d60" } },
    "5.3.6-rc2": { "version": "5.3.6-rc2", "hash": { "algorithm": "sha256", "value": "e2047dc90cc654671f615c04cffbfe4a281648ab9474a82a27d68d45d6442302" } },
    "5.3.6-rc1": { "version": "5.3.6-rc1", "hash": { "algorithm": "sha256", "value": "94e86efb1141b57b270f7e75d5b76ddf12089bf570153e1d1189442cdb9487f4" } },
    "5.4.0-rc6": { "version": "5.4.0-rc6", "hash": { "algorithm": "sha256", "value": "eac0836eb7219e421a96b7ee3692b93f0629e4cdb0c788432e3d10ce9ed47e28" } },
    "5.4.0-rc5": { "version": "5.4.0-rc5", "hash": { "algorithm": "sha256", "value": "a8c31d95d1eaea2acc14472fdf917bec1fd39a333c0bf03bc2a4124f7844a4e5" } },
    "5.4.0-rc4": { "version": "5.4.0-rc4", "hash": { "algorithm": "sha256", "value": "51321a019b27e09d3f00cda2c52d185ecb0fb453c904a3e4aab1d118f9c77992" } },
    "5.4.0-rc3": { "version": "5.4.0-rc3", "hash": { "algorithm": "sha256", "value": "092087dbf519f31ff9bc74ae7560edd8ee934b6f16e37f63fc6236e1bf9a853c" } },
    "5.4.0-rc2": { "version": "5.4.0-rc2", "hash": { "algorithm": "sha256", "value": "632855309ed55e3fdd8236869b40b11ca6010e70115dd85fb2c6ab146be8677a" } },
    "5.4.0-rc1": { "version": "5.4.0-rc1", "hash": { "algorithm": "sha256", "value": "0a4fb4cb9281d924799650a768e61723fac3f0329bca39e51b90d1acc4228e71" } },
    "5.4.0-beta": { "version": "5.4.0-beta", "hash": { "algorithm": "sha256", "value": "5eb2824bc08469be9d9282c7298f001830ea013179ad0ae8a50600332568ebb9" } },
    "5.4.0-beta-rc1": { "version": "5.4.0-beta-rc1", "hash": { "algorithm": "sha256", "value": "ecd1deedca3ab604b746e42466b43e1cefbfafb1556e1ac95a92664368d5a6ec" } },
    "5.4.0-alpha-rc2": { "version": "5.4.0-alpha-rc2", "hash": { "algorithm": "sha256", "value": "d8504506ede2dbac73c5a74235feaabb2101caff59c7f87efe774b24a10e8407" } },
    "5.4.0-alpha": { "version": "5.4.0-alpha", "hash": { "algorithm": "sha256", "value": "d8504506ede2dbac73c5a74235feaabb2101caff59c7f87efe774b24a10e8407" } },
    "5.4.0-alpha-rc1": { "version": "5.4.0-alpha-rc1", "hash": { "algorithm": "sha256", "value": "6dce98f6a5b19eef9e5090db09a82e1653425fd9886671c3041ab356491f2ef8" } },
    "5.3.5-rc2": { "version": "5.3.5-rc2", "hash": { "algorithm": "sha256", "value": "0c2eed3f960446e1a3e4b9a1ca2f3ff893b6ce41942cf54d5dd59ab4b3b058ac" } },
    "5.3.5-rc1": { "version": "5.3.5-rc1", "hash": { "algorithm": "sha256", "value": "23372e52138419459460ce576449b901086222e2c1f68812a89400391eb575f2" } },
    "5.4.0-work2": { "version": "5.4.0-work2", "hash": { "algorithm": "sha256", "value": "68b7e8f1ff561b9a7e1c29de26ff99ac2a704773c0965a4fe1800b7657d5a057" } },
    "5.4.0-work1": { "version": "5.4.0-work1", "hash": { "algorithm": "sha256", "value": "ada03980481110bfde44b3bd44bde4b03d72c84318b34d657b5b5a91ddb3912c" } },
    "5.3.4-rc3": { "version": "5.3.4-rc3", "hash": { "algorithm": "sha256", "value": "f681aa518233bc407e23acf0f5887c884f17436f000d453b2491a9f11a52400c" } },
    "5.3.4-rc2": { "version": "5.3.4-rc2", "hash": { "algorithm": "sha256", "value": "9c034489170cb0b4d0899f6cb833630ed4deeaea04f5ccb384d4c9125a43b2e9" } },
    "5.3.4-rc1": { "version": "5.3.4-rc1", "hash": { "algorithm": "sha256", "value": "84818084e005e874b701f4aa6791659f5b39f23ac4a5eaa7b9a99d0734c6564d" } },
    "5.3.3-rc3": { "version": "5.3.3-rc3", "hash": { "algorithm": "sha256", "value": "5113c06884f7de453ce57702abaac1d618307f33f6789fa870e87a59d772aca2" } },
    "5.3.3-rc2": { "version": "5.3.3-rc2", "hash": { "algorithm": "sha256", "value": "0701c6e9063adce208c22313f5a516d5ed46a1b227581b3e905117504a7ecf2d" } },
    "5.3.3-rc1": { "version": "5.3.3-rc1", "hash": { "algorithm": "sha256", "value": "247a09870ee5a8027f3848fd06fb9ce98821a6f2b443fdb863daf1bf38d23334" } },
    "5.3.2-rc2": { "version": "5.3.2-rc2", "hash": { "algorithm": "sha256", "value": "c740c7bb23a936944e1cc63b7c3c5351a8976d7867c5252c8854f7b2af9da68f" } },
    "5.3.2-rc1": { "version": "5.3.2-rc1", "hash": { "algorithm": "sha256", "value": "edcd5dc637824e71a98392be9ebc67e806fc93d84b89877086428a6b0be08c42" } },
    "5.3.1-rc2": { "version": "5.3.1-rc2", "hash": { "algorithm": "sha256", "value": "072767aad6cc2e62044a66e8562f51770d941e972dc1e4068ba719cd8bffac17" } },
    "5.3.1-rc1": { "version": "5.3.1-rc1", "hash": { "algorithm": "sha256", "value": "57cb83791cae679f5b04abfe43f9c85d2ad8e8ae47864484b511fd455adae50d" } },
    "5.2.4-rc1": { "version": "5.2.4-rc1", "hash": { "algorithm": "sha256", "value": "b9e2e4aad6789b3b63a056d442f7b39f0ecfca3ae0f1fc0ae4e9614401b69f4b" } },
    "5.3.0-rc4": { "version": "5.3.0-rc4", "hash": { "algorithm": "sha256", "value": "ae4a5eb2d660515eb191bfe3e061f2b8ffe94dce73d32cfd0de090ddcc0ddb01" } },
    "5.3.0-rc3": { "version": "5.3.0-rc3", "hash": { "algorithm": "sha256", "value": "f03d91872689d818888ab6cde4c15f5fd319a7fa483ccdb2797796a86063a0a5" } },
    "5.3.0-rc2": { "version": "5.3.0-rc2", "hash": { "algorithm": "sha256", "value": "a6a30ea6548089821e4ddd7586624f9ef0da0186312951c00d7e300c1ca8e314" } },
    "5.3.0-rc1": { "version": "5.3.0-rc1", "hash": { "algorithm": "sha256", "value": "25c2123c9bd58e658145bad31732a0b12f218d6e56e0fd9b53ed32d3cf181062" } },
    "5.3.0-rc0": { "version": "5.3.0-rc0", "hash": { "algorithm": "sha256", "value": "1c5788211d4b1a7147e1f7bcc4dae752910cd1a62af1c74e6686a1f2ce13b144" } },
    "5.3.0-beta": { "version": "5.3.0-beta", "hash": { "algorithm": "sha256", "value": "a1137c07e58bcc3e9b270a6b8dc42623ae8addba1a5c0da2239e7e65645bce90" } },
    "5.3.0-alpha": { "version": "5.3.0-alpha", "hash": { "algorithm": "sha256", "value": "23ef23ef74da2cc057b68078e2085f6c12a2f8160229449d4cf2c30b22537846" } },
    "5.3.0-work3": { "version": "5.3.0-work3", "hash": { "algorithm": "sha256", "value": "c42d633c237e9a3a237496559fbb28627fc72c3298480ac05b4210b1dee0f32c" } },
    "5.3.0-work2": { "version": "5.3.0-work2", "hash": { "algorithm": "sha256", "value": "a33d42f327e875b85b4d6d84cb62161a246af860fef1ce29d8d2fea825876423" } },
    "5.2.3-rc1": { "version": "5.2.3-rc1", "hash": { "algorithm": "sha256", "value": "13c2fb97961381f7d06d5b5cea55b743c163800896fd5c5e2356201d3619002d" } },
    "5.3.0-work1": { "version": "5.3.0-work1", "hash": { "algorithm": "sha256", "value": "d1435aded81c313592c4cbbc6cc1ffa63706fdb19c6c353aed1fec142cd73cfd" } },
    "5.2.2-rc4": { "version": "5.2.2-rc4", "hash": { "algorithm": "sha256", "value": "3fd67de3f5ed133bf312906082fa524545c6b9e1b952e8215ffbd27113f49f00" } },
    "5.2.2-rc3": { "version": "5.2.2-rc3", "hash": { "algorithm": "sha256", "value": "8ca83f7daa52750d2b49a032619b2e992d8867c4f2232f7c6a740fd3e40bfd32" } },
    "5.2.2-rc2": { "version": "5.2.2-rc2", "hash": { "algorithm": "sha256", "value": "433b1245b1689e59ca531ba66de2834c2d63a932d71b5decca307708645da8c6" } },
    "5.2.2-rc1": { "version": "5.2.2-rc1", "hash": { "algorithm": "sha256", "value": "433e7ca1a7590a8ad132b7583748c8d3e329929cc97163cf2d4be79e53b66c16" } },
    "5.2.1-rc4": { "version": "5.2.1-rc4", "hash": { "algorithm": "sha256", "value": "64304da87976133196f9e4c15250b70f444467b6ed80d7cfd7b3b982b5177be5" } },
    "5.2.1-rc3": { "version": "5.2.1-rc3", "hash": { "algorithm": "sha256", "value": "849733c3e125395e8c94debb5130555e979be76fd2767f6fcf3b03a3d9a22b3d" } },
    "5.2.1-rc2": { "version": "5.2.1-rc2", "hash": { "algorithm": "sha256", "value": "938c2da29e04651b0cb614b41417dcbd6679e7c400ce79f57938100430e7bc9a" } },
    "5.2.1-rc1": { "version": "5.2.1-rc1", "hash": { "algorithm": "sha256", "value": "7a895c3341683075436e86fe3a44325ab8cd3f29731cf057d41155f5ec9ec72d" } },
    "5.2.1-work1": { "version": "5.2.1-work1", "hash": { "algorithm": "sha256", "value": "acdfef8c61524e3c1c047418a6beaab33da166fa83fb4a2f07d5519ef6fa5922" } },
    "5.1.5-rc2": { "version": "5.1.5-rc2", "hash": { "algorithm": "sha256", "value": "2640fc56a795f29d28ef15e13c34a47e223960b0240e8cb0a82d9b0738695333" } },
    "5.1.5-rc1": { "version": "5.1.5-rc1", "hash": { "algorithm": "sha256", "value": "8a619dfd05c80a687f8fe9c01e66200577aa4f3962b2a4c71525fad78efb5ba5" } },
    "5.2.0-rc8": { "version": "5.2.0-rc8", "hash": { "algorithm": "sha256", "value": "cabe379465aa8e388988073d59b69e76ba0025429d2c1da80821a252cdf6be0d" } },
    "5.2.0-rc7": { "version": "5.2.0-rc7", "hash": { "algorithm": "sha256", "value": "c5ece090e005b9fbceb4b7dca0a191dac248590059ba3119ba6ac451883db5b3" } },
    "5.2.0-rc6": { "version": "5.2.0-rc6", "hash": { "algorithm": "sha256", "value": "ad80dca436d983caeec6bac6cd22aeafc2cfda9ded22b902dd042b77b164d968" } },
    "5.2.0-rc5": { "version": "5.2.0-rc5", "hash": { "algorithm": "sha256", "value": "4e4bfeeba3c7207fec825dd7971c76fe5825ec7663ea71ead11648f454325f72" } },
    "5.2.0-rc4": { "version": "5.2.0-rc4", "hash": { "algorithm": "sha256", "value": "d0c8dcd5ce94d59ead8866a2d2481145789c8aab592ed99e1bb0890c898ee356" } },
    "5.2.0-rc3": { "version": "5.2.0-rc3", "hash": { "algorithm": "sha256", "value": "fb2db80b5448601c8c6ccbd651d471be07d94465cd0c24f999d0e1a55ee2a31d" } },
    "5.2.0-rc2": { "version": "5.2.0-rc2", "hash": { "algorithm": "sha256", "value": "fcf77ed357b154295471fc16ff64362a1170825441aeae62dcc185bc5eb87d28" } },
    "5.2.0-rc1": { "version": "5.2.0-rc1", "hash": { "algorithm": "sha256", "value": "8f3835d6167101eff95a7f34df513337269f1a9934a5593e79e546427423e4b5" } },
    "5.2.0-beta-rc7": { "version": "5.2.0-beta-rc7", "hash": { "algorithm": "sha256", "value": "e7e49a1cc1d03ca24caed0cd8d7b76b6fb88a96bf8814f609ddc821d9813cdc6" } },
    "5.2.0-beta": { "version": "5.2.0-beta", "hash": { "algorithm": "sha256", "value": "e7e49a1cc1d03ca24caed0cd8d7b76b6fb88a96bf8814f609ddc821d9813cdc6" } },
    "5.2.0-beta-rc6": { "version": "5.2.0-beta-rc6", "hash": { "algorithm": "sha256", "value": "30f0948723fd306ad344bf52e9e393a2a64b26900abad37aacafa45a547915ea" } },
    "5.2.0-beta-rc5": { "version": "5.2.0-beta-rc5", "hash": { "algorithm": "sha256", "value": "9c1e5e240e36535d21d3dc53dd2b3f62b1fef737fdb4e9183ed0b71a77163963" } },
    "5.2.0-beta-rc4": { "version": "5.2.0-beta-rc4", "hash": { "algorithm": "sha256", "value": "2983f5e2bccbb7ea23512d79e697d253f06509e9077a6663956f3ae71b33c658" } },
    "5.2.0-beta-rc3": { "version": "5.2.0-beta-rc3", "hash": { "algorithm": "sha256", "value": "51edfebdc1f4a31c41c1a320ccf09ab35fa3f2921025ab1ad0a6b50140a05ed0" } },
    "5.2.0-beta-rc2": { "version": "5.2.0-beta-rc2", "hash": { "algorithm": "sha256", "value": "a334806a8e785f19bfd6acc15e636a8d1d2184e9ccd31a96cfab6f22cf6e746d" } },
    "5.2.0-beta-rc1": { "version": "5.2.0-beta-rc1", "hash": { "algorithm": "sha256", "value": "9370b606cfbf2e730ebc9669837bc1643ece222fd214bfbcc0a81075f5f556ee" } },
    "5.2.0-alpha-rc4": { "version": "5.2.0-alpha-rc4", "hash": { "algorithm": "sha256", "value": "8d08193f8819db49827c1687e1cf73be45268478b0aa2c99b791576d68646aa0" } },
    "5.2.0-alpha": { "version": "5.2.0-alpha", "hash": { "algorithm": "sha256", "value": "8d08193f8819db49827c1687e1cf73be45268478b0aa2c99b791576d68646aa0" } },
    "5.2.0-alpha-rc3": { "version": "5.2.0-alpha-rc3", "hash": { "algorithm": "sha256", "value": "e1b466477945367f0fbb16ba0271f8a1609206f6352e909eddb9f5adbbc852c7" } },
    "5.2.0-alpha-rc2": { "version": "5.2.0-alpha-rc2", "hash": { "algorithm": "sha256", "value": "9562008561caa63422a1369df03271b4a205de826aa0cf03b6a354b34854d344" } },
    "5.2.0-alpha-rc1": { "version": "5.2.0-alpha-rc1", "hash": { "algorithm": "sha256", "value": "37ca7c4cb232c0954268446a234240e678de0f3691aeda2848dbd12bd4024a91" } },
    "5.2.0-work5": { "version": "5.2.0-work5", "hash": { "algorithm": "sha256", "value": "fc6a2c730dc8fadf156fc3632a6a02713c4926f157ef34fa2f6bb4082f4e4a9b" } },
    "5.2.0-work4": { "version": "5.2.0-work4", "hash": { "algorithm": "sha256", "value": "8b2539bc6d417dc85e76c956f7630e3629c8412605db047f38bbfe7b29030b0c" } },
    "5.2.0-work3": { "version": "5.2.0-work3", "hash": { "algorithm": "sha256", "value": "c5c5e06b36fd0097ff8b65489a24391631009c816417798108f7103772977b4b" } },
    "5.2.0-work2": { "version": "5.2.0-work2", "hash": { "algorithm": "sha256", "value": "5344b821acfe3d623b12a2c4c454837fd3b15e9c5a96a65781663053fd05cd0a" } },
    "5.2.0-work1": { "version": "5.2.0-work1", "hash": { "algorithm": "sha256", "value": "c1af40891fa432af6bca1ed0d163c4f24f7997c4babbffa451f24f95bd54927a" } },
    "5.1.4-rc3": { "version": "5.1.4-rc3", "hash": { "algorithm": "sha256", "value": "b038e225eaf2a5b57c9bcc35cd13aa8c6c8288ef493d52970c9545074098af3a" } },
    "5.1.4-rc2": { "version": "5.1.4-rc2", "hash": { "algorithm": "sha256", "value": "64a8f099248064ebbd418e0efdc4de6aa10982ad3a4011acc9a58c8f37a4fce5" } },
    "5.1.4-rc1": { "version": "5.1.4-rc1", "hash": { "algorithm": "sha256", "value": "8b903c7f64c2595cd7fad7a63c828dd184c29ef426ad4c3e850f8a2594549778" } },
    "5.1.3-rc5": { "version": "5.1.3-rc5", "hash": { "algorithm": "sha256", "value": "6b5df2edaa5e02bf1a2d85e1442b2e329493b30b0c0780f77199d24f087d296d" } },
    "5.1.3-rc4": { "version": "5.1.3-rc4", "hash": { "algorithm": "sha256", "value": "65a157f49993ad93016b2f7301543024d6939e29da5e9d081a3c8c93d0796224" } },
    "5.1.3-rc3": { "version": "5.1.3-rc3", "hash": { "algorithm": "sha256", "value": "d26f27272d4064df9756ae3ba308edd00432f1558d99b757378ffc3f0b5da49f" } },
    "5.1.3-rc2": { "version": "5.1.3-rc2", "hash": { "algorithm": "sha256", "value": "5da201797c131bca05072028f45d7168d1aceb3ea45d0195aa23874aa78059aa" } },
    "5.1.3-rc1": { "version": "5.1.3-rc1", "hash": { "algorithm": "sha256", "value": "232219e6d26722047c52310fead85849b15480194fc47693c676670cd61bcc55" } },
    "5.1.2-rc5": { "version": "5.1.2-rc5", "hash": { "algorithm": "sha256", "value": "5cf098c6fe68d3d2d9221904f1017ff0286e4a9cc166a1452a456df9b88b3d9e" } },
    "5.1.2-rc4": { "version": "5.1.2-rc4", "hash": { "algorithm": "sha256", "value": "153911c46eb71e78c08eee39c8469e8e117a6fdf3ec656d4412c7c33841a0fd1" } },
    "5.1.2-rc3": { "version": "5.1.2-rc3", "hash": { "algorithm": "sha256", "value": "ca5730f14e5daab90d7dbd457ebd556d38206f7d0c1b5d238b740355ac91dbde" } },
    "5.1.2-rc2": { "version": "5.1.2-rc2", "hash": { "algorithm": "sha256", "value": "3f31cdfbc983c1aad7b439f2122cb15d168bce028b97992b66f9e4b1056a8d16" } },
    "5.1.2-rc1": { "version": "5.1.2-rc1", "hash": { "algorithm": "sha256", "value": "27c4b24d4536689ddfe3f5fbc0e5db8f922cfcfb6b3e9a30dbfb9d40f8f4658d" } },
    "5.1.1-rc4": { "version": "5.1.1-rc4", "hash": { "algorithm": "sha256", "value": "f9baa3c37915be2e7cb8fa205b042bd403fa0fe854fb92ede1861d9bc999ded9" } },
    "5.1.1-rc3": { "version": "5.1.1-rc3", "hash": { "algorithm": "sha256", "value": "b5eb2b1382716d5755a57e2a19fd919748a8a191fc1a69030f9225b85e6fff6c" } },
    "5.1.1-rc2": { "version": "5.1.1-rc2", "hash": { "algorithm": "sha256", "value": "b14642c7f5f211f8f899ae4e97891d025a72245a3c6938b4d37024513730d71e" } },
    "5.1.1-rc1": { "version": "5.1.1-rc1", "hash": { "algorithm": "sha256", "value": "84dda3f7a03999785488304e9561e4f6771366845d3488efbb8e077b20839c99" } }
};
function parsePucLuaVersion(version) {
    return new Promise((resolve, reject) => {
        const pucLuaVersion = version in CONVERT_LUA_RELEASE_VERSION ?
            (CONVERT_LUA_RELEASE_VERSION[version]) :
            ((version || LATEST_LUA_RELEASE_VERSION).trim());
        if (pucLuaVersion in LUA_RELEASES) {
            const releaseMatch = /^([0-9]+)\.([0-9]+)\.([0-9]+)$/.exec(pucLuaVersion);
            if (releaseMatch) {
                const major = Number(releaseMatch[1]);
                if (major >= 5) {
                    const minor = Number(releaseMatch[2]);
                    if (major == 5 && minor == 0) {
                        reject(new Error("The minimum supported Lua version is 5.1"));
                    }
                    else {
                        const build = Number(releaseMatch[3]);
                        const v = LUA_RELEASES[pucLuaVersion];
                        resolve(new PucLuaReleaseVersion(major, minor, build, v.hash.algorithm, v.hash.value));
                    }
                }
                else {
                    reject(new Error("Unsupported major version of Lua"));
                }
            }
            else {
                reject(new Error("Internal error: Unknown format for a Lua release version"));
            }
        }
        else if (pucLuaVersion in LUA_WORKS) {
            const workMatch = /^([0-9]+)\.([0-9]+)\.([0-9]+)\-([0-9a-zA-Z\-\.]+)$/.exec(pucLuaVersion);
            if (workMatch) {
                const major = Number(workMatch[1]);
                if (major >= 5) {
                    const minor = Number(workMatch[2]);
                    if (major == 5 && minor == 0) {
                        reject(new Error("The minimum supported Lua version is 5.1"));
                    }
                    else {
                        const build = Number(workMatch[3]);
                        const suffix = workMatch[4];
                        const v = LUA_WORKS[pucLuaVersion];
                        resolve(new PucLuaWorkVersion(major, minor, build, v.hash.algorithm, v.hash.value, suffix, false));
                    }
                }
                else {
                    reject(new Error("Unsupported major version of Lua"));
                }
            }
            else {
                reject(new Error("Internal error: Unknown format for a Lua work version"));
            }
        }
        else {
            reject(new Error("Unsupported version of Lua"));
        }
    });
}
class AbstractPucLuaVersion {
    getMajor() {
        return this.major;
    }
    getMinor() {
        return this.minor;
    }
    getBuild() {
        return this.build;
    }
    getHashAlgorithm() {
        return this.hashAlgorithm;
    }
    getHashValue() {
        return this.hashValue;
    }
    compareTo(other) {
        return (0, CompareVersions_1.compareVersions)([this.major, this.minor, this.build], [other.getMajor(), other.getMinor(), other.getBuild()]);
    }
    constructor(major, minor, build, hashAlgorithm, hashValue) {
        this.major = major;
        this.minor = minor;
        this.build = build;
        this.hashAlgorithm = hashAlgorithm;
        this.hashValue = hashValue;
    }
}
exports.AbstractPucLuaVersion = AbstractPucLuaVersion;
class PucLuaReleaseVersion extends AbstractPucLuaVersion {
    getString() {
        const M = this.getMajor();
        const m = this.getMinor();
        const b = this.getBuild();
        return `${M}.${m}.${b}`;
    }
    getDownloadUrl() {
        return `https://lua.org/ftp/lua-${this.getString()}.tar.gz`;
    }
    constructor(major, minor, build, hashAlgorithm, hashValue) {
        super(major, minor, build, hashAlgorithm, hashValue);
    }
}
exports.PucLuaReleaseVersion = PucLuaReleaseVersion;
class PucLuaWorkVersion extends AbstractPucLuaVersion {
    getSuffix() {
        return this.suffix;
    }
    getCurrent() {
        return this.current;
    }
    getString() {
        const M = this.getMajor();
        const m = this.getMinor();
        const b = this.getBuild();
        return `${M}.${m}.${b}-${this.suffix}`;
    }
    getDownloadUrl() {
        return this.current ?
            `https://lua.org/work/lua-${this.getString()}.tar.gz` :
            `https://lua.org/work/old/lua-${this.getString()}.tar.gz`;
    }
    constructor(major, minor, build, hashAlgorithm, hashValue, suffix, current) {
        super(major, minor, build, hashAlgorithm, hashValue);
        this.suffix = suffix;
        this.current = current;
    }
}
exports.PucLuaWorkVersion = PucLuaWorkVersion;
const LUA_5_1_1_VERSION = LUA_RELEASES["5.1.1"];
const LUA_5_2_0_VERSION = LUA_RELEASES["5.2.0"];
const LUA_5_3_0_VERSION = LUA_RELEASES["5.3.0"];
const LUA_5_4_0_VERSION = LUA_RELEASES["5.4.0"];
const LUA_5_5_0_VERSION = LUA_RELEASES["5.5.0"];
exports.LUA_51_VERSION = new PucLuaReleaseVersion(5, 1, 1, LUA_5_1_1_VERSION.hash.algorithm, LUA_5_1_1_VERSION.hash.value);
exports.LUA_52_VERSION = new PucLuaReleaseVersion(5, 2, 0, LUA_5_2_0_VERSION.hash.algorithm, LUA_5_2_0_VERSION.hash.value);
exports.LUA_53_VERSION = new PucLuaReleaseVersion(5, 3, 0, LUA_5_3_0_VERSION.hash.algorithm, LUA_5_3_0_VERSION.hash.value);
exports.LUA_54_VERSION = new PucLuaReleaseVersion(5, 4, 0, LUA_5_4_0_VERSION.hash.algorithm, LUA_5_4_0_VERSION.hash.value);
exports.LUA_55_VERSION = new PucLuaReleaseVersion(5, 5, 0, LUA_5_5_0_VERSION.hash.algorithm, LUA_5_5_0_VERSION.hash.value);


/***/ }),

/***/ 3714:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractApplyPatchesTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const promises_1 = __nccwpck_require__(1455);
const DefaultStdOutHandler_1 = __nccwpck_require__(840);
const ExecuteProcess_1 = __nccwpck_require__(6522);
const FindGitForWindowsInstallDir_1 = __nccwpck_require__(5407);
const FindProgram_1 = __nccwpck_require__(2437);
const ReadOnlyArray_1 = __nccwpck_require__(2483);
const CheckFiles_1 = __nccwpck_require__(8105);
const DownloadFile_1 = __nccwpck_require__(3864);
class AbstractApplyPatchesTarget {
    constructor(project, parent, dir, remotePatchesDir, patches) {
        this.project = project;
        this.parent = parent;
        this.dir = dir;
        this.remotePatchesDir = remotePatchesDir;
        this.patches = new ReadOnlyArray_1.ReadOnlyArray(patches);
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
    getDirectory() {
        return this.dir;
    }
    execute() {
        return new Promise((resolve, reject) => {
            if (this.patches.getLenght() > 0) {
                const applyPatches = (patch) => {
                    const patches_iter = (i) => {
                        if (i < this.patches.getLenght()) {
                            const patchName = this.patches.getItem(i);
                            const processPatch = (patchPath) => {
                                (0, CheckFiles_1.checkFiles)([patchPath])
                                    .then(() => {
                                    (0, ExecuteProcess_1.executeProcess)(patch, {
                                        cwd: this.dir,
                                        args: [
                                            "-Np1",
                                            "--force",
                                            "-i",
                                            patchPath
                                        ],
                                        verbose: true,
                                        stdout: DefaultStdOutHandler_1.defaultStdOutHandler
                                    })
                                        .then(code => {
                                        patches_iter(i + 1);
                                    })
                                        .catch(reject);
                                })
                                    .catch(reject);
                            };
                            if (/^https?:\/\//.test(patchName)) {
                                const patchPrefix = (0, node_path_1.join)(this.remotePatchesDir, "p-");
                                (0, promises_1.mkdtemp)(patchPrefix)
                                    .then(patchDir => {
                                    (0, DownloadFile_1.downloadFile)(patchName, (0, node_path_1.join)(patchDir, "main.patch"))
                                        .then(patchPath => {
                                        processPatch(patchPath);
                                    })
                                        .catch(reject);
                                })
                                    .catch(reject);
                            }
                            else {
                                const patchPath = (0, node_path_1.isAbsolute)(patchName) ? patchName : (0, node_path_1.join)(process.cwd(), patchName);
                                processPatch(patchPath);
                            }
                        }
                        else {
                            resolve();
                        }
                    };
                    patches_iter(0);
                };
                if (process.platform === 'win32') {
                    (0, FindProgram_1.findProgram)("patch", true)
                        .then(applyPatches)
                        .catch(err => {
                        (0, FindGitForWindowsInstallDir_1.findGitForWindowsInstallDir)()
                            .then(gitInstallDir => {
                            const patch = (0, node_path_1.join)(gitInstallDir, "usr", "bin", "patch.exe");
                            (0, CheckFiles_1.checkFiles)([patch])
                                .then(() => {
                                applyPatches(patch);
                            })
                                .catch(reject);
                        })
                            .catch(err => {
                            reject(new Error("Unable to find Git For Windows install dir"));
                        });
                    });
                }
                else {
                    (0, FindProgram_1.findProgram)("patch", true)
                        .then(applyPatches)
                        .catch(err => {
                        reject(new Error("Unable to find patch program required to apply patches"));
                    });
                }
            }
            else {
                resolve();
            }
        });
    }
}
exports.AbstractApplyPatchesTarget = AbstractApplyPatchesTarget;


/***/ }),

/***/ 6763:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractCreateDirectoriesTarget = void 0;
const promises_1 = __nccwpck_require__(1943);
const ReadOnlyArray_1 = __nccwpck_require__(2483);
class AbstractCreateDirectoriesTarget {
    constructor(dirs) {
        this.directories = new ReadOnlyArray_1.ReadOnlyArray(dirs);
    }
    getDirectories() {
        return this.directories;
    }
    execute() {
        return new Promise((resolve, reject) => {
            const len = this.directories.getLenght();
            const dir_iter = (i) => {
                if (i < len) {
                    const dir = this.directories.getItem(i);
                    (0, promises_1.stat)(dir)
                        .then(s => {
                        if (s.isDirectory()) {
                            dir_iter(i + 1);
                        }
                        else {
                            reject(new Error("The chosen path is already on disk, but it is not a directory"));
                        }
                    })
                        .catch(() => {
                        (0, promises_1.mkdir)(dir, { recursive: true })
                            .then(() => {
                            dir_iter(i + 1);
                        })
                            .catch(reject);
                    });
                }
                else {
                    resolve();
                }
            };
            dir_iter(0);
        });
    }
}
exports.AbstractCreateDirectoriesTarget = AbstractCreateDirectoriesTarget;


/***/ }),

/***/ 6962:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractUpdateLuaEnvVarsTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const GitHub_1 = __nccwpck_require__(5249);
const SequentialPromises_1 = __nccwpck_require__(923);
class AbstractUpdateLuaEnvVarsTarget {
    constructor(project, parent) {
        this.project = project;
        this.parent = parent;
    }
    setConfigPathToGitHub(envVar, targetDir) {
        return new Promise((resolve, reject) => {
            const currentEnvVar = (process.env[envVar] || "").trim();
            const newEnvVar = currentEnvVar ?
                `${currentEnvVar}${node_path_1.delimiter}${targetDir}` :
                `${targetDir}`;
            (0, GitHub_1.appendToGitHubEnvironmentVariables)(envVar, newEnvVar)
                .then(resolve)
                .catch(reject);
        });
    }
    execute() {
        return new Promise((resolve, reject) => {
            const changes = [
                () => this.setConfigPathToGitHub("PKG_CONFIG_PATH", this.getProjectInstallPkgConfigDir()),
                () => this.setConfigPathToGitHub("CMAKE_PREFIX_PATH", this.getProjectInstallDir())
            ];
            if (process.platform === "darwin") {
                changes.push(() => this.setConfigPathToGitHub("DYLD_LIBRARY_PATH", this.getProjectInstallLibDir()));
            }
            else if (process.platform !== "win32") {
                changes.push(() => this.setConfigPathToGitHub("LD_LIBRARY_PATH", this.getProjectInstallLibDir()));
            }
            changes.push(() => (0, GitHub_1.appendToGitHubPath)(this.getProjectInstallBinDir()));
            (0, SequentialPromises_1.sequentialPromises)(changes)
                .then(_ => {
                resolve();
            })
                .catch(reject);
        });
    }
    getProject() {
        return this.project;
    }
    getParent() {
        return this.parent;
    }
}
exports.AbstractUpdateLuaEnvVarsTarget = AbstractUpdateLuaEnvVarsTarget;


/***/ }),

/***/ 5378:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractFetchCompressedTarget = void 0;
const node_path_1 = __nccwpck_require__(6760);
const DownloadFile_1 = __nccwpck_require__(3864);
const FileHash_1 = __nccwpck_require__(6616);
const CacheService_1 = __nccwpck_require__(2202);
class AbstractFetchCompressedTarget {
    getUrl() {
        return this.url;
    }
    getWorkDir() {
        return this.workDir;
    }
    getCacheKey() {
        return this.cacheKey;
    }
    constructor(url, workDir, cacheKey, handler, opts) {
        var _a;
        this.url = url;
        this.workDir = workDir;
        this.cacheKey = cacheKey;
        this.handler = handler;
        this.opts = {};
        this.opts.filename = (_a = opts === null || opts === void 0 ? void 0 : opts.filename) !== null && _a !== void 0 ? _a : (0, node_path_1.basename)(url.toString());
        this.opts.maxTries = opts === null || opts === void 0 ? void 0 : opts.maxTries;
        if (opts === null || opts === void 0 ? void 0 : opts.fileHash) {
            this.opts.fileHash = {
                algorithm: opts.fileHash.algorithm,
                expectedHash: opts.fileHash.expectedHash
            };
        }
    }
    processArchive(file) {
        return new Promise((resolve, reject) => {
            const fileHash = this.opts.fileHash;
            if (fileHash) {
                (0, FileHash_1.verifyFileHash)(file, fileHash.algorithm, fileHash.expectedHash)
                    .then(match => {
                    if (match) {
                        this.handler(file, { cwd: this.workDir, verbose: true })
                            .then(code => {
                            if (code === 0) {
                                resolve();
                            }
                            else {
                                reject(new Error(`Failed to extract ${(0, node_path_1.basename)(file)}`));
                            }
                        })
                            .catch(reject);
                    }
                    else {
                        reject(new Error("File hash mismatch"));
                    }
                })
                    .catch(reject);
            }
            else {
                this.handler(file, { cwd: this.workDir, verbose: true })
                    .then(code => {
                    if (code === 0) {
                        resolve();
                    }
                    else {
                        reject(new Error(`Failed to extract ${(0, node_path_1.basename)(file)}`));
                    }
                })
                    .catch(reject);
            }
        });
    }
    saveOnCache(file, useCache) {
        return new Promise((resolve, reject) => {
            this.processArchive(file)
                .then(() => {
                if (useCache && this.cacheKey !== null) {
                    CacheService_1.CacheService.instance().save(file, this.cacheKey)
                        .then(resolve)
                        .catch(() => {
                        resolve();
                    });
                }
                else {
                    resolve();
                }
            })
                .catch(reject);
        });
    }
    execute() {
        return new Promise((resolve, reject) => {
            const filename = this.opts.filename;
            const outFile = (0, node_path_1.join)(this.workDir, filename);
            const performDownload = (useCache) => {
                (0, DownloadFile_1.downloadFile)(this.url, outFile, this.opts.maxTries)
                    .then(file => {
                    this.saveOnCache(file, useCache)
                        .then(resolve)
                        .catch(reject);
                })
                    .catch(reject);
            };
            if (CacheService_1.CacheService.instance().useCache() && this.cacheKey !== null) {
                CacheService_1.CacheService.instance().restore(outFile, this.cacheKey)
                    .then(() => {
                    this.processArchive(outFile)
                        .then(resolve)
                        .catch(reject);
                })
                    .catch(err => {
                    performDownload(true);
                });
            }
            else {
                performDownload(false);
            }
        });
    }
}
exports.AbstractFetchCompressedTarget = AbstractFetchCompressedTarget;


/***/ }),

/***/ 1299:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractFetchTarballTarget = void 0;
const ExtractTarGz_1 = __nccwpck_require__(3143);
const AbstractFetchCompressedTarget_1 = __nccwpck_require__(5378);
class AbstractFetchTarballTarget extends AbstractFetchCompressedTarget_1.AbstractFetchCompressedTarget {
    constructor(url, workDir, cacheKey, opts) {
        super(url, workDir, cacheKey, ExtractTarGz_1.extractTarGz, opts);
    }
}
exports.AbstractFetchTarballTarget = AbstractFetchTarballTarget;


/***/ }),

/***/ 9348:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TargetPipeline = void 0;
class TargetPipeline {
    constructor(initialTarget) {
        this.initialTarget = initialTarget;
    }
    init() {
        return new Promise((resolve, reject) => {
            resolve(this.initialTarget);
        });
    }
    finalize() {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    execute() {
        return new Promise((resolve, reject) => {
            let failed = false;
            let finished = false;
            let err;
            this.init()
                .then(tgt => {
                const iter = (target) => {
                    if (!(failed || finished)) {
                        target.init()
                            .then(() => {
                            target.execute()
                                .then(() => {
                                target.finalize()
                                    .then(() => {
                                    const nextTarget = target.getNext();
                                    if (!nextTarget) {
                                        finished = true;
                                    }
                                    iter(nextTarget);
                                })
                                    .catch(finalizeErr => {
                                    failed = true;
                                    err = finalizeErr;
                                    iter(target);
                                });
                            })
                                .catch(execErr => {
                                target.finalize()
                                    .then(() => {
                                    failed = true;
                                    err = execErr;
                                    iter(target);
                                })
                                    .catch(finalizeErr => {
                                    failed = true;
                                    err = finalizeErr;
                                    iter(target);
                                });
                            });
                        })
                            .catch(initErr => {
                            failed = true;
                            err = initErr;
                            iter(target);
                        });
                    }
                    else if (err) {
                        this.finalize()
                            .then(() => {
                            reject(err);
                        })
                            .catch(reject);
                    }
                    else {
                        this.finalize()
                            .then(resolve)
                            .catch(reject);
                    }
                };
                iter(tgt);
            })
                .catch(reject);
        });
    }
}
exports.TargetPipeline = TargetPipeline;


/***/ }),

/***/ 9775:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GccArchiver = void 0;
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
const ExecuteProcess_1 = __nccwpck_require__(6522);
const GetSetProperty_1 = __nccwpck_require__(8195);
const ToolchainCompositeArgument_1 = __nccwpck_require__(1155);
const ToolchainRawArgument_1 = __nccwpck_require__(7906);
class GccArchiver {
    addFlag(value) {
        this.flags.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(value)]));
    }
    addInputFile(path) {
        this.inputs.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(path)]));
    }
    setOutputFile(path) {
        this.output = new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(path)]);
    }
    getArchiveExtension() {
        return ".a";
    }
    execute() {
        return new Promise((resolve, reject) => {
            if (this.output) {
                const args = [];
                const arrays = [this.flags, [this.output], this.inputs];
                for (const arrayElement of arrays) {
                    for (const commandLineArgument of arrayElement) {
                        const count = commandLineArgument.getLenght();
                        for (let i = 0; i < count; i++) {
                            args.push(commandLineArgument.getItem(i).getString());
                        }
                    }
                }
                (0, ExecuteProcess_1.executeProcess)(this._path.getValue(), { args: args, verbose: true })
                    .then(code => {
                    if (code === 0) {
                        resolve();
                    }
                    else {
                        reject(new Error("Archiver failed"));
                    }
                })
                    .catch(reject);
            }
            else {
                reject(new Error("Archiver output file was not set"));
            }
        });
    }
    reset() {
        this.flags.splice(0, this.flags.length);
        this.inputs.splice(0, this.inputs.length);
        this.output = undefined;
        this._path.setValue(ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getAR());
    }
    constructor() {
        this.flags = [];
        this.inputs = [];
        this.output = undefined;
        this._path = new GetSetProperty_1.GetSetProperty(ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getAR());
        this.reset();
    }
    path() {
        return this._path;
    }
}
exports.GccArchiver = GccArchiver;


/***/ }),

/***/ 4346:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GccCompiler = void 0;
const ExecuteProcess_1 = __nccwpck_require__(6522);
const GetSetProperty_1 = __nccwpck_require__(8195);
const ToolchainCompositeArgument_1 = __nccwpck_require__(1155);
const ToolchainRawArgument_1 = __nccwpck_require__(7906);
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
class GccCompiler {
    addFlag(value) {
        this.flags.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(value)]));
    }
    addDefine(key, value) {
        this.defines.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument(value ?
            [new ToolchainRawArgument_1.ToolchainRawArgument(`-D${key}=${value}`)] :
            [new ToolchainRawArgument_1.ToolchainRawArgument(`-D${key}`)]));
    }
    addIncludeDir(dir) {
        this.includeDirs.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(`-I${dir}`)]));
    }
    setInputFile(path) {
        this.input = new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(path)]);
    }
    setOutputFile(path) {
        this.output = new ToolchainCompositeArgument_1.ToolchainCompositeArgument([
            new ToolchainRawArgument_1.ToolchainRawArgument("-o"),
            new ToolchainRawArgument_1.ToolchainRawArgument(path)
        ]);
    }
    setSpeedOptimizationSwitch() {
        this.optimization = new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument("-O2")]);
    }
    setWarningSwitch() {
        this.warnings = new ToolchainCompositeArgument_1.ToolchainCompositeArgument([
            new ToolchainRawArgument_1.ToolchainRawArgument("-Wall"),
            new ToolchainRawArgument_1.ToolchainRawArgument("-Wextra")
        ]);
    }
    getObjectFileExtension() {
        return ".o";
    }
    execute() {
        return new Promise((resolve, reject) => {
            if (this.output) {
                if (this.input) {
                    const args = [];
                    const compileOnly = new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument("-c")]);
                    const arrays = [[compileOnly]];
                    if (this.optimization) {
                        arrays.push([this.optimization]);
                    }
                    if (this.warnings) {
                        arrays.push([this.warnings]);
                    }
                    for (const instruction of [this.flags, this.defines, this.includeDirs, [this.output], [this.input]]) {
                        arrays.push(instruction);
                    }
                    for (const arrayElement of arrays) {
                        for (const compositeArgument of arrayElement) {
                            const count = compositeArgument.getLenght();
                            for (let i = 0; i < count; i++) {
                                args.push(compositeArgument.getItem(i).getString());
                            }
                        }
                    }
                    (0, ExecuteProcess_1.executeProcess)(this._path.getValue(), { args: args, verbose: true })
                        .then(code => {
                        if (code === 0) {
                            resolve();
                        }
                        else {
                            reject(new Error("Compiler failed"));
                        }
                    })
                        .catch(reject);
                }
                else {
                    reject(new Error("Compiler input file was not set"));
                }
            }
            else {
                reject(new Error("Compiler output file was not set"));
            }
        });
    }
    reset() {
        this.flags.splice(0, this.flags.length);
        this.defines.splice(0, this.defines.length);
        this.includeDirs.splice(0, this.includeDirs.length);
        this.input = undefined;
        this.output = undefined;
        this.optimization = undefined;
        this.warnings = undefined;
        this._path.setValue(ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getCC());
    }
    constructor() {
        this.flags = [];
        this.defines = [];
        this.includeDirs = [];
        this.input = undefined;
        this.output = undefined;
        this.optimization = undefined;
        this.warnings = undefined;
        this._path = new GetSetProperty_1.GetSetProperty(ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getCC());
        this.reset();
    }
    path() {
        return this._path;
    }
}
exports.GccCompiler = GccCompiler;


/***/ }),

/***/ 6316:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GccLinker = void 0;
const ExecuteProcess_1 = __nccwpck_require__(6522);
const GetSetProperty_1 = __nccwpck_require__(8195);
const ToolchainCompositeArgument_1 = __nccwpck_require__(1155);
const ToolchainRawArgument_1 = __nccwpck_require__(7906);
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
class GccLinker {
    addFlag(value) {
        this.flags.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(value)]));
    }
    addObjectFile(path) {
        this.objectFiles.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(path)]));
    }
    addLibDir(dir) {
        this.libDirs.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(`-L${dir}`)]));
    }
    addLibrary(path) {
        this.libraries.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(path)]));
    }
    addLinkLibrary(name) {
        this.linkLibraries.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(`-l${name}`)]));
    }
    setImportLibrary(path) {
        this.outImplib = new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(`-Wl,--out-implib,${path}`)]);
    }
    getImportLibraryExtension() {
        return (process.platform === 'win32' || process.platform === 'cygwin' ? ".dll.a" : ".a");
    }
    setOutputFile(path) {
        this.output = new ToolchainCompositeArgument_1.ToolchainCompositeArgument([
            new ToolchainRawArgument_1.ToolchainRawArgument("-o"),
            new ToolchainRawArgument_1.ToolchainRawArgument(path)
        ]);
    }
    setOutputMode(mode) {
        this.outputMode = mode;
    }
    execute() {
        return new Promise((resolve, reject) => {
            if (this.output) {
                const args = [];
                const arrays = [];
                if (this.outputMode && this.outputMode === "shared") {
                    arrays.push([new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(process.platform === 'darwin' ? "-dynamiclib" : "-shared")])]);
                }
                if (this.outImplib) {
                    arrays.push([this.outImplib]);
                }
                for (const instruction of [this.flags, this.libDirs, [this.output], this.objectFiles, this.libraries, this.linkLibraries]) {
                    arrays.push(instruction);
                }
                for (const arrayElement of arrays) {
                    for (const compositeArgument of arrayElement) {
                        const count = compositeArgument.getLenght();
                        for (let i = 0; i < count; i++) {
                            args.push(compositeArgument.getItem(i).getString());
                        }
                    }
                }
                (0, ExecuteProcess_1.executeProcess)(this._path.getValue(), { args: args, verbose: true })
                    .then(code => {
                    if (code === 0) {
                        resolve();
                    }
                    else {
                        reject(new Error("Linker failed"));
                    }
                })
                    .catch(reject);
            }
            else {
                reject(new Error("Linker output file was not set"));
            }
        });
    }
    reset() {
        this.flags.splice(0, this.flags.length);
        this.objectFiles.splice(0, this.objectFiles.length);
        this.libDirs.splice(0, this.libDirs.length);
        this.libraries.splice(0, this.libraries.length);
        this.linkLibraries.splice(0, this.linkLibraries.length);
        this.outImplib = undefined;
        this.output = undefined;
        this.outputMode = undefined;
        this._path.setValue(ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLD());
    }
    constructor() {
        this.flags = [];
        this.objectFiles = [];
        this.libDirs = [];
        this.libraries = [];
        this.linkLibraries = [];
        this.outImplib = undefined;
        this.output = undefined;
        this.outputMode = undefined;
        this._path = new GetSetProperty_1.GetSetProperty(ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLD());
        this.reset();
    }
    path() {
        return this._path;
    }
}
exports.GccLinker = GccLinker;


/***/ }),

/***/ 6287:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GccRanlib = void 0;
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
const ExecuteProcess_1 = __nccwpck_require__(6522);
const GetSetProperty_1 = __nccwpck_require__(8195);
const ToolchainCompositeArgument_1 = __nccwpck_require__(1155);
const ToolchainRawArgument_1 = __nccwpck_require__(7906);
class GccRanlib {
    addFlag(value) {
        this.flags.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(value)]));
    }
    setInputFile(path) {
        this.input = new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(path)]);
    }
    execute() {
        return new Promise((resolve, reject) => {
            if (this.input) {
                const args = [];
                const arrays = [this.flags, [this.input]];
                for (const arrayElement of arrays) {
                    for (const commandLineArgument of arrayElement) {
                        const count = commandLineArgument.getLenght();
                        for (let i = 0; i < count; i++) {
                            args.push(commandLineArgument.getItem(i).getString());
                        }
                    }
                }
                (0, ExecuteProcess_1.executeProcess)(this._path.getValue(), { args: args, verbose: true })
                    .then(code => {
                    if (code === 0) {
                        resolve();
                    }
                    else {
                        reject(new Error("Ranlib failed"));
                    }
                })
                    .catch(reject);
            }
            else {
                reject(new Error("Ranlib input file was not set"));
            }
        });
    }
    reset() {
        this.flags.splice(0, this.flags.length);
        this.input = undefined;
        this._path.setValue(ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getRANLIB());
    }
    constructor() {
        this.flags = [];
        this.input = undefined;
        this._path = new GetSetProperty_1.GetSetProperty(ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getRANLIB());
        this.reset();
    }
    path() {
        return this._path;
    }
}
exports.GccRanlib = GccRanlib;


/***/ }),

/***/ 3909:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GccStrip = void 0;
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
const ExecuteProcess_1 = __nccwpck_require__(6522);
const GetSetProperty_1 = __nccwpck_require__(8195);
const ToolchainCompositeArgument_1 = __nccwpck_require__(1155);
const ToolchainRawArgument_1 = __nccwpck_require__(7906);
class GccStrip {
    addFlag(value) {
        this.flags.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(value)]));
    }
    addStripAll() {
        this.addFlag("--strip-all");
    }
    addStripUnneeded() {
        this.addFlag("--strip-unneeded");
    }
    setInputFile(path) {
        this.input = new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(path)]);
    }
    execute() {
        return new Promise((resolve, reject) => {
            if (this.input) {
                const args = [];
                const arrays = [this.flags, [this.input]];
                for (const arrayElement of arrays) {
                    for (const commandLineArgument of arrayElement) {
                        const count = commandLineArgument.getLenght();
                        for (let i = 0; i < count; i++) {
                            args.push(commandLineArgument.getItem(i).getString());
                        }
                    }
                }
                (0, ExecuteProcess_1.executeProcess)(this._path.getValue(), { args: args, verbose: true })
                    .then(code => {
                    if (code === 0) {
                        resolve();
                    }
                    else {
                        reject(new Error("Strip failed"));
                    }
                })
                    .catch(reject);
            }
            else {
                reject(new Error("Strip input file was not set"));
            }
        });
    }
    reset() {
        this.flags.splice(0, this.flags.length);
        this.input = undefined;
        this._path.setValue(ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getSTRIP());
    }
    constructor() {
        this.flags = [];
        this.input = undefined;
        this._path = new GetSetProperty_1.GetSetProperty(ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getSTRIP());
        this.reset();
    }
    path() {
        return this._path;
    }
}
exports.GccStrip = GccStrip;


/***/ }),

/***/ 4468:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GccToolchain = void 0;
const GccArchiver_1 = __nccwpck_require__(9775);
const GccCompiler_1 = __nccwpck_require__(4346);
const GccLinker_1 = __nccwpck_require__(6316);
const GccRanlib_1 = __nccwpck_require__(6287);
const GccStrip_1 = __nccwpck_require__(3909);
class GccToolchain {
    constructor() {
        this.compiler = new GccCompiler_1.GccCompiler();
        this.linker = new GccLinker_1.GccLinker();
        this.archiver = new GccArchiver_1.GccArchiver();
        this.ranlib = new GccRanlib_1.GccRanlib();
        this.strip = new GccStrip_1.GccStrip();
    }
    getCompiler() {
        return this.compiler;
    }
    getLinker() {
        return this.linker;
    }
    getArchiver() {
        return this.archiver;
    }
    getRanlib() {
        return this.ranlib;
    }
    getStrip() {
        return this.strip;
    }
}
exports.GccToolchain = GccToolchain;


/***/ }),

/***/ 9372:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isGccLikeToolchain = isGccLikeToolchain;
function isGccLikeToolchain(toolchain) {
    return ('getRanlib' in toolchain && 'getStrip' in toolchain);
}


/***/ }),

/***/ 8073:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hasWin32ImportLibraryDecorator = hasWin32ImportLibraryDecorator;
function hasWin32ImportLibraryDecorator(linker) {
    return ('setImportLibrary' in linker && 'getImportLibraryExtension' in linker);
}


/***/ }),

/***/ 5535:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MsvcArchiver = void 0;
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
const ExecuteProcess_1 = __nccwpck_require__(6522);
const GetSetProperty_1 = __nccwpck_require__(8195);
const ToolchainCompositeArgument_1 = __nccwpck_require__(1155);
const ToolchainRawArgument_1 = __nccwpck_require__(7906);
class MsvcArchiver {
    addFlag(value) {
        this.flags.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(value)]));
    }
    addInputFile(path) {
        this.inputs.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(path)]));
    }
    setOutputFile(path) {
        this.output = new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(`/OUT:${path}`)]);
    }
    getArchiveExtension() {
        return ".lib";
    }
    execute() {
        return new Promise((resolve, reject) => {
            if (this.output) {
                const args = [];
                const arrays = [this.flags, [this.output], this.inputs];
                for (const arrayElement of arrays) {
                    for (const commandLineArgument of arrayElement) {
                        const count = commandLineArgument.getLenght();
                        for (let i = 0; i < count; i++) {
                            args.push(commandLineArgument.getItem(i).getString());
                        }
                    }
                }
                (0, ExecuteProcess_1.executeProcess)(this._path.getValue(), { args: args, verbose: true })
                    .then(code => {
                    if (code === 0) {
                        resolve();
                    }
                    else {
                        reject(new Error("Archiver failed"));
                    }
                })
                    .catch(reject);
            }
            else {
                reject(new Error("Archiver output file was not set"));
            }
        });
    }
    reset() {
        this.flags.splice(0, this.flags.length);
        this.inputs.splice(0, this.inputs.length);
        this.output = undefined;
        this._path.setValue(ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getAR());
    }
    constructor() {
        this.flags = [];
        this.inputs = [];
        this.output = undefined;
        this._path = new GetSetProperty_1.GetSetProperty(ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getAR());
        this.reset();
    }
    path() {
        return this._path;
    }
}
exports.MsvcArchiver = MsvcArchiver;


/***/ }),

/***/ 8922:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MsvcCompiler = void 0;
const ExecuteProcess_1 = __nccwpck_require__(6522);
const GetSetProperty_1 = __nccwpck_require__(8195);
const ToolchainCompositeArgument_1 = __nccwpck_require__(1155);
const ToolchainRawArgument_1 = __nccwpck_require__(7906);
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
class MsvcCompiler {
    addFlag(value) {
        this.flags.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(value)]));
    }
    addDefine(key, value) {
        this.defines.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument(value ?
            [new ToolchainRawArgument_1.ToolchainRawArgument(`/D${key}=${value}`)] :
            [new ToolchainRawArgument_1.ToolchainRawArgument(`/D${key}`)]));
    }
    addIncludeDir(dir) {
        this.includeDirs.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(`/I${dir}`)]));
    }
    setInputFile(path) {
        this.input = new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(path)]);
    }
    setOutputFile(path) {
        this.output = new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(`/Fo${path}`)]);
    }
    setSpeedOptimizationSwitch() {
        this.optimization = new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument("/O2")]);
    }
    setWarningSwitch() {
        this.warnings = new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument("/W3")]);
    }
    getObjectFileExtension() {
        return ".obj";
    }
    execute() {
        return new Promise((resolve, reject) => {
            if (this.output) {
                if (this.input) {
                    const args = [];
                    const compileOnly = new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument("/c")]);
                    const arrays = [[compileOnly]];
                    if (this.optimization) {
                        arrays.push([this.optimization]);
                    }
                    if (this.warnings) {
                        arrays.push([this.warnings]);
                    }
                    for (const instruction of [this.flags, this.defines, this.includeDirs, [this.output], [this.input]]) {
                        arrays.push(instruction);
                    }
                    for (const arrayElement of arrays) {
                        for (const compositeArgument of arrayElement) {
                            const count = compositeArgument.getLenght();
                            for (let i = 0; i < count; i++) {
                                args.push(compositeArgument.getItem(i).getString());
                            }
                        }
                    }
                    (0, ExecuteProcess_1.executeProcess)(this._path.getValue(), { args: args, verbose: true })
                        .then(code => {
                        if (code === 0) {
                            resolve();
                        }
                        else {
                            reject(new Error("Compiler failed"));
                        }
                    })
                        .catch(reject);
                }
                else {
                    reject(new Error("Compiler input file was not set"));
                }
            }
            else {
                reject(new Error("Compiler output file was not set"));
            }
        });
    }
    reset() {
        this.flags.splice(0, this.flags.length);
        this.defines.splice(0, this.defines.length);
        this.includeDirs.splice(0, this.includeDirs.length);
        this.input = undefined;
        this.output = undefined;
        this.optimization = undefined;
        this.warnings = undefined;
        this._path.setValue(ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getCC());
    }
    constructor() {
        this.flags = [];
        this.defines = [];
        this.includeDirs = [];
        this.input = undefined;
        this.output = undefined;
        this.optimization = undefined;
        this.warnings = undefined;
        this._path = new GetSetProperty_1.GetSetProperty(ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getCC());
        this.reset();
    }
    path() {
        return this._path;
    }
}
exports.MsvcCompiler = MsvcCompiler;


/***/ }),

/***/ 828:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MsvcLinker = void 0;
const ExecuteProcess_1 = __nccwpck_require__(6522);
const GetSetProperty_1 = __nccwpck_require__(8195);
const ToolchainCompositeArgument_1 = __nccwpck_require__(1155);
const ToolchainRawArgument_1 = __nccwpck_require__(7906);
const ToolchainEnvironmentVariables_1 = __nccwpck_require__(5921);
class MsvcLinker {
    addFlag(value) {
        this.flags.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(value)]));
    }
    addObjectFile(path) {
        this.objectFiles.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(path)]));
    }
    addLibDir(dir) {
        this.libDirs.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(`/LIBPATH:${dir}`)]));
    }
    addLibrary(path) {
        this.libraries.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(path)]));
    }
    addLinkLibrary(name) {
        this.linkLibraries.push(new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(name)]));
    }
    setImportLibrary(path) {
        this.outImplib = new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(`/IMPLIB:${path}`)]);
    }
    getImportLibraryExtension() {
        return ".lib";
    }
    setOutputFile(path) {
        this.output = new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument(`/OUT:${path}`)]);
    }
    setOutputMode(mode) {
        this.outputMode = mode;
    }
    execute() {
        return new Promise((resolve, reject) => {
            if (this.output) {
                const args = [];
                const arrays = [];
                if (this.outputMode && this.outputMode === "shared") {
                    arrays.push([new ToolchainCompositeArgument_1.ToolchainCompositeArgument([new ToolchainRawArgument_1.ToolchainRawArgument("/DLL")])]);
                }
                if (this.outImplib) {
                    arrays.push([this.outImplib]);
                }
                for (const instruction of [this.flags, this.libDirs, [this.output], this.objectFiles, this.libraries, this.linkLibraries]) {
                    arrays.push(instruction);
                }
                for (const arrayElement of arrays) {
                    for (const compositeArgument of arrayElement) {
                        const count = compositeArgument.getLenght();
                        for (let i = 0; i < count; i++) {
                            args.push(compositeArgument.getItem(i).getString());
                        }
                    }
                }
                (0, ExecuteProcess_1.executeProcess)(this._path.getValue(), { args: args, verbose: true })
                    .then(code => {
                    if (code === 0) {
                        resolve();
                    }
                    else {
                        reject(new Error("Linker failed"));
                    }
                })
                    .catch(reject);
            }
            else {
                reject(new Error("Linker output file was not set"));
            }
        });
    }
    reset() {
        this.flags.splice(0, this.flags.length);
        this.objectFiles.splice(0, this.objectFiles.length);
        this.libDirs.splice(0, this.libDirs.length);
        this.libraries.splice(0, this.libraries.length);
        this.linkLibraries.splice(0, this.linkLibraries.length);
        this.outImplib = undefined;
        this.output = undefined;
        this.outputMode = undefined;
        this._path.setValue(ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLD());
    }
    constructor() {
        this.flags = [];
        this.objectFiles = [];
        this.libDirs = [];
        this.libraries = [];
        this.linkLibraries = [];
        this.outImplib = undefined;
        this.output = undefined;
        this.outputMode = undefined;
        this._path = new GetSetProperty_1.GetSetProperty(ToolchainEnvironmentVariables_1.ToolchainEnvironmentVariables.instance().getLD());
        this.reset();
    }
    path() {
        return this._path;
    }
}
exports.MsvcLinker = MsvcLinker;


/***/ }),

/***/ 2980:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MsvcToolchain = void 0;
const MsvcArchiver_1 = __nccwpck_require__(5535);
const MsvcCompiler_1 = __nccwpck_require__(8922);
const MsvcLinker_1 = __nccwpck_require__(828);
class MsvcToolchain {
    constructor() {
        this.compiler = new MsvcCompiler_1.MsvcCompiler();
        this.linker = new MsvcLinker_1.MsvcLinker();
        this.archiver = new MsvcArchiver_1.MsvcArchiver();
    }
    getCompiler() {
        return this.compiler;
    }
    getLinker() {
        return this.linker;
    }
    getArchiver() {
        return this.archiver;
    }
}
exports.MsvcToolchain = MsvcToolchain;


/***/ }),

/***/ 1155:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToolchainCompositeArgument = void 0;
const ReadOnlyArray_1 = __nccwpck_require__(2483);
class ToolchainCompositeArgument extends ReadOnlyArray_1.ReadOnlyArray {
}
exports.ToolchainCompositeArgument = ToolchainCompositeArgument;


/***/ }),

/***/ 5921:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToolchainEnvironmentVariables = void 0;
const GitHubInput_1 = __nccwpck_require__(1621);
const ParseInputSemiColon_1 = __nccwpck_require__(5006);
class ToolchainEnvironmentVariables {
    static instance() {
        if (!ToolchainEnvironmentVariables._instance) {
            ToolchainEnvironmentVariables._instance = new ToolchainEnvironmentVariables();
        }
        return ToolchainEnvironmentVariables._instance;
    }
    getRawCC() {
        let msystem = process.env["MSYSTEM"] || "";
        if (msystem) {
            msystem = msystem.toUpperCase().trim();
        }
        return (GitHubInput_1.GitHubInput.instance().getInputCC() || process.env["CC"] ||
            (process.env["VCINSTALLDIR"] ? "cl" :
                ((process.platform === 'win32' && !msystem.startsWith("CLANG")) ? "gcc" : "cc"))).trim();
    }
    getRawLD() {
        return (GitHubInput_1.GitHubInput.instance().getInputLD() || process.env["LD"] ||
            (process.env["VCINSTALLDIR"] ? "link" :
                (process.platform === 'win32' ? "gcc" : "cc"))).trim();
    }
    getRawAR() {
        return (GitHubInput_1.GitHubInput.instance().getInputAR() || process.env["AR"] || (process.env["VCINSTALLDIR"] ? "lib" : "ar")).trim();
    }
    getRawSTRIP() {
        return (GitHubInput_1.GitHubInput.instance().getInputSTRIP() || process.env["STRIP"] || "strip").trim();
    }
    getRawRANLIB() {
        return (GitHubInput_1.GitHubInput.instance().getInputRANLIB() || process.env["RANLIB"] || "ranlib").trim();
    }
    getRawRC() {
        return (GitHubInput_1.GitHubInput.instance().getInputRC() || process.env["RC"] || (process.env["VCINSTALLDIR"] ? "rc" : "windres")).trim();
    }
    getCC() {
        return this.getToolchainPrefix() + this.getRawCC();
    }
    getLD() {
        return this.getToolchainPrefix() + this.getRawLD();
    }
    getAR() {
        return this.getToolchainPrefix() + this.getRawAR();
    }
    getSTRIP() {
        return this.getToolchainPrefix() + this.getRawSTRIP();
    }
    getRANLIB() {
        return this.getToolchainPrefix() + this.getRawRANLIB();
    }
    getRC() {
        return this.getToolchainPrefix() + this.getRawRC();
    }
    getMake() {
        return (GitHubInput_1.GitHubInput.instance().getInputMake() || process.env["MAKE"] ||
            (process.env["VCINSTALLDIR"] ? "nmake" :
                (process.platform === 'win32' ?
                    "mingw32-make" :
                    (process.platform === 'freebsd' || process.platform === 'openbsd' || process.platform === 'netbsd') ?
                        "gmake" : "make"))).trim();
    }
    getToolchainPrefix() {
        return (GitHubInput_1.GitHubInput.instance().getInputToolchainPrefix() || process.env["TOOLCHAIN_PREFIX"] || "");
    }
    getSemiColonSeparatedInput(inputGetter, inputName) {
        const rawInput = inputGetter() || process.env[inputName];
        return (0, ParseInputSemiColon_1.parseInputSemiColon)(rawInput);
    }
    getCflagsExtra() {
        return this.getSemiColonSeparatedInput(() => GitHubInput_1.GitHubInput.instance().getInputCflagsExtra(), "CFLAGS_EXTRA");
    }
    getIncDirsExtra() {
        return this.getSemiColonSeparatedInput(() => GitHubInput_1.GitHubInput.instance().getInputIncDirsExtra(), "INCDIRS_EXTRA");
    }
    getLdFlagsExtra() {
        return this.getSemiColonSeparatedInput(() => GitHubInput_1.GitHubInput.instance().getInputLdflagsExtra(), "LDFLAGS_EXTRA");
    }
    getLibDirsExtra() {
        return this.getSemiColonSeparatedInput(() => GitHubInput_1.GitHubInput.instance().getInputLibDirsExtra(), "LIBDIRS_EXTRA");
    }
    getLibsExtra() {
        return this.getSemiColonSeparatedInput(() => GitHubInput_1.GitHubInput.instance().getInputLibsExtra(), "LIBS_EXTRA");
    }
    getLuaPatches() {
        return this.getSemiColonSeparatedInput(() => GitHubInput_1.GitHubInput.instance().getInputLuaPatches(), "LUA_PATCHES");
    }
    getLuaRocksPatches() {
        return this.getSemiColonSeparatedInput(() => GitHubInput_1.GitHubInput.instance().getInputLuaRocksPatches(), "LUAROCKS_PATCHES");
    }
    constructor() {
    }
}
exports.ToolchainEnvironmentVariables = ToolchainEnvironmentVariables;


/***/ }),

/***/ 7906:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToolchainRawArgument = void 0;
class ToolchainRawArgument {
    getString() {
        return this.value;
    }
    constructor(value) {
        this.value = value;
    }
}
exports.ToolchainRawArgument = ToolchainRawArgument;


/***/ }),

/***/ 8105:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkFiles = checkFiles;
const promises_1 = __nccwpck_require__(1455);
function checkFiles(files) {
    return new Promise((resolve, reject) => {
        const len = files.length;
        const file_iter = (i) => {
            if (i < len) {
                const f = files[i];
                (0, promises_1.stat)(f)
                    .then(s => {
                    if (s.isFile()) {
                        file_iter(i + 1);
                    }
                    else {
                        reject(new Error(`${f} is not a file`));
                    }
                })
                    .catch(err => {
                    if (err.code === 'ENOENT') {
                        reject(new Error(`The expected file \`${f}' was not found`));
                    }
                    else {
                        reject(err);
                    }
                });
            }
            else {
                resolve();
            }
        };
        file_iter(0);
    });
}


/***/ }),

/***/ 7654:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.compareVersions = compareVersions;
function compareVersions(v1, v2) {
    let result = 0;
    const l1 = v1.length;
    const l2 = v2.length;
    let i = 0;
    if (l1 <= l2) {
        while (result === 0 && i < l2) {
            result = (i < l1 ? v1[i] : 0) - v2[i];
            i++;
        }
    }
    else {
        while (result === 0 && i < l1) {
            result = v1[i] - (i < l2 ? v2[i] : 0);
            i++;
        }
    }
    return result;
}


/***/ }),

/***/ 840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultStdOutHandler = defaultStdOutHandler;
const Console_1 = __nccwpck_require__(946);
function defaultStdOutHandler(chunk) {
    Console_1.Console.instance().write(chunk.toString());
}


/***/ }),

/***/ 3864:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.downloadFile = downloadFile;
const node_stream_1 = __nccwpck_require__(7075);
const node_fs_1 = __nccwpck_require__(3024);
const promises_1 = __nccwpck_require__(8500);
const DEFAULT_MAX_TRIES = 5;
const DOWNLOAD_MIN_BASE = 1.7;
const DOWNLOAD_MAX_BASE = 2.3;
function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}
function getWaitingTimeInMilliseconds(retries) {
    let waitingTimeInMilliseconds = 0;
    if (retries > 0) {
        const B = randomBetween(DOWNLOAD_MIN_BASE, DOWNLOAD_MAX_BASE);
        const waitingTimeInSeconds = Math.pow(B, retries);
        waitingTimeInMilliseconds = Math.floor(waitingTimeInSeconds * 1000);
    }
    return waitingTimeInMilliseconds;
}
function downloadFile(url, outFile, maxTries) {
    return new Promise((resolve, reject) => {
        const tries = (maxTries && maxTries > 0 ? maxTries : DEFAULT_MAX_TRIES) + 1;
        let succeed = false;
        let execErr;
        const iter = (i) => {
            if (!succeed && i < tries) {
                (0, promises_1.setTimeout)(getWaitingTimeInMilliseconds(i))
                    .then(() => {
                    fetch(url).then(response => {
                        if (!response.ok) {
                            execErr = new Error("Response is not ok");
                            iter(i + 1);
                        }
                        else {
                            const body = response.body;
                            if (body === null) {
                                execErr = new Error("Response body is null");
                                iter(i + 1);
                            }
                            else {
                                node_stream_1.Readable.fromWeb(body)
                                    .pipe((0, node_fs_1.createWriteStream)(outFile))
                                    .on("error", err => {
                                    execErr = err;
                                    iter(i + 1);
                                })
                                    .on("finish", () => {
                                    succeed = true;
                                    iter(i + 1);
                                });
                            }
                        }
                    })
                        .catch(err => {
                        execErr = err;
                        iter(i + 1);
                    });
                })
                    .catch(timeoutErr => {
                    execErr = timeoutErr;
                    iter(i + 1);
                });
            }
            else if (succeed) {
                resolve(outFile);
            }
            else if (execErr) {
                reject(execErr);
            }
            else {
                reject(new Error("Download failed"));
            }
        };
        iter(0);
    });
}


/***/ }),

/***/ 6522:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.executeProcess = executeProcess;
exports.getStdOutFromProcessExecution = getStdOutFromProcessExecution;
exports.getFirstLineFromProcessExecution = getFirstLineFromProcessExecution;
const node_child_process_1 = __nccwpck_require__(1421);
const Console_1 = __nccwpck_require__(946);
function executeProcess(tool, opts) {
    return new Promise((resolve, reject) => {
        const spawnOpts = { cwd: opts === null || opts === void 0 ? void 0 : opts.cwd };
        const p = (opts && opts.args) ? (0, node_child_process_1.spawn)(tool, opts.args, spawnOpts) : (0, node_child_process_1.spawn)(tool, spawnOpts);
        if (opts && opts.args && opts.verbose) {
            const values = [`"${tool}"`];
            for (const a of opts.args) {
                values.push(`"${a.replace(/"/g, "\\\"")}"`);
            }
            Console_1.Console.instance().writeLine(values.join(" "));
        }
        if (opts && opts.stdout) {
            p.stdout.on("data", opts.stdout);
        }
        if (opts && opts.stderr) {
            p.stderr.on("data", opts.stderr);
        }
        p.on("close", code => {
            if (code === 0) {
                resolve(code);
            }
            else {
                reject(code);
            }
        });
        p.on("error", err => {
            reject(err);
        });
    });
}
function getStdOutFromProcessExecution(tool, opts) {
    return new Promise((resolve, reject) => {
        const spawnOpts = { cwd: opts === null || opts === void 0 ? void 0 : opts.cwd };
        const p = (opts && opts.args) ? (0, node_child_process_1.spawn)(tool, opts.args, spawnOpts) : (0, node_child_process_1.spawn)(tool, spawnOpts);
        const stdOutput = [];
        if (opts && opts.args && opts.verbose) {
            const values = [`"${tool}"`];
            for (const a of opts.args) {
                values.push(`"${a.replace(/"/g, "\\\"")}"`);
            }
            Console_1.Console.instance().writeLine(values.join(" "));
        }
        p.stdout.on("data", (chunk) => {
            stdOutput.push((chunk.toString()));
        });
        if (opts && opts.stderr) {
            p.stderr.on("data", opts.stderr);
        }
        p.on("close", code => {
            if (code === 0) {
                resolve({ code: code, lines: stdOutput.join('').split(/\r\n|\r|\n/) });
            }
            else {
                reject(code);
            }
        });
        p.on("error", err => {
            reject(err);
        });
    });
}
function getFirstLineFromProcessExecution(tool, args, verbose) {
    return new Promise((resolve, reject) => {
        getStdOutFromProcessExecution(tool, { args: args, verbose: verbose })
            .then(result => {
            resolve(result.lines[0]);
        })
            .catch(reject);
    });
}


/***/ }),

/***/ 3143:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extractTarGz = extractTarGz;
const ExecuteProcess_1 = __nccwpck_require__(6522);
function extractTarGz(inputFile, opts) {
    return (0, ExecuteProcess_1.executeProcess)("tar", { args: opts && opts.cwd ? ["-C", opts.cwd, "-xf", inputFile] : ["-xf", inputFile], verbose: opts === null || opts === void 0 ? void 0 : opts.verbose });
}


/***/ }),

/***/ 8702:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extractZip = extractZip;
const promises_1 = __nccwpck_require__(1455);
const node_path_1 = __nccwpck_require__(6760);
const ExecuteProcess_1 = __nccwpck_require__(6522);
const FindGitForWindowsInstallDir_1 = __nccwpck_require__(5407);
const Find7z_1 = __nccwpck_require__(2124);
const CheckFiles_1 = __nccwpck_require__(8105);
function cscriptUnzip(archive, destDir) {
    return new Promise((resolve, reject) => {
        (0, promises_1.mkdtemp)((0, node_path_1.join)(destDir, "unzip-"))
            .then(scriptDir => {
            const unzipScript = [
                "function print(value) { WScript.Echo(value); }",
                "function exit(value) { WScript.Quit(value); }",
                "var argv = WScript.Arguments;",
                "var shell = new ActiveXObject('shell.application');",
                "var fs = new ActiveXObject('scripting.filesystemobject');",
                "var archive = argv.Named('archive');",
                "if (!archive) { print('archive not set'); exit(1); }",
                "if (!fs.FileExists(archive)) { print('archive not found'); exit(1); }",
                "if (archive.length < 4 || archive.substring(archive.length - 4) !== '.zip') { print('archive is not a .zip'); exit(1); }",
                "var destDir = argv.Named('destdir');",
                "if (!destDir) { print('destination directory not set'); exit(1); }",
                "if (!fs.FolderExists(destDir)) { fs.CreateFolder(destDir); }",
                "var shZip = shell.NameSpace(archive);",
                "var shDestDir = shell.NameSpace(destDir);",
                "shDestDir.CopyHere(shZip.Items(), 16 | 256);"
            ];
            const scriptContent = unzipScript.join(" ");
            const unzipJs = (0, node_path_1.join)(scriptDir, "unzip.js");
            (0, promises_1.writeFile)(unzipJs, scriptContent)
                .then(() => {
                (0, ExecuteProcess_1.executeProcess)("cscript", {
                    args: [
                        unzipJs,
                        "/nologo",
                        "/e:JScript",
                        `/archive:${archive}`,
                        `/destdir:${destDir}`
                    ],
                    verbose: true
                })
                    .then(resolve)
                    .catch(reject);
            })
                .catch(reject);
        })
            .catch(reject);
    });
}
function powershellExpandArchive() {
    return new Promise((resolve, reject) => {
        const programs = ["powershell", "pwsh"];
        const len = programs.length;
        const program_iter = (i) => {
            if (i < len) {
                const powershell = programs[i];
                (0, ExecuteProcess_1.executeProcess)(powershell, {
                    args: ["-Command", "Get-Command Expand-Archive"],
                })
                    .then(code => {
                    resolve(powershell);
                })
                    .catch(() => {
                    program_iter(i + 1);
                });
            }
            else {
                reject(new Error("Unable to find a powershell instance capable of extracting zip files."));
            }
        };
        program_iter(0);
    });
}
function findGitUnzipPath() {
    return new Promise((resolve, reject) => {
        (0, FindGitForWindowsInstallDir_1.findGitForWindowsInstallDir)()
            .then(gitInstallDir => {
            const gitUnzip = (0, node_path_1.join)(gitInstallDir, "usr", "bin", "unzip.exe");
            (0, CheckFiles_1.checkFiles)([gitUnzip])
                .then(() => {
                resolve(gitUnzip);
            })
                .catch(reject);
        })
            .catch(reject);
    });
}
function extractZip(path, opts) {
    return new Promise((resolve, reject) => {
        const dir = opts && opts.cwd ? opts.cwd : process.cwd();
        if (process.platform === 'win32') {
            cscriptUnzip(path, dir)
                .then(resolve)
                .catch(cscriptErr => {
                powershellExpandArchive()
                    .then(powershell => {
                    (0, ExecuteProcess_1.executeProcess)(powershell, { args: [
                            "-Command",
                            `\$ProgressPreference = 'SilentlyContinue'; Expand-Archive -Path '${path.replace(/'/g, "''")}' -DestinationPath '${dir.replace(/'/g, "''")}'`
                        ], verbose: opts === null || opts === void 0 ? void 0 : opts.verbose })
                        .then(code => {
                        resolve(code);
                    })
                        .catch(reject);
                })
                    .catch(powershellErr => {
                    findGitUnzipPath()
                        .then(gitUnzip => {
                        (0, ExecuteProcess_1.executeProcess)(gitUnzip, { cwd: dir, args: [path], verbose: opts === null || opts === void 0 ? void 0 : opts.verbose })
                            .then(code => {
                            resolve(code);
                        })
                            .catch(reject);
                    })
                        .catch(gitUnzipErr => {
                        (0, Find7z_1.find7z)()
                            .then(sevenZip => {
                            (0, ExecuteProcess_1.executeProcess)(sevenZip, { args: ["-aoa", `-o${dir}`, "x", path], verbose: opts === null || opts === void 0 ? void 0 : opts.verbose })
                                .then(code => {
                                resolve(code);
                            })
                                .catch(reject);
                        })
                            .catch(sevenZipErr => {
                            reject(new Error("You must install the latest PowerShell, Git For Windows or 7-Zip to unzip files"));
                        });
                    });
                });
            });
        }
        else {
            (0, ExecuteProcess_1.executeProcess)("unzip", { cwd: dir, args: [path] })
                .then(code => {
                resolve(code);
            })
                .catch(reject);
        }
    });
}


/***/ }),

/***/ 6616:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getFileHash = getFileHash;
exports.verifyFileHash = verifyFileHash;
const node_crypto_1 = __nccwpck_require__(7598);
const node_fs_1 = __nccwpck_require__(3024);
const node_stream_1 = __nccwpck_require__(7075);
function getFileHash(file, algorithm) {
    return new Promise((resolve, reject) => {
        const hashOutput = [];
        const hashOutputStream = new node_stream_1.Writable({
            write(chunk, encoding, callback) {
                hashOutput.push(chunk.toString());
                callback();
            }
        });
        (0, node_fs_1.createReadStream)(file)
            .pipe((0, node_crypto_1.createHash)(algorithm))
            .setEncoding("hex")
            .pipe(hashOutputStream)
            .on("close", () => {
            resolve(hashOutput.join(""));
        })
            .on("error", reject);
    });
}
function verifyFileHash(file, algorithm, expectedHash) {
    return new Promise((resolve, reject) => {
        getFileHash(file, algorithm)
            .then(value => {
            resolve(expectedHash.toLowerCase() == value);
        })
            .catch(reject);
    });
}


/***/ }),

/***/ 2124:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.find7z = find7z;
const node_path_1 = __nccwpck_require__(6760);
const WindowsRegQuery_1 = __nccwpck_require__(2959);
const CheckFiles_1 = __nccwpck_require__(8105);
function find7zInstallDir() {
    return new Promise((resolve, reject) => {
        (0, WindowsRegQuery_1.windowsRegQuery)("HKEY_LOCAL_MACHINE\\SOFTWARE\\7-Zip")
            .then(lines => {
            if (lines.length > 0) {
                let i = 0;
                let sevenZipPath = undefined;
                while (!sevenZipPath && i < lines.length) {
                    const match = /\s*Path\s+REG_SZ\s+(.*)(\r\n|\r|\n)?/i.exec(lines[i]);
                    if (match) {
                        const path = match[1].trim();
                        sevenZipPath = path;
                    }
                    i++;
                }
                if (sevenZipPath) {
                    resolve(sevenZipPath);
                }
                else {
                    reject(new Error("Unable to find 7-Zip installation path"));
                }
            }
            else {
                reject(new Error("7-Zip installation directory was not set"));
            }
        })
            .catch(err => {
            reject(new Error("Unable to query 7-Zip installation path"));
        });
    });
}
function find7z() {
    return new Promise((resolve, reject) => {
        find7zInstallDir()
            .then(sevenZipInstallDir => {
            const sevenZip = (0, node_path_1.join)(sevenZipInstallDir, "7z.exe");
            (0, CheckFiles_1.checkFiles)([sevenZip])
                .then(() => {
                resolve(sevenZip);
            })
                .catch(reject);
        })
            .catch(reject);
    });
}


/***/ }),

/***/ 5407:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findGitForWindowsInstallDir = findGitForWindowsInstallDir;
const WindowsRegQuery_1 = __nccwpck_require__(2959);
function findGitForWindowsInstallDir() {
    return new Promise((resolve, reject) => {
        (0, WindowsRegQuery_1.windowsRegQuery)("HKEY_LOCAL_MACHINE\\SOFTWARE\\GitForWindows")
            .then(lines => {
            if (lines.length > 0) {
                let i = 0;
                let gitInstallDir = undefined;
                while (!gitInstallDir && i < lines.length) {
                    const match = /\s*InstallPath\s+REG_SZ\s+(.*)(\r\n|\r|\n)?/i.exec(lines[i]);
                    if (match) {
                        const path = match[1].trim();
                        gitInstallDir = path;
                    }
                    i++;
                }
                if (gitInstallDir) {
                    resolve(gitInstallDir);
                }
                else {
                    reject(new Error("Unable to find Git For Windows installation patch"));
                }
            }
            else {
                reject(new Error("Git For Windows installation directory was not set"));
            }
        })
            .catch(err => {
            reject(new Error("Unable to query Git For Windows installation path"));
        });
    });
}


/***/ }),

/***/ 2437:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findProgram = findProgram;
const ExecuteProcess_1 = __nccwpck_require__(6522);
function findProgram(program, verbose) {
    return new Promise((resolve, reject) => {
        if (process.platform === 'win32') {
            (0, ExecuteProcess_1.getStdOutFromProcessExecution)((process.env["COMSPEC"] || "cmd").trim(), {
                args: ["/C", "where", program],
                verbose: verbose
            })
                .then(result => {
                const lines = result.lines;
                if (lines.length > 0) {
                    resolve(lines[0]);
                }
                else {
                    reject(new Error("Internal error: the expected program path was not found."));
                }
            })
                .catch(err => {
                reject(new Error(`Unable to find ${program}`));
            });
        }
        else {
            (0, ExecuteProcess_1.getStdOutFromProcessExecution)("which", {
                args: [program],
                verbose: verbose
            })
                .then(result => {
                const lines = result.lines;
                if (lines.length > 0) {
                    resolve(lines[0]);
                }
                else {
                    reject(new Error("Internal error: the expected program path was not found."));
                }
            })
                .catch(err => {
                reject(new Error(`Unable to find ${program}`));
            });
        }
    });
}


/***/ }),

/***/ 8195:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetSetProperty = void 0;
class GetSetProperty {
    getValue() {
        return this.value;
    }
    setValue(value) {
        this.value = value;
    }
    constructor(value) {
        this.value = value;
    }
}
exports.GetSetProperty = GetSetProperty;


/***/ }),

/***/ 5249:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.appendToGitHubEnvironmentVariables = appendToGitHubEnvironmentVariables;
exports.appendToGitHubPath = appendToGitHubPath;
const GitHubCore_1 = __nccwpck_require__(7787);
function appendToGitHubEnvironmentVariables(key, value) {
    return GitHubCore_1.GitHubCore.instance().appendToGitHubEnvironmentVariables(key, value);
}
function appendToGitHubPath(value) {
    return GitHubCore_1.GitHubCore.instance().appendToGitHubPath(value);
}


/***/ }),

/***/ 1621:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitHubInput = void 0;
const GitHubCore_1 = __nccwpck_require__(7787);
class GitHubInput {
    static instance() {
        if (!GitHubInput._instance) {
            GitHubInput._instance = new GitHubInput();
        }
        return GitHubInput._instance;
    }
    getInputDebugSetupLua() {
        const debugMode = GitHubCore_1.GitHubCore.instance().getInput("debug-setup-lua");
        return debugMode === "true" ||
            debugMode === "True" ||
            debugMode === "TRUE" ||
            debugMode === "1" ||
            debugMode === "on" ||
            debugMode === "On" ||
            debugMode === "ON" ||
            debugMode === "y" ||
            debugMode === "Y" ||
            debugMode === "yes" ||
            debugMode === "Yes" ||
            debugMode === "YES";
    }
    getInputCC() {
        return GitHubCore_1.GitHubCore.instance().getInput("cc");
    }
    getInputLD() {
        return GitHubCore_1.GitHubCore.instance().getInput("ld");
    }
    getInputAR() {
        return GitHubCore_1.GitHubCore.instance().getInput("ar");
    }
    getInputSTRIP() {
        return GitHubCore_1.GitHubCore.instance().getInput("strip");
    }
    getInputRANLIB() {
        return GitHubCore_1.GitHubCore.instance().getInput("ranlib");
    }
    getInputRC() {
        return GitHubCore_1.GitHubCore.instance().getInput("rc");
    }
    getInputMake() {
        return GitHubCore_1.GitHubCore.instance().getInput("make");
    }
    getInputToolchainPrefix() {
        return GitHubCore_1.GitHubCore.instance().getInput("toolchain-prefix");
    }
    getInputLuaVersion() {
        return GitHubCore_1.GitHubCore.instance().getInput("lua-version");
    }
    getInputLuaRocksVersion() {
        return GitHubCore_1.GitHubCore.instance().getInput("luarocks-version");
    }
    getInputMacOSXDeploymentTarget() {
        return GitHubCore_1.GitHubCore.instance().getInput("macosx-deployment-target");
    }
    getInputUseCache() {
        const useCache = GitHubCore_1.GitHubCore.instance().getInput("use-cache");
        return useCache === undefined ||
            useCache === '' ||
            useCache === "true" ||
            useCache === "True" ||
            useCache === "TRUE" ||
            useCache === "1" ||
            useCache === "on" ||
            useCache === "On" ||
            useCache === "ON" ||
            useCache === "y" ||
            useCache === "Y" ||
            useCache === "yes" ||
            useCache === "Yes" ||
            useCache === "YES";
    }
    getInputCflagsExtra() {
        return GitHubCore_1.GitHubCore.instance().getInput("cflags-extra");
    }
    getInputIncDirsExtra() {
        return GitHubCore_1.GitHubCore.instance().getInput("incdirs-extra");
    }
    getInputLdflagsExtra() {
        return GitHubCore_1.GitHubCore.instance().getInput("ldflags-extra");
    }
    getInputLibDirsExtra() {
        return GitHubCore_1.GitHubCore.instance().getInput("libdirs-extra");
    }
    getInputLibsExtra() {
        return GitHubCore_1.GitHubCore.instance().getInput("libs-extra");
    }
    getInputLuaPatches() {
        return GitHubCore_1.GitHubCore.instance().getInput("lua-patches");
    }
    getInputLuaRocksPatches() {
        return GitHubCore_1.GitHubCore.instance().getInput("luarocks-patches");
    }
}
exports.GitHubInput = GitHubInput;


/***/ }),

/***/ 5006:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseInputSemiColon = parseInputSemiColon;
function coreParseInputSemiColon(input) {
    const l = input.length;
    const tokens = [];
    if (l > 0) {
        let i = 0;
        let s = 0;
        while (i < l) {
            if (input[i] === ";") {
                if (i + 1 < l) {
                    if (input[i + 1] === ";") {
                        i += 2;
                    }
                    else {
                        tokens.push(input.substring(s, i).replace(";;", ";"));
                        i++;
                        s = i;
                    }
                }
                else {
                    tokens.push(input.substring(s, i).replace(";;", ";"));
                    i++;
                    s = i;
                }
            }
            else {
                i++;
            }
        }
        tokens.push(input.substring(s).replace(";;", ";"));
    }
    return tokens;
}
function parseInputSemiColon(input) {
    return input ? coreParseInputSemiColon(input.trim()) : [];
}


/***/ }),

/***/ 2483:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReadOnlyArray = void 0;
class ReadOnlyArray {
    constructor(array) {
        this.ar = array.slice();
    }
    getLenght() {
        return this.ar.length;
    }
    getItem(i) {
        if (!(0 <= i && i <= this.ar.length)) {
            throw new Error(`index ${i} is out of range`);
        }
        return this.ar[i];
    }
    createCopy() {
        return this.ar.slice();
    }
    copyTo(array) {
        if (array) {
            this.ar.forEach(value => array.push(value));
        }
        else {
            throw new Error("array expected as argument");
        }
    }
}
exports.ReadOnlyArray = ReadOnlyArray;


/***/ }),

/***/ 923:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sequentialPromises = sequentialPromises;
function sequentialPromises(values) {
    return new Promise((resolve, reject) => {
        const results = [];
        const copy = values.slice();
        const len = copy.length;
        const iter = (i) => {
            if (i < len) {
                copy[i]()
                    .then(partialResult => {
                    results.push(partialResult);
                    iter(i + 1);
                })
                    .catch(reject);
            }
            else {
                resolve(results);
            }
        };
        iter(0);
    });
}


/***/ }),

/***/ 2959:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.windowsRegQuery = windowsRegQuery;
const ExecuteProcess_1 = __nccwpck_require__(6522);
function windowsRegQuery(key) {
    return new Promise((resolve, reject) => {
        (0, ExecuteProcess_1.getStdOutFromProcessExecution)("reg", {
            args: ["query", key]
        })
            .then(result => {
            resolve(result.lines);
        })
            .catch(reject);
    });
}


/***/ }),

/***/ 1943:
/***/ ((module) => {

module.exports = require("fs/promises");

/***/ }),

/***/ 1421:
/***/ ((module) => {

module.exports = require("node:child_process");

/***/ }),

/***/ 7598:
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ 3024:
/***/ ((module) => {

module.exports = require("node:fs");

/***/ }),

/***/ 1455:
/***/ ((module) => {

module.exports = require("node:fs/promises");

/***/ }),

/***/ 8161:
/***/ ((module) => {

module.exports = require("node:os");

/***/ }),

/***/ 6760:
/***/ ((module) => {

module.exports = require("node:path");

/***/ }),

/***/ 6848:
/***/ ((module) => {

module.exports = require("node:readline/promises");

/***/ }),

/***/ 7075:
/***/ ((module) => {

module.exports = require("node:stream");

/***/ }),

/***/ 8500:
/***/ ((module) => {

module.exports = require("node:timers/promises");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const node_os_1 = __nccwpck_require__(8161);
const node_path_1 = __nccwpck_require__(6760);
const node_crypto_1 = __nccwpck_require__(7598);
const promises_1 = __nccwpck_require__(1455);
const PucLuaProject_1 = __nccwpck_require__(2810);
const PucLuaVersion_1 = __nccwpck_require__(5991);
const GccToolchain_1 = __nccwpck_require__(4468);
const MsvcToolchain_1 = __nccwpck_require__(2980);
const LuaJitProject_1 = __nccwpck_require__(2892);
const LuaJitRepositoryVersion_1 = __nccwpck_require__(1721);
const LuaRocksVersion_1 = __nccwpck_require__(3527);
const LuaRocksProject_1 = __nccwpck_require__(1146);
const SequentialPromises_1 = __nccwpck_require__(923);
const GitHubInput_1 = __nccwpck_require__(1621);
const Console_1 = __nccwpck_require__(946);
function getTempDir() {
    return new Promise((promiseResolve, reject) => {
        const runnerTemp = process.env["RUNNER_TEMP"];
        if (runnerTemp) {
            (0, promises_1.stat)(runnerTemp)
                .then(s => {
                if (s.isDirectory()) {
                    promiseResolve((0, node_path_1.resolve)(runnerTemp));
                }
                else {
                    reject(new Error("Runner TEMP must be a directory"));
                }
            })
                .catch(reject);
        }
        else {
            promiseResolve((0, node_os_1.tmpdir)());
        }
    });
}
function readLuaVersionFromEnv(luaVersion) {
    return new Promise((promiseResolve, reject) => {
        const result = [];
        (0, PucLuaVersion_1.parsePucLuaVersion)(luaVersion)
            .then(targetVersion => {
            result.push(targetVersion);
            promiseResolve(result);
        })
            .catch(err => {
            promiseResolve(result);
        });
    });
}
function readLuaJitRepositoryVersionFromEnv(luaVersion) {
    return new Promise((promiseResolve, reject) => {
        const result = [];
        (0, LuaJitRepositoryVersion_1.parseLuaJitRepositoryVersion)(luaVersion)
            .then(targetVersion => {
            result.push(targetVersion);
            promiseResolve(result);
        })
            .catch(err => {
            promiseResolve(result);
        });
    });
}
function readLuaRocksVersionFromEnv(luaRocksVersion) {
    return new Promise((promiseResolve, reject) => {
        const result = [];
        (0, LuaRocksVersion_1.parseLuaRocksVersion)(luaRocksVersion)
            .then(targetVersion => {
            if (targetVersion) {
                result.push(targetVersion);
            }
            promiseResolve(result);
        })
            .catch(err => {
            promiseResolve(result);
        });
    });
}
function installLuaProject(luaProject, buildDir, installDir, toolchain) {
    return new Promise((promiseResolve, reject) => {
        const luaRocksVersion = (GitHubInput_1.GitHubInput.instance().getInputLuaRocksVersion() || process.env["LUAROCKS_VERSION"] || "").trim();
        (0, SequentialPromises_1.sequentialPromises)([
            () => luaProject.configure(),
            () => luaProject.build(),
            () => luaProject.install()
        ])
            .then(_ => {
            readLuaRocksVersionFromEnv(luaRocksVersion)
                .then(lrVersions => {
                if (lrVersions.length > 0) {
                    const version = lrVersions[0];
                    (0, promises_1.mkdtemp)((0, node_path_1.join)(buildDir, "luarocks-"))
                        .then(luaRocksBuildDir => {
                        const luaRocksProject = new LuaRocksProject_1.LuaRocksProject(version, luaRocksBuildDir, installDir, toolchain);
                        (0, SequentialPromises_1.sequentialPromises)([
                            () => luaRocksProject.configure(),
                            () => luaRocksProject.build(),
                            () => luaRocksProject.install()
                        ])
                            .then(__ => {
                            promiseResolve();
                        })
                            .catch(reject);
                    })
                        .catch(reject);
                }
                else {
                    promiseResolve();
                }
            })
                .catch(reject);
        })
            .catch(reject);
    });
}
;
function main() {
    return new Promise((promiseResolve, reject) => {
        getTempDir()
            .then(tmp => {
            const workingDir = process.cwd();
            const uuid = (0, node_crypto_1.randomUUID)().toString();
            const toolchain = process.env["VCINSTALLDIR"] ? new MsvcToolchain_1.MsvcToolchain() : new GccToolchain_1.GccToolchain();
            const luaVersion = (GitHubInput_1.GitHubInput.instance().getInputLuaVersion() || process.env["LUA_VERSION"] || "").trim();
            readLuaVersionFromEnv(luaVersion)
                .then(versions => {
                if (versions.length > 0) {
                    const version = versions[0];
                    const buildDir = (0, node_path_1.join)(tmp, `lua-${version.getString()}-${uuid}-build-dir`);
                    const installDir = GitHubInput_1.GitHubInput.instance().getInputDebugSetupLua() || process.env["DEBUG_SETUP_LUA"] ?
                        (0, node_path_1.join)(tmp, `lua-${version.getString()}-${uuid}-install-dir`) :
                        (0, node_path_1.join)(workingDir, ".lua");
                    const project = new PucLuaProject_1.PucLuaProject(version, buildDir, installDir, toolchain);
                    installLuaProject(project, buildDir, installDir, toolchain)
                        .then(promiseResolve)
                        .catch(reject);
                }
                else {
                    readLuaJitRepositoryVersionFromEnv(luaVersion)
                        .then(luajitVersions => {
                        if (luajitVersions.length > 0) {
                            const version = luajitVersions[0];
                            const buildDir = (0, node_path_1.join)(tmp, `${version.getKind()}-${uuid}-build-dir`);
                            const installDir = GitHubInput_1.GitHubInput.instance().getInputDebugSetupLua() || process.env["DEBUG_SETUP_LUA"] ?
                                (0, node_path_1.join)(tmp, `${version.getKind()}-${uuid}-install-dir`) :
                                (0, node_path_1.join)(workingDir, ".lua");
                            const project = new LuaJitProject_1.LuaJitProject(version, buildDir, installDir, toolchain);
                            installLuaProject(project, buildDir, installDir, toolchain)
                                .then(promiseResolve)
                                .catch(reject);
                        }
                        else {
                            reject(new Error("Unknown Lua / LuaJIT / OpenResty version"));
                        }
                    })
                        .catch(reject);
                }
            })
                .catch(reject);
        })
            .catch(reject);
    });
}
main()
    .then(() => {
    Console_1.Console.instance().writeLine("finished");
})
    .catch(err => {
    Console_1.Console.instance().writeLine(err);
    process.exitCode = 1;
});

})();

module.exports = __webpack_exports__;
/******/ })()
;
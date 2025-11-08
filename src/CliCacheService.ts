import { cp, mkdir, stat } from "node:fs/promises";
import { basename, join } from "node:path";
import { homedir } from "node:os";
import { ICacheService } from "./Util/ICacheService";

export class CliCacheService implements ICacheService {
    private static _instance: ICacheService;
    static instance(): ICacheService {
        if (!CliCacheService._instance) {
            CliCacheService._instance = new CliCacheService();
        }
        return CliCacheService._instance;
    }
    getCacheDirName(): string {
        return "setup-lua-cache";
    }
    getConfigHomeDir(): string {
        const configHomeEnvVar = process.platform === 'win32' ? "LOCALAPPDATA" : "XDG_CACHE_HOME";
        return (process.env[configHomeEnvVar] || "").trim();
    }
    useCache(): boolean {
        let result: boolean = true;
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
    private getCacheDirectory(key: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const baseDirs: string[] = [
                this.getConfigHomeDir(),
                join(homedir(), ".cache")
            ];

            const dir_iter = (i: number) => {
                if (i < baseDirs.length) {
                    const dir = baseDirs[i];
                    if (dir) {
                        stat(dir)
                            .then(baseDirStat => {
                                const setupLuaDir = join(dir, this.getCacheDirName());
                                const furtherProcessing = () => {
                                    const keyDir = join(setupLuaDir, key);
                                    stat(keyDir)
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
                                                mkdir(keyDir)
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
                                stat(setupLuaDir)
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
                                            mkdir(setupLuaDir)
                                                .then(() => {
                                                    furtherProcessing();
                                                })
                                                .catch(setupLuaDirMkdirErr => {
                                                    dir_iter(i + 1);
                                                })
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
    save(path: string, key: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.getCacheDirectory(key)
                .then(cacheDir => {
                    const cachedFile = join(cacheDir, basename(path));
                    cp(path, cachedFile, { force: true })
                        .then(resolve)
                        .catch(cpErr => {
                            reject(new Error("Failed to copy the download file to the proper cache location"));
                        });
                })
                .catch(reject);
        });
    }
    restore(path: string, primaryKey: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.getCacheDirectory(primaryKey)
                .then(cacheDir => {
                    const cachedFile = join(cacheDir, basename(path));
                    cp(cachedFile, path, { force: true })
                        .then(resolve)
                        .catch(cpErr => {
                            reject(new Error("Failed to copy the cached file to the proper location"));
                        });
                })
                .catch(reject);
        });
    }
    private constructor() {
        
    }
}
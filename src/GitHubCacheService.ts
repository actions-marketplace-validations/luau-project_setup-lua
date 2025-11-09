import { basename } from "node:path";
import { cp, rm } from "node:fs/promises";
import { saveCache, restoreCache } from "@actions/cache";
import { GitHubInput } from "./Util/GitHubInput";
import { ICacheService } from "./Util/ICacheService";

export class GitHubCacheService implements ICacheService {
    private static _instance: ICacheService;
    static instance(): ICacheService {
        if (!GitHubCacheService._instance) {
                GitHubCacheService._instance = new GitHubCacheService();
        }
        return GitHubCacheService._instance;
    }
    private getPathForGitHubCache(path: string): string {
        return `setup-lua-cache-${basename(path)}`;
    }
    useCache(): boolean {
        return GitHubInput.instance().getInputUseCache();
    }
    save(path: string, key: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const pathForCache = this.getPathForGitHubCache(path);
            cp(path, pathForCache, { force: true })
                .then(() => {
                    saveCache([pathForCache], key, undefined, true)
                        .then(_ => {
                            rm(pathForCache, { force: true })
                                .then(resolve)
                                .catch(rmErr => {
                                    resolve();
                                });
                        })
                        .catch(saveErr => {
                            rm(pathForCache, { force: true })
                                .then(() => {
                                    reject(saveErr);
                                })
                                .catch(rmErr => {
                                    resolve(saveErr);
                                });
                        });
                })
                .catch(reject);
        });
    }
    restore(path: string, primaryKey: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const pathForCache = this.getPathForGitHubCache(path);
            restoreCache([pathForCache], primaryKey, undefined, undefined, true)
                .then(cacheKey => {
                    if (cacheKey) {
                        cp(pathForCache, path, { force: true })
                            .then(() => {
                                rm(pathForCache, { force: true })
                                    .then(resolve)
                                    .catch(rmErr => {
                                        resolve();
                                    });
                            })
                            .catch(reject);
                    }
                    else {
                        rm(pathForCache, { force: true })
                            .then(() => {
                                reject(new Error(`There is no cache available for ${primaryKey}.`));
                            })
                            .catch(rmErr => {
                                reject(new Error(`There is no cache available for ${primaryKey}.`));
                            });
                    }
                })
                .catch(reject);
        });
    }
    private constructor() {

    }
}
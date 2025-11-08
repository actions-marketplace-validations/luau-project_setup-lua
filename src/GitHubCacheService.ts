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
    useCache(): boolean {
        return GitHubInput.instance().getInputUseCache();
    }
    save(path: string, key: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            saveCache([path], key)
                .then(_ => {
                    resolve();
                })
                .catch(reject);
        });
    }
    restore(path: string, primaryKey: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            restoreCache([path], primaryKey)
                .then(cacheKey => {
                    if (cacheKey) {
                        resolve();
                    }
                    else {
                        reject(new Error(`There is no cache available for ${primaryKey}.`));
                    }
                })
                .catch(reject);
        });
    }
    private constructor() {

    }
}
import { basename, join } from "node:path";
import { IProject } from "../../IProject";
import { ITarget } from "../ITarget";
import { downloadFile } from "../../../Util/DownloadFile";
import { verifyFileHash } from "../../../Util/FileHash";
import { CacheService } from "../../../CacheService";

export interface CompressedExpectedHash {
    algorithm: string;
    expectedHash: string;
}

export interface FetchCompressedTargetOptions {
    maxTries?: number;
    filename?: string;
    fileHash?: CompressedExpectedHash;
}

export interface ExtractOptions {
    cwd?: string;
    verbose?: boolean;
}

export abstract class AbstractFetchCompressedTarget implements ITarget {
    private url: string | URL;
    private workDir: string;
    private cacheKey: string | null;
    private handler: (filename: string, opts?: ExtractOptions) => Promise<number | null>;
    private opts: FetchCompressedTargetOptions;

    getUrl(): string | URL {
        return this.url;
    }

    getWorkDir(): string {
        return this.workDir;
    }

    getCacheKey(): string | null {
        return this.cacheKey;
    }

    constructor(url: string | URL, workDir: string, cacheKey: string | null, handler: (filename: string, opts?: ExtractOptions) => Promise<number | null>, opts?: FetchCompressedTargetOptions) {
        this.url = url;
        this.workDir = workDir;
        this.cacheKey = cacheKey;
        this.handler = handler;
        this.opts = {};
        this.opts.filename = opts?.filename ?? basename(url.toString());
        this.opts.maxTries = opts?.maxTries;
        if (opts?.fileHash) {
            this.opts.fileHash = {
                algorithm: opts.fileHash.algorithm,
                expectedHash: opts.fileHash.expectedHash
            };
        }
    }
    abstract init(): Promise<void>;
    abstract getProject(): IProject;
    abstract getParent(): ITarget | null;
    abstract getNext(): ITarget | null;
    private processArchive(file: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const fileHash = this.opts.fileHash;
            if (fileHash) {
                verifyFileHash(file, fileHash.algorithm, fileHash.expectedHash)
                    .then(match => {
                        if (match) {
                            this.handler(file, { cwd: this.workDir, verbose: true })
                                .then(code => {
                                    if (code === 0) {
                                        resolve();
                                    }
                                    else {
                                        reject(new Error(`Failed to extract ${basename(file)}`));
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
                            reject(new Error(`Failed to extract ${basename(file)}`));
                        }
                    })
                    .catch(reject);
            }
        });
    }
    private saveOnCache(file: string, useCache: boolean): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.processArchive(file)
                .then(() => {
                    if (useCache && this.cacheKey !== null) {
                        CacheService.instance().save(file, this.cacheKey)
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
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const filename = <string>this.opts.filename;
            const outFile = join(this.workDir, filename);
            const performDownload = (useCache: boolean) => {
                downloadFile(this.url, outFile, this.opts.maxTries)
                    .then(file => {
                        this.saveOnCache(file, useCache)
                            .then(resolve)
                            .catch(reject);
                    })
                    .catch(reject);
            };
            if (CacheService.instance().useCache() && this.cacheKey !== null) {
                CacheService.instance().restore(outFile, this.cacheKey)
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
    abstract finalize(): Promise<void>;
}
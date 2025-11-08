import { extractTarGz } from "../../../Util/ExtractTarGz";
import { AbstractFetchCompressedTarget, FetchCompressedTargetOptions } from "./AbstractFetchCompressedTarget";

export abstract class AbstractFetchTarballTarget extends AbstractFetchCompressedTarget {
    constructor(url: string | URL, workDir: string, cacheKey: string | null, opts?: FetchCompressedTargetOptions) {
        super(url, workDir, cacheKey, extractTarGz, opts);
    }
}
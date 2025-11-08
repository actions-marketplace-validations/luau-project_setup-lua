import { extractZip } from "../../../Util/ExtractZip";
import { AbstractFetchCompressedTarget, FetchCompressedTargetOptions } from "./AbstractFetchCompressedTarget";

export abstract class AbstractFetchZipTarget extends AbstractFetchCompressedTarget {
    constructor(url: string | URL, workDir: string, cacheKey: string | null, opts?: FetchCompressedTargetOptions) {
        super(url, workDir, cacheKey, extractZip, opts);
    }
}
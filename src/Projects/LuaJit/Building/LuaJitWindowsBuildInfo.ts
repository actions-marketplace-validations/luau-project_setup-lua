import { LuaJitSourcesInfo } from "../Configuration/LuaJitSourcesInfo";

export class LuaJitWindowsBuildInfo {
    private sourcesInfo: LuaJitSourcesInfo;
    private sharedLibrary: string;
    private interpreter: string;
    private pkgConfigFile: string;
    private importLibrary?: string;
    constructor(
        sourcesInfo: LuaJitSourcesInfo,
        sharedLibrary: string,
        interpreter: string,
        pkgConfigFile: string,
        importLibrary?: string
    ) {
        this.sourcesInfo = sourcesInfo;
        this.sharedLibrary = sharedLibrary;
        this.interpreter = interpreter;
        this.pkgConfigFile = pkgConfigFile;
        this.importLibrary = importLibrary;
    }
    getSourcesInfo(): LuaJitSourcesInfo {
        return this.sourcesInfo;
    }
    getSharedLibrary(): string {
        return this.sharedLibrary;
    }
    getInterpreter(): string {
        return this.interpreter;
    }
    getPkgConfigFile(): string {
        return this.pkgConfigFile;
    }
    getImportLibrary(): string | undefined {
        return this.importLibrary;
    }
}
import { PucLuaSourcesInfo } from "../Configuration/PucLuaSourcesInfo";

export class PucLuaBuildInfo {
    private sourcesInfo: PucLuaSourcesInfo;
    private sharedLibrary: string;
    private staticLibrary: string;
    private interpreter: string;
    private compiler: string;
    private pkgConfigFile: string;
    private importLibrary: string | undefined;
    constructor(
        sourcesInfo: PucLuaSourcesInfo,
        sharedLibrary: string,
        staticLibrary: string,
        interpreter: string,
        compiler: string,
        pkgConfigFile: string,
        importLibrary: string | undefined
    ) {
        this.sourcesInfo = sourcesInfo;
        this.sharedLibrary = sharedLibrary;
        this.staticLibrary = staticLibrary;
        this.interpreter = interpreter;
        this.compiler = compiler;
        this.pkgConfigFile = pkgConfigFile;
        this.importLibrary = importLibrary;
    }
    getSourcesInfo(): PucLuaSourcesInfo {
        return this.sourcesInfo;
    }
    getSharedLibrary(): string {
        return this.sharedLibrary;
    }
    getStaticLibrary(): string {
        return this.staticLibrary;
    }
    getInterpreter(): string {
        return this.interpreter;
    }
    getCompiler(): string {
        return this.compiler;
    }
    getPkgConfigFile(): string {
        return this.pkgConfigFile;
    }
    getImportLibrary(): string | undefined {
        return this.importLibrary;
    }
}
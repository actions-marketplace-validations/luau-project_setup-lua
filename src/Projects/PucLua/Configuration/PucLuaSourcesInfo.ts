import { IReadOnlyArray } from "../../../Util/IReadOnlyArray";
import { ReadOnlyArray } from "../../../Util/ReadOnlyArray";

export class PucLuaSourcesInfo {
    private compatFlag?: string;
    private headersDir: string;
    private headerFiles: IReadOnlyArray<string>;
    private manFiles: IReadOnlyArray<string>;
    private libSrcFiles: IReadOnlyArray<string>;
    private interpreterSrcFiles: IReadOnlyArray<string>;
    private compilerSrcFiles: IReadOnlyArray<string>;

    constructor(headersDir: string, headerFiles: string[], manFiles: string[], libSrcFiles: string[], interpreterSrcFiles: string[], compilerSrcFiles: string[], compatFlag?: string) {
        this.headersDir = headersDir;
        this.headerFiles = new ReadOnlyArray<string>(headerFiles);
        this.manFiles = new ReadOnlyArray<string>(manFiles);
        this.libSrcFiles = new ReadOnlyArray<string>(libSrcFiles);
        this.interpreterSrcFiles = new ReadOnlyArray<string>(interpreterSrcFiles);
        this.compilerSrcFiles = new ReadOnlyArray<string>(compilerSrcFiles);
        this.compatFlag = compatFlag;
    }

    getCompatFlag(): string | undefined {
        return this.compatFlag;
    }

    getHeadersDir(): string {
        return this.headersDir;
    }

    getHeaderFiles(): IReadOnlyArray<string> {
        return this.headerFiles;
    }

    getManFiles(): IReadOnlyArray<string> {
        return this.manFiles;
    }

    getLibSrcFiles(): IReadOnlyArray<string> {
        return this.libSrcFiles;
    }

    getInterpreterSrcFiles(): IReadOnlyArray<string> {
        return this.interpreterSrcFiles;
    }

    getCompilerSrcFiles(): IReadOnlyArray<string> {
        return this.compilerSrcFiles;
    }
}

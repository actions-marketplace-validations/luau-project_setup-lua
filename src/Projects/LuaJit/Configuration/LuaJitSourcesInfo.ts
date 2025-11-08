import { IReadOnlyArray } from "../../../Util/IReadOnlyArray";
import { ReadOnlyArray } from "../../../Util/ReadOnlyArray";
import { ILuaJitVersion } from "../LuaJitVersion";

export class LuaJitSourcesInfo {
    private dir: string;
    private srcDir: string;
    private version: ILuaJitVersion;
    private unixMakefile: string;
    private mingwMakefile: string;
    private msvcBuildBat: string;
    private delayedHeaderFile: string;
    private headerFiles: IReadOnlyArray<string>;
    private manFiles: IReadOnlyArray<string>;
    private jitFiles: IReadOnlyArray<string>;

    constructor(dir: string, srcDir: string, version: ILuaJitVersion, unixMakefile: string, mingwMakefile: string, msvcBuildBat: string, delayedHeaderFile: string, headerFiles: string[], manFiles: string[], jitFiles: string[]) {
        this.dir = dir;
        this.srcDir = srcDir;
        this.version = version;
        this.unixMakefile = unixMakefile;
        this.mingwMakefile = mingwMakefile;
        this.msvcBuildBat = msvcBuildBat;
        this.delayedHeaderFile = delayedHeaderFile;
        this.headerFiles = new ReadOnlyArray<string>(headerFiles);
        this.manFiles = new ReadOnlyArray<string>(manFiles);
        this.jitFiles = new ReadOnlyArray<string>(jitFiles);
    }

    getDir(): string {
        return this.dir;
    }

    getSrcDir(): string {
        return this.srcDir;
    }

    getVersion(): ILuaJitVersion {
        return this.version;
    }

    getUnixMakefile(): string {
        return this.unixMakefile;
    }

    getMingwMakefile(): string {
        return this.mingwMakefile;
    }

    getMsvcBuildBat(): string {
        return this.msvcBuildBat;
    }

    getDelayedHeaderFile(): string {
        return this.delayedHeaderFile;
    }

    getHeaderFiles(): IReadOnlyArray<string> {
        return this.headerFiles;
    }

    getManFiles(): IReadOnlyArray<string> {
        return this.manFiles;
    }

    getJitFiles(): IReadOnlyArray<string> {
        return this.jitFiles;
    }
}
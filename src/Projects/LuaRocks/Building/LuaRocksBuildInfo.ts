import { IReadOnlyArray } from "../../../Util/IReadOnlyArray";
import { ReadOnlyArray } from "../../../Util/ReadOnlyArray";
import { LuaRocksSourcesInfo, LuaRocksUnixSourcesInfoDetails, LuaRocksWindowsSourcesInfoDetails } from "../Configuration/LuaRocksSourcesInfo";

export abstract class AbstractLuaRocksBuildInfo {
    private srcInfo: LuaRocksSourcesInfo;
    constructor(sourcesInfo: LuaRocksSourcesInfo) {
        this.srcInfo = sourcesInfo;
    }

    getSourcesInfo(): LuaRocksSourcesInfo {
        return this.srcInfo;
    }
}

export class LuaRocksUnixBuildInfo extends AbstractLuaRocksBuildInfo {
    private make: string;
    private makeArguments: IReadOnlyArray<string>;
    constructor(sourcesInfo: LuaRocksSourcesInfo, make: string, makeArguments: string[]) {
        super(sourcesInfo);
        if (!(sourcesInfo.getDetails() instanceof LuaRocksUnixSourcesInfoDetails)) {
            throw new Error("Unix sources info details expected");
        }
        this.make = make;
        this.makeArguments = new ReadOnlyArray<string>(makeArguments);
    }

    getMake(): string {
        return this.make;
    }

    getMakeArguments(): IReadOnlyArray<string> {
        return this.makeArguments;
    }
}

export class LuaRocksWindowsBuildInfo extends AbstractLuaRocksBuildInfo {
    constructor(sourcesInfo: LuaRocksSourcesInfo) {
        super(sourcesInfo);
        if (!(sourcesInfo.getDetails() instanceof LuaRocksWindowsSourcesInfoDetails)) {
            throw new Error("Windows sources info details expected");
        }
    }
}
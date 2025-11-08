export class LuaRocksWindowsSourcesInfoDetails {
    private luarocks: string;
    private luarocksAdmin: string;
    private peParser?: string;

    getLuaRocks(): string {
        return this.luarocks;
    }
    getLuaRocksAdmin(): string {
        return this.luarocksAdmin;
    }
    getPeParser(): string | undefined {
        return this.peParser;
    }

    constructor(luarocks: string, luarocksAdmin: string, peParser?: string) {
        this.luarocks = luarocks;
        this.luarocksAdmin = luarocksAdmin;
        this.peParser = peParser;
    }
}

export class LuaRocksUnixSourcesInfoDetails {
    private configureScript: string;

    getConfigureScript(): string {
        return this.configureScript;
    }

    constructor(configureScript: string) {
        this.configureScript = configureScript;
    }
}

export class LuaRocksSourcesInfo {
    private dir: string;
    private details: LuaRocksWindowsSourcesInfoDetails | LuaRocksUnixSourcesInfoDetails;

    constructor(dir: string, details: LuaRocksWindowsSourcesInfoDetails | LuaRocksUnixSourcesInfoDetails) {
        this.dir = dir;
        this.details = details;
    }

    getDir(): string {
        return this.dir;
    }

    getDetails(): LuaRocksWindowsSourcesInfoDetails | LuaRocksUnixSourcesInfoDetails {
        return this.details;
    }
}
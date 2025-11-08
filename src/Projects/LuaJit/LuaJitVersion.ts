export interface ILuaJitVersion {
    getMajor(): string;
    getMinor(): string;
    getRelease(): string;
    getABI(): string;
}

export class LuaJitBaseVersion implements ILuaJitVersion {
    private major: string;
    private minor: string;
    private release: string;
    private abi: string;

    getMajor(): string {
        return this.major;
    }
    getMinor(): string {
        return this.minor;
    }
    getRelease(): string {
        return this.release;
    }
    getABI(): string {
        return this.abi;
    }

    protected constructor(major: string, minor: string, release: string, abi: string) {
        this.major = major;
        this.minor = minor;
        this.release = release;
        this.abi = abi;
    }
}

export class LuaJitVersion extends LuaJitBaseVersion {
    constructor(major: string, minor: string, release: string, abi: string) {
        super(major, minor, release, abi);
    }
}

export class OpenRestyVersion extends LuaJitBaseVersion {
    constructor(major: string, minor: string, release: string, abi: string) {
        super(major, minor, release, abi);
    }
}
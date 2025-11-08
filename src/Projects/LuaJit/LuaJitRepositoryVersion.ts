export interface ILuaJitRepositoryVersion {
    getName(): string;
    getKind(): string;
    getRepository(): string;
    getRef(): string;
    getString(): string;
}

interface ILuaJitRepositoryVersionOptions {
    name: string;
    kind: string;
    repository: string;
    ref: string;
}

interface ILuaJitRepositoryVersionFactory {
    create: (opts: ILuaJitRepositoryVersionOptions) => ILuaJitRepositoryVersion;
}

const CONVERT_LUAJIT: any = {
    "openresty": {
        name: "OpenResty",
        repository: "https://github.com/openresty/luajit2",
        ref: "v2.1-agentzh",
        create: (opts: ILuaJitRepositoryVersionOptions) => new OpenRestyRepositoryVersion(opts)
    },
    "luajit": {
        name: "LuaJIT",
        repository: "https://github.com/LuaJIT/LuaJIT",
        ref: "v2.1",
        create: (opts: ILuaJitRepositoryVersionOptions) => new LuaJitRepositoryVersion(opts)
    }
}

export function parseLuaJitRepositoryVersion(version: string): Promise<ILuaJitRepositoryVersion> {
    return new Promise<ILuaJitRepositoryVersion>((resolve, reject) => {
        if (version in CONVERT_LUAJIT) {
            const details = CONVERT_LUAJIT[version];
            const repository = <string>(details.repository);
            const name = <string>(details.name);
            const defaultBranch = <string>(details.ref);
            const create = (<ILuaJitRepositoryVersionFactory>details).create;
            resolve(create({ name: name, kind: version, repository: repository, ref: defaultBranch }));
        }
        else {
            const match = /^(openresty|luajit)\@(.*)$/.exec(version);
            if (match) {
                const kind = match[1];
                if (kind in CONVERT_LUAJIT) {
                    const details = CONVERT_LUAJIT[kind];
                    const repository = <string>(details.repository);
                    const name = <string>(details.name);
                    const ref = match[2];
                    const create = (<ILuaJitRepositoryVersionFactory>details).create;
                    resolve(create({ name: name, kind: kind, repository: repository, ref: ref }));
                }
                else {
                    reject(new Error("Internal error: unexpected condition to convert LuaJIT / OpenResty version to the proper repository"));
                }
            }
            else {
                reject(new Error("Unknown format for the LuaJIT / OpenResty version"));
            }
        }
    });
}

export class LuaJitBaseRepositoryVersion implements ILuaJitRepositoryVersion {
    private options: ILuaJitRepositoryVersionOptions;

    getName(): string {
        return this.options.name;
    }

    getKind(): string {
        return this.options.kind;
    }

    getRepository(): string {
        return this.options.repository;
    }

    getRef(): string {
        return this.options.ref;
    }

    getString(): string {
        return this.options.ref;
    }

    protected constructor(opts: ILuaJitRepositoryVersionOptions) {
        this.options = {
            name: opts.name,
            kind: opts.kind,
            repository: opts.repository,
            ref: opts.ref
        };
    }
}

export class LuaJitRepositoryVersion extends LuaJitBaseRepositoryVersion {
    constructor(opts: ILuaJitRepositoryVersionOptions) {
        super(opts);
    }
}

export class OpenRestyRepositoryVersion extends LuaJitBaseRepositoryVersion {
    constructor(opts: ILuaJitRepositoryVersionOptions) {
        super(opts);
    }
}
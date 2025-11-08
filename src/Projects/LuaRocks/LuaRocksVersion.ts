import { arch } from "node:os";

export interface ILuaRocksVersion {
    getDownloadUrl(): string;
    getIdentifier(): string;
}

const LATEST_LUAROCKS = "3.12.2";

interface LuaRocksReleaseVersionHash {
    algorithm: string;
    value: string;
}

interface LuaRocksReleaseVersionInfo {
    filename: string;
    version: string;
    hash: LuaRocksReleaseVersionHash;
}

const LUAROCKS_RELEASES_WINDOWS_X86: {[key: string]: LuaRocksReleaseVersionInfo} = {
    "3.10.0": { "filename": "luarocks-3.10.0-windows-32.zip", "version": "3.10.0", "hash": { "algorithm": "sha256", "value": "51058b21221dd96642de16d8d17967086761409c257c6d6bb32741dc2243ce84" } },
    "3.11.0": { "filename": "luarocks-3.11.0-windows-32.zip", "version": "3.11.0", "hash": { "algorithm": "sha256", "value": "64014ff939510614c5836b678f121b39a626f56bc5c88366ccbc130deacd1637" } },
    "3.11.1": { "filename": "luarocks-3.11.1-windows-32.zip", "version": "3.11.1", "hash": { "algorithm": "sha256", "value": "44c7034d720a3767df964683722bd303311db9dabed11773dafbfa96add2eda7" } },
    "3.12.0": { "filename": "luarocks-3.12.0-windows-32.zip", "version": "3.12.0", "hash": { "algorithm": "sha256", "value": "f70344d7e88102ebe12c1b2b5c153f2e32fcaf663a90d12fb6cc2b994054ffe0" } },
    "3.12.1": { "filename": "luarocks-3.12.1-windows-32.zip", "version": "3.12.1", "hash": { "algorithm": "sha256", "value": "bf73b9f3576f20d47aeeaa5bee5adac8b4cd7ec3bae8534906735b2bd34bba3e" } },
    "3.12.2": { "filename": "luarocks-3.12.2-windows-32.zip", "version": "3.12.2", "hash": { "algorithm": "sha256", "value": "514f8a9700a98ec11a48adc21bb3afa8a8443018640e3221e124834f056bf6f4" } },
    "3.9.1": { "filename": "luarocks-3.9.1-windows-32.zip", "version": "3.9.1", "hash": { "algorithm": "sha256", "value": "1b473fd3b9494cec31d98f7642babf12cc832551fd69fb7081e8baf4c54e0fa5" } },
    "3.9.2": { "filename": "luarocks-3.9.2-windows-32.zip", "version": "3.9.2", "hash": { "algorithm": "sha256", "value": "e7bf11b9f7d3942db806b3f57d7dfacbe4f7a5b558f3e200b061a1d6e1f62255" } }
}

const LUAROCKS_RELEASES_WINDOWS_X64: {[key: string]: LuaRocksReleaseVersionInfo} = {
    "3.10.0": { "filename": "luarocks-3.10.0-windows-64.zip", "version": "3.10.0", "hash": { "algorithm": "sha256", "value": "fe0bc950187f67e22f237bc144e92a01993128749fd9adfc1764a6b4f4ca900d" } },
    "3.11.0": { "filename": "luarocks-3.11.0-windows-64.zip", "version": "3.11.0", "hash": { "algorithm": "sha256", "value": "a638ea4c8e858106e8e2598e50e9b3fd563c111b44c36d33fe0f0e64d9f42685" } },
    "3.11.1": { "filename": "luarocks-3.11.1-windows-64.zip", "version": "3.11.1", "hash": { "algorithm": "sha256", "value": "c71dba3d03e12305e9ccd022c621c8869aba3d124d9249e214aed5c16f3682a3" } },
    "3.12.0": { "filename": "luarocks-3.12.0-windows-64.zip", "version": "3.12.0", "hash": { "algorithm": "sha256", "value": "76aa3d4943e1d5204f311b232d6b6b72eb00027c54968643b5571d6ec56db57c" } },
    "3.12.1": { "filename": "luarocks-3.12.1-windows-64.zip", "version": "3.12.1", "hash": { "algorithm": "sha256", "value": "8106307ab7fd1a87cc4c6c7898b15231a35ed0353426e15eb0e060cd12ab34ad" } },
    "3.12.2": { "filename": "luarocks-3.12.2-windows-64.zip", "version": "3.12.2", "hash": { "algorithm": "sha256", "value": "d3f4ddda6926618cadf560170a7c18a5ceead5997ba10832cd0e3b624c7de886" } },
    "3.9.1": { "filename": "luarocks-3.9.1-windows-64.zip", "version": "3.9.1", "hash": { "algorithm": "sha256", "value": "f41218504c2c7a0335793cb5e0c0b2295972e261d38d21bdd4045a0c6fc1716d" } },
    "3.9.2": { "filename": "luarocks-3.9.2-windows-64.zip", "version": "3.9.2", "hash": { "algorithm": "sha256", "value": "ab7e34332eedd6270b97f44df462e4584d3a60377205d88ea2806ecc547f074f" } }
}

const LUAROCKS_RELEASES_UNIX: {[key: string]: LuaRocksReleaseVersionInfo} = {
    /*"3.0.0": { "filename": "luarocks-3.0.0.tar.gz", "version": "3.0.0", "hash": { "algorithm": "sha256", "value": "a43fffb997100f11cccb529a3db5456ce8dab18171a5cb3645f948147b6f64a1" } },
    "3.0.1": { "filename": "luarocks-3.0.1.tar.gz", "version": "3.0.1", "hash": { "algorithm": "sha256", "value": "b989c4b60d6c9edcd65169e5e42fcffbd39cdbebe6b138fa5aea45102f8d9ec0" } },
    "3.0.2": { "filename": "luarocks-3.0.2.tar.gz", "version": "3.0.2", "hash": { "algorithm": "sha256", "value": "3836267eff2f85fb552234e966602b1e649c58f81f47c7de3785e071c8127f5a" } },
    "3.0.3": { "filename": "luarocks-3.0.3.tar.gz", "version": "3.0.3", "hash": { "algorithm": "sha256", "value": "f9a3fca236c87db55bc128a182ff605731ca15b43b1c4942d98f5e34acc88a6e" } },
    "3.0.4": { "filename": "luarocks-3.0.4.tar.gz", "version": "3.0.4", "hash": { "algorithm": "sha256", "value": "1236a307ca5c556c4fed9fdbd35a7e0e80ccf063024becc8c3bf212f37ff0edf" } },
    "3.1.0": { "filename": "luarocks-3.1.0.tar.gz", "version": "3.1.0", "hash": { "algorithm": "sha256", "value": "865eae1e49b0f701c955c1c8f7b6fae99287c9cef32227d64177509224908921" } },
    "3.1.1": { "filename": "luarocks-3.1.1.tar.gz", "version": "3.1.1", "hash": { "algorithm": "sha256", "value": "3c26c102f8e69f81e12ea39037c770a00b6244e115a4c832e7a92feffdfad1aa" } },
    "3.1.2": { "filename": "luarocks-3.1.2.tar.gz", "version": "3.1.2", "hash": { "algorithm": "sha256", "value": "72a3b74f05b7fd011eed894dc34193ee80b3235fe58016ac9ffdbfceecc88950" } },
    "3.1.3": { "filename": "luarocks-3.1.3.tar.gz", "version": "3.1.3", "hash": { "algorithm": "sha256", "value": "c573435f495aac159e34eaa0a3847172a2298eb6295fcdc35d565f9f9b990513" } },
    "3.2.0": { "filename": "luarocks-3.2.0.tar.gz", "version": "3.2.0", "hash": { "algorithm": "sha256", "value": "66c1848a25924917ddc1901e865add8f19f2585360c44a001a03a8c234d3e796" } },
    "3.2.1": { "filename": "luarocks-3.2.1.tar.gz", "version": "3.2.1", "hash": { "algorithm": "sha256", "value": "f27e20c9cdb3ffb991ccdb85796c36a0690566676f8e1a59b0d0ee6598907d04" } },
    "3.3.0": { "filename": "luarocks-3.3.0.tar.gz", "version": "3.3.0", "hash": { "algorithm": "sha256", "value": "8de54eb851f5245ed3708d94d8872e825b9704049d3ad4febe8e219f419b427d" } },
    "3.3.1": { "filename": "luarocks-3.3.1.tar.gz", "version": "3.3.1", "hash": { "algorithm": "sha256", "value": "eb20cd9814df05535d9aae98da532217c590fc07d48d90ca237e2a7cdcf284fe" } },
    "3.4.0": { "filename": "luarocks-3.4.0.tar.gz", "version": "3.4.0", "hash": { "algorithm": "sha256", "value": "62ce5826f0eeeb760d884ea8330cd1552b5d432138b8bade0fa72f35badd02d0" } },
    "3.5.0": { "filename": "luarocks-3.5.0.tar.gz", "version": "3.5.0", "hash": { "algorithm": "sha256", "value": "701d0cc0c7e97cc2cf2c2f4068fce45e52a8854f5dc6c9e49e2014202eec9a4f" } },
    "3.6.0": { "filename": "luarocks-3.6.0.tar.gz", "version": "3.6.0", "hash": { "algorithm": "sha256", "value": "b0eaf59e7711ca2a886722c0423dabe22ccbdcdf3a042c3f2615596879f8252f" } },
    "3.7.0": { "filename": "luarocks-3.7.0.tar.gz", "version": "3.7.0", "hash": { "algorithm": "sha256", "value": "9255d97fee95cec5b54fc6ac718b11bf5029e45bed7873e053314919cd448551" } },
    "3.8.0": { "filename": "luarocks-3.8.0.tar.gz", "version": "3.8.0", "hash": { "algorithm": "sha256", "value": "56ab9b90f5acbc42eb7a94cf482e6c058a63e8a1effdf572b8b2a6323a06d923" } },
    "3.9.0": { "filename": "luarocks-3.9.0.tar.gz", "version": "3.9.0", "hash": { "algorithm": "sha256", "value": "5e840f0224891de96be4139e9475d3b1de7af3a32b95c1bdf05394563c60175f" } },
    */"3.9.1": { "filename": "luarocks-3.9.1.tar.gz", "version": "3.9.1", "hash": { "algorithm": "sha256", "value": "ffafd83b1c42aa38042166a59ac3b618c838ce4e63f4ace9d961a5679ef58253" } },
    "3.9.2": { "filename": "luarocks-3.9.2.tar.gz", "version": "3.9.2", "hash": { "algorithm": "sha256", "value": "bca6e4ecc02c203e070acdb5f586045d45c078896f6236eb46aa33ccd9b94edb" } },
    "3.10.0": { "filename": "luarocks-3.10.0.tar.gz", "version": "3.10.0", "hash": { "algorithm": "sha256", "value": "e9bf06d5ec6b8ecc6dbd1530d2d77bdb3377d814a197c46388e9f148548c1c89" } },
    "3.11.0": { "filename": "luarocks-3.11.0.tar.gz", "version": "3.11.0", "hash": { "algorithm": "sha256", "value": "25f56b3c7272fb35b869049371d649a1bbe668a56d24df0a66e3712e35dd44a6" } },
    "3.11.1": { "filename": "luarocks-3.11.1.tar.gz", "version": "3.11.1", "hash": { "algorithm": "sha256", "value": "c3fb3d960dffb2b2fe9de7e3cb004dc4d0b34bb3d342578af84f84325c669102" } },
    "3.12.0": { "filename": "luarocks-3.12.0.tar.gz", "version": "3.12.0", "hash": { "algorithm": "sha256", "value": "3d4c8acddf9b975e77da68cbf748d5baf483d0b6e9d703a844882db25dd61cdf" } },
    "3.12.1": { "filename": "luarocks-3.12.1.tar.gz", "version": "3.12.1", "hash": { "algorithm": "sha256", "value": "f56b85a2a7a481f0321845807b79a05237860b04e4a9d186da632770029b3290" } },
    "3.12.2": { "filename": "luarocks-3.12.2.tar.gz", "version": "3.12.2", "hash": { "algorithm": "sha256", "value": "b0e0c85205841ddd7be485f53d6125766d18a81d226588d2366931e9a1484492" } }
}

export function parseLuaRocksVersion(version: string): Promise<ILuaRocksVersion | undefined> {
    return new Promise<ILuaRocksVersion | undefined>((resolve, reject) => {
        const luaRocksVersion = version === "" ? LATEST_LUAROCKS : version;
        if (luaRocksVersion === "none") {
            resolve(undefined);
        }
        else if (process.platform === 'win32') {
            const osArch = arch();
            if (osArch === 'ia32' || osArch === 'arm64') {
                if (luaRocksVersion in LUAROCKS_RELEASES_WINDOWS_X86) {
                    const zipInfo = LUAROCKS_RELEASES_WINDOWS_X86[luaRocksVersion];
                    const downloadUrl = "https://luarocks.github.io/luarocks/releases/" + zipInfo.filename;
                    const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(luaRocksVersion);
                    if (match) {
                        const major = Number(match[1]);
                        const minor = Number(match[2]);
                        const patch = Number(match[3]);
                        const hash = zipInfo.hash;
                        resolve(new LuaRocksReleaseVersion(major, minor, patch, downloadUrl, hash.algorithm, hash.value));
                    }
                    else {
                        reject(new Error("Internal error: regex mismatch for a LuaRocks release version"));
                    }
                }
                else {
                    reject(new Error("LuaRocks version is too old"));
                }
            }
            else if (osArch === 'x64') {
                if (luaRocksVersion in LUAROCKS_RELEASES_WINDOWS_X64) {
                    const zipInfo = LUAROCKS_RELEASES_WINDOWS_X64[luaRocksVersion];
                    const downloadUrl = "https://luarocks.github.io/luarocks/releases/" + zipInfo.filename;
                    const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(luaRocksVersion);
                    if (match) {
                        const major = Number(match[1]);
                        const minor = Number(match[2]);
                        const patch = Number(match[3]);
                        const hash = zipInfo.hash;
                        resolve(new LuaRocksReleaseVersion(major, minor, patch, downloadUrl, hash.algorithm, hash.value));
                    }
                    else {
                        reject(new Error("Internal error: regex mismatch for a LuaRocks release version"));
                    }
                }
                else {
                    reject(new Error("LuaRocks version is too old"));
                }
            }
            else {
                reject(new Error("Unsupported architecture to install LuaRocks on Windows"));
            }
        }
        else if (luaRocksVersion.startsWith("@")) {
            const ref = luaRocksVersion.substring(1);
            const downloadUrl = `https://github.com/luarocks/luarocks/archive/${ref}.tar.gz`;
            resolve(new LuaRocksRepositoryVersion(ref, downloadUrl));
        }
        else if (luaRocksVersion in LUAROCKS_RELEASES_UNIX) {
            const tarballInfo = LUAROCKS_RELEASES_UNIX[luaRocksVersion];
            const downloadUrl = "https://luarocks.github.io/luarocks/releases/" + tarballInfo.filename;
            const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(luaRocksVersion);
            if (match) {
                const major = Number(match[1]);
                const minor = Number(match[2]);
                const patch = Number(match[3]);
                const hash = tarballInfo.hash;
                resolve(new LuaRocksReleaseVersion(major, minor, patch, downloadUrl, hash.algorithm, hash.value));
            }
            else {
                reject(new Error("Internal error: regex mismatch for a LuaRocks release version"));
            }
        }
        else {
            reject(new Error("Unknown LuaRocks version to install on Unix-like systems"));
        }
    });
}

export class LuaRocksBaseVersion implements ILuaRocksVersion {
    private identifier: string;
    private downloadUrl: string;

    getIdentifier(): string {
        return this.identifier;
    }
    getDownloadUrl(): string {
        return this.downloadUrl;
    }

    constructor(identifier: string, downloadUrl: string) {
        this.identifier = identifier;
        this.downloadUrl = downloadUrl;
    }
}

export class LuaRocksReleaseVersion extends LuaRocksBaseVersion {
    private major: number;
    private minor: number;
    private patch: number;
    private hashAlgorithm: string;
    private hashValue: string;
    getMajor(): number {
        return this.major;
    }
    getMinor(): number {
        return this.minor;
    }
    getPatch(): number {
        return this.patch;
    }
    getHashAlgorithm(): string {
        return this.hashAlgorithm;
    }
    getHashValue(): string {
        return this.hashValue;
    }
    constructor(major: number, minor: number, patch: number, downloadUrl: string, hashAlgorithm: string, hashValue: string) {
        super(`${major}.${minor}.${patch}`, downloadUrl);
        this.major = major;
        this.minor = minor;
        this.patch = patch;
        this.hashAlgorithm = hashAlgorithm;
        this.hashValue = hashValue;
    }
}

export class LuaRocksRepositoryVersion extends LuaRocksBaseVersion {
    constructor(identifier: string, downloadUrl: string) {
        super(identifier, downloadUrl);
    }
}
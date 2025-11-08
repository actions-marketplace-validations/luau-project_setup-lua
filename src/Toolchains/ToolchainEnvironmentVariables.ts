import { GitHubInput } from "../Util/GitHubInput";
import { parseInputSemiColon } from "../Util/ParseInputSemiColon";

export interface IToolchainEnvironmentVariables {
    getRawCC(): string;
    getRawLD(): string;
    getRawAR(): string;
    getRawSTRIP(): string;
    getRawRANLIB(): string;
    getRawRC(): string;
    getCC(): string;
    getLD(): string;
    getAR(): string;
    getSTRIP(): string;
    getRANLIB(): string;
    getRC(): string;
    getMake(): string;
    getToolchainPrefix(): string;

    getCflagsExtra(): string[];
    getIncDirsExtra(): string[];
    getLdFlagsExtra(): string[];
    getLibDirsExtra(): string[];
    getLibsExtra(): string[];
    getLuaPatches(): string[];
    getLuaRocksPatches(): string[];
}

export class ToolchainEnvironmentVariables implements IToolchainEnvironmentVariables {
    private static _instance: IToolchainEnvironmentVariables;
    static instance(): IToolchainEnvironmentVariables {
        if (!ToolchainEnvironmentVariables._instance) {
            ToolchainEnvironmentVariables._instance = new ToolchainEnvironmentVariables();
        }
        return ToolchainEnvironmentVariables._instance;
    }
    getRawCC(): string {
        let msystem = process.env["MSYSTEM"] || "";
        if (msystem) {
            msystem = msystem.toUpperCase().trim();
        }

        return (GitHubInput.instance().getInputCC() || process.env["CC"] ||
            (process.env["VCINSTALLDIR"] ? "cl" :
                ((process.platform === 'win32' && !msystem.startsWith("CLANG")) ? "gcc" : "cc"))).trim();
    }
    getRawLD(): string {
        return (GitHubInput.instance().getInputLD() || process.env["LD"] ||
            (process.env["VCINSTALLDIR"] ? "link" :
                (process.platform === 'win32' ? "gcc" : "cc"))).trim();
    }
    getRawAR(): string {
        return (GitHubInput.instance().getInputAR() || process.env["AR"] || (process.env["VCINSTALLDIR"] ? "lib" : "ar")).trim();
    }
    getRawSTRIP(): string {
        return (GitHubInput.instance().getInputSTRIP() || process.env["STRIP"] || "strip").trim();
    }
    getRawRANLIB(): string {
        return (GitHubInput.instance().getInputRANLIB() || process.env["RANLIB"] || "ranlib").trim();
    }
    getRawRC(): string {
        return (GitHubInput.instance().getInputRC() || process.env["RC"] || (process.env["VCINSTALLDIR"] ? "rc" : "windres")).trim();
    }
    getCC(): string {
        return this.getToolchainPrefix() + this.getRawCC();
    }
    getLD(): string {
        return this.getToolchainPrefix() + this.getRawLD();
    }
    getAR(): string {
        return this.getToolchainPrefix() + this.getRawAR();
    }
    getSTRIP(): string {
        return this.getToolchainPrefix() + this.getRawSTRIP();
    }
    getRANLIB(): string {
        return this.getToolchainPrefix() + this.getRawRANLIB();
    }
    getRC(): string {
        return this.getToolchainPrefix() + this.getRawRC();
    }
    getMake(): string {
        return (GitHubInput.instance().getInputMake() || process.env["MAKE"] ||
            (process.env["VCINSTALLDIR"] ? "nmake" : 
                (process.platform === 'win32' ?
                    "mingw32-make" :
                    (process.platform === 'freebsd' || process.platform === 'openbsd' || process.platform === 'netbsd') ?
                    "gmake" : "make"))).trim();
    }
    getToolchainPrefix(): string {
        return (GitHubInput.instance().getInputToolchainPrefix() || process.env["TOOLCHAIN_PREFIX"] || "");
    }

    private getSemiColonSeparatedInput(inputGetter: () => string | undefined, inputName: string): string[] {
        const rawInput = inputGetter() || process.env[inputName];
        return parseInputSemiColon(rawInput);
    }
    getCflagsExtra(): string[] {
        return this.getSemiColonSeparatedInput(
            () => GitHubInput.instance().getInputCflagsExtra(),
            "CFLAGS_EXTRA"
        );
    }
    getIncDirsExtra(): string[] {
        return this.getSemiColonSeparatedInput(
            () => GitHubInput.instance().getInputIncDirsExtra(),
            "INCDIRS_EXTRA"
        );
    }
    getLdFlagsExtra(): string[] {
        return this.getSemiColonSeparatedInput(
            () => GitHubInput.instance().getInputLdflagsExtra(),
            "LDFLAGS_EXTRA"
        );
    }
    getLibDirsExtra(): string[] {
        return this.getSemiColonSeparatedInput(
            () => GitHubInput.instance().getInputLibDirsExtra(),
            "LIBDIRS_EXTRA"
        );
    }
    getLibsExtra(): string[] {
        return this.getSemiColonSeparatedInput(
            () => GitHubInput.instance().getInputLibsExtra(),
            "LIBS_EXTRA"
        );
    }
    getLuaPatches(): string[] {
        return this.getSemiColonSeparatedInput(
            () => GitHubInput.instance().getInputLuaPatches(),
            "LUA_PATCHES"
        );
    }
    getLuaRocksPatches(): string[] {
        return this.getSemiColonSeparatedInput(
            () => GitHubInput.instance().getInputLuaRocksPatches(),
            "LUAROCKS_PATCHES"
        );
    }
    private constructor() {
    }
}
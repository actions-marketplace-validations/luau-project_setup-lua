import { GitHubCore } from "../GitHubCore";

export interface IGitHubInput {
    getInputCC(): string | undefined;
    getInputLD(): string | undefined;
    getInputAR(): string | undefined;
    getInputSTRIP(): string | undefined;
    getInputRANLIB(): string | undefined;
    getInputRC(): string | undefined;
    getInputMake(): string | undefined;
    getInputToolchainPrefix(): string | undefined;
    getInputDebugSetupLua(): boolean;
    getInputLuaVersion(): string | undefined;
    getInputLuaRocksVersion(): string | undefined;
    getInputMacOSXDeploymentTarget(): string | undefined;
    getInputUseCache(): boolean;

    getInputCflagsExtra(): string | undefined;
    getInputIncDirsExtra(): string | undefined;
    getInputLdflagsExtra(): string | undefined;
    getInputLibDirsExtra(): string | undefined;
    getInputLibsExtra(): string | undefined;
    getInputLuaPatches(): string | undefined;
    getInputLuaRocksPatches(): string | undefined;
}

export class GitHubInput implements IGitHubInput {
    private static _instance: IGitHubInput;
    static instance(): IGitHubInput {
        if (!GitHubInput._instance) {
            GitHubInput._instance = new GitHubInput();
        }
        return GitHubInput._instance;
    }
    getInputDebugSetupLua(): boolean {
        const debugMode = GitHubCore.instance().getInput("debug-setup-lua");
        return debugMode === "true" ||
            debugMode === "True" ||
            debugMode === "TRUE" ||
            debugMode === "1" ||
            debugMode === "on" ||
            debugMode === "On" ||
            debugMode === "ON" ||
            debugMode === "y" ||
            debugMode === "Y" ||
            debugMode === "yes" ||
            debugMode === "Yes" ||
            debugMode === "YES";
    }
    getInputCC(): string | undefined {
        return GitHubCore.instance().getInput("cc");
    }
    getInputLD(): string | undefined {
        return GitHubCore.instance().getInput("ld");
    }
    getInputAR(): string | undefined {
        return GitHubCore.instance().getInput("ar");
    }
    getInputSTRIP(): string | undefined {
        return GitHubCore.instance().getInput("strip");
    }
    getInputRANLIB(): string | undefined {
        return GitHubCore.instance().getInput("ranlib");
    }
    getInputRC(): string | undefined {
        return GitHubCore.instance().getInput("rc");
    }
    getInputMake(): string | undefined {
        return GitHubCore.instance().getInput("make");
    }
    getInputToolchainPrefix(): string | undefined {
        return GitHubCore.instance().getInput("toolchain-prefix");
    }
    getInputLuaVersion(): string | undefined {
        return GitHubCore.instance().getInput("lua-version");
    }
    getInputLuaRocksVersion(): string | undefined {
        return GitHubCore.instance().getInput("luarocks-version");
    }
    getInputMacOSXDeploymentTarget(): string | undefined {
        return GitHubCore.instance().getInput("macosx-deployment-target");
    }
    getInputUseCache(): boolean {
        const useCache = GitHubCore.instance().getInput("use-cache");
        return useCache === undefined ||
            useCache === '' ||
            useCache === "true" ||
            useCache === "True" ||
            useCache === "TRUE" ||
            useCache === "1" ||
            useCache === "on" ||
            useCache === "On" ||
            useCache === "ON" ||
            useCache === "y" ||
            useCache === "Y" ||
            useCache === "yes" ||
            useCache === "Yes" ||
            useCache === "YES";
    }

    getInputCflagsExtra(): string | undefined {
        return GitHubCore.instance().getInput("cflags-extra");
    }
    getInputIncDirsExtra(): string | undefined {
        return GitHubCore.instance().getInput("incdirs-extra");
    }
    getInputLdflagsExtra(): string | undefined {
        return GitHubCore.instance().getInput("ldflags-extra");
    }
    getInputLibDirsExtra(): string | undefined {
        return GitHubCore.instance().getInput("libdirs-extra");
    }
    getInputLibsExtra(): string | undefined {
        return GitHubCore.instance().getInput("libs-extra");
    }
    getInputLuaPatches(): string | undefined {
        return GitHubCore.instance().getInput("lua-patches");
    }
    getInputLuaRocksPatches(): string | undefined {
        return GitHubCore.instance().getInput("luarocks-patches");
    }
}
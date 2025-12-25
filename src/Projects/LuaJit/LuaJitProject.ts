import { join } from "node:path";
import { IToolchain } from "../../Toolchains/IToolchain";
import { IGetSetProperty } from "../../Util/IGetSetProperty";
import { IProject } from "../IProject";
import { ILuaJitRepositoryVersion } from "./LuaJitRepositoryVersion";
import { GetSetProperty } from "../../Util/GetSetProperty";
import { TargetPipeline } from "../Targets/TargetPipeline";
import { LuaJitCreateBuildDirectoriesTarget } from "./Configuration/LuaJitCreateBuildDirectoriesTarget";
import { LuaJitBuildTarget } from "./Building/LuaJitBuildTarget";
import { ILuaJitVersion } from "./LuaJitVersion";
import { LuaJitWindowsCreateInstallationDirectoriesTarget } from "./Installation/LuaJitWindowsCreateInstallationDirectoriesTarget";
import { LuaJitUnixInstall } from "./Installation/LuaJitUnixInstall";

export class LuaJitProject implements IProject {
    private version: ILuaJitRepositoryVersion;
    private buildDir: string;
    private installDir: string;
    private toolchain: IToolchain;
    /* build directories */
    private remotePatchesBuildDir: string;
    /* install directories */
    private installBaseIncludeDir: string;
    private installBinDir: string;
    private installLibDir: string;
    private installManDir: string;
    private installPkgConfigDir: string;
    private installLuaModulesDir: string;
    private installLuaJitModuleDir?: string;
    private installCModulesDir: string;
    private _configurationResult: IGetSetProperty<any>;
    private _buildResult: IGetSetProperty<any>;

    getVersion(): ILuaJitRepositoryVersion {
        return this.version;
    }
    getBuildDir(): string {
        return this.buildDir;
    }
    getRemotePatchesBuildDir(): string {
        return this.remotePatchesBuildDir;
    }
    getInstallDir(): string {
        return this.installDir;
    }
    getToolchain(): IToolchain {
        return this.toolchain;
    }
    getInstallBaseIncludeDir(): string {
        return this.installBaseIncludeDir;
    }
    getInstallIncludeDir(luajitVersion: ILuaJitVersion): string {
        return join(this.installBaseIncludeDir, `luajit-${luajitVersion.getMajor()}.${luajitVersion.getMinor()}`);
    }
    getInstallBinDir(): string {
        return this.installBinDir;
    }
    getInstallLibDir(): string {
        return this.installLibDir;
    }
    getInstallManDir(): string {
        return this.installManDir;
    }
    getInstallPkgConfigDir(): string {
        return this.installPkgConfigDir;
    }
    getInstallLuaModulesDir(): string {
        return this.installLuaModulesDir;
    }
    getInstallLuaJitModuleDir(): string | undefined {
        return this.installLuaJitModuleDir;
    }
    getInstallCModulesDir(): string {
        return this.installCModulesDir;
    }
    configurationResult(): IGetSetProperty<any> {
        return this._configurationResult;
    }
    buildResult(): IGetSetProperty<any> {
        return this._buildResult;
    }

    constructor(
        version: ILuaJitRepositoryVersion,
        buildDir: string,
        installDir: string,
        toolchain: IToolchain
    ) {
        this.version = version;
        this.buildDir = buildDir;
        this.installDir = installDir;
        this.toolchain = toolchain;
        this.remotePatchesBuildDir = join(this.buildDir, "remote-patches");
        this.installBaseIncludeDir = join(installDir, "include");
        this.installBinDir = join(installDir, "bin");
        this.installLibDir = join(installDir, "lib");
        this.installManDir = join(installDir, "share", "man", "man1");
        this.installPkgConfigDir = join(this.installLibDir, "pkgconfig");
        if (process.platform === 'win32') {
            this.installLuaModulesDir = join(this.installBinDir, "lua");
            this.installLuaJitModuleDir = join(this.installLuaModulesDir, "jit");
            this.installCModulesDir = this.installBinDir;
        }
        else {
            this.installLuaModulesDir = join(installDir, "share", "lua", "5.1");
            this.installCModulesDir = join(this.installLibDir, "lua", "5.1");
        }
        this._configurationResult = new GetSetProperty<any>(null);
        this._buildResult = new GetSetProperty<any>(null);
    }

    configure(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const initialConfigureTarget = new LuaJitCreateBuildDirectoriesTarget(this, null);
            const pipeline = new TargetPipeline(initialConfigureTarget);
            pipeline.execute()
                .then(resolve)
                .catch(reject);
        });
    }
    build(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const initialBuildTarget = new LuaJitBuildTarget(this, null, this.configurationResult().getValue());
            const pipeline = new TargetPipeline(initialBuildTarget);
            pipeline.execute()
                .then(resolve)
                .catch(reject);
        });
    }
    install(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const initialInstallTarget = process.platform === 'win32' ?
                new LuaJitWindowsCreateInstallationDirectoriesTarget(this, null, this.buildResult().getValue()) :
                new LuaJitUnixInstall(this, null, this.buildResult().getValue());
            const pipeline = new TargetPipeline(initialInstallTarget);
            pipeline.execute()
                .then(resolve)
                .catch(reject);
        });
    }
}
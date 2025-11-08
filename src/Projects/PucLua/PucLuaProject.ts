import { join } from "node:path";
import { IToolchain } from "../../Toolchains/IToolchain";
import { IProject } from "../IProject";
import { IPucLuaVersion, LUA_53_VERSION } from "./PucLuaVersion";
import { TargetPipeline } from "../Targets/TargetPipeline";
import { IGetSetProperty } from "../../Util/IGetSetProperty";
import { GetSetProperty } from "../../Util/GetSetProperty";
import { PucLuaCompileSharedLibTarget } from "./Building/PucLuaCompileSharedLibTarget";
import { PucLuaCreateBuildDirectoriesTarget } from "./Configuration/PucLuaCreateBuildDirectoriesTarget";
import { PucLuaCreateInstallationDirectoriesTarget } from "./Installation/PucLuaCreateInstallationDirectoriesTarget";

export class PucLuaProject implements IProject {
    private version: IPucLuaVersion;
    private buildDir: string;
    private installDir: string;
    private toolchain: IToolchain;
    /* build directories */
    private interpreterBuildDir: string;
    private compilerBuildDir: string;
    private libBuildDir: string;
    private sharedLibBuildDir: string;
    private staticLibBuildDir: string;
    /* install directories */
    private installIncludeDir: string;
    private installBinDir: string;
    private installLibDir: string;
    private installManDir: string;
    private installPkgConfigDir: string;
    private installLuaModulesDir: string;
    private installCModulesDir: string;
    private _configurationResult: IGetSetProperty<any>;
    private _buildResult: IGetSetProperty<any>;

    getVersion(): IPucLuaVersion {
        return this.version;
    }
    getBuildDir(): string {
        return this.buildDir;
    }
    getInstallDir(): string {
        return this.installDir;
    }
    getToolchain(): IToolchain {
        return this.toolchain;
    }
    getInterpreterBuildDir(): string {
        return this.interpreterBuildDir;
    }
    getCompilerBuildDir(): string {
        return this.compilerBuildDir;
    }
    getLibBuildDir(): string {
        return this.libBuildDir;
    }
    getSharedLibBuildDir(): string {
        return this.sharedLibBuildDir;
    }
    getStaticLibBuildDir(): string {
        return this.staticLibBuildDir;
    }
    getInstallIncludeDir(): string {
        return this.installIncludeDir;
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
        version: IPucLuaVersion,
        buildDir: string,
        installDir: string,
        toolchain: IToolchain
    ) {
        this.version = version;
        this.buildDir = buildDir;
        this.installDir = installDir;
        this.toolchain = toolchain;
        this.interpreterBuildDir = join(buildDir, "interpreter");
        this.compilerBuildDir = join(buildDir, "compiler");
        this.libBuildDir = join(buildDir, "lib");
        this.sharedLibBuildDir = join(this.libBuildDir, "shared");
        this.staticLibBuildDir = join(this.libBuildDir, "static");
        this.installIncludeDir = join(installDir, "include");
        this.installBinDir = join(installDir, "bin");
        this.installLibDir = join(installDir, "lib");
        this.installManDir = join(installDir, "share", "man", "man1");
        this.installPkgConfigDir = join(this.installLibDir, "pkgconfig");
        if (process.platform === 'win32' && version.compareTo(LUA_53_VERSION) < 0) {
            this.installLuaModulesDir = join(this.installBinDir, "lua");
            this.installCModulesDir = this.installBinDir;
        }
        else {
            this.installLuaModulesDir = join(installDir, "share", "lua", `${version.getMajor()}.${version.getMinor()}`);
            this.installCModulesDir = join(this.installLibDir, "lua", `${version.getMajor()}.${version.getMinor()}`);
        }
        this._configurationResult = new GetSetProperty<any>(null);
        this._buildResult = new GetSetProperty<any>(null);
    }
    configure(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const initialConfigureTarget = new PucLuaCreateBuildDirectoriesTarget(this, null);
            const pipeline = new TargetPipeline(initialConfigureTarget);
            pipeline.execute()
                .then(resolve)
                .catch(reject);
        });
    }
    build(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const initialBuildTarget = new PucLuaCompileSharedLibTarget(this, null, this.configurationResult().getValue());
            const pipeline = new TargetPipeline(initialBuildTarget);
            pipeline.execute()
                .then(resolve)
                .catch(reject);
        });
    }
    install(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const initialInstallTarget = new PucLuaCreateInstallationDirectoriesTarget(this, null, this.buildResult().getValue());
            const pipeline = new TargetPipeline(initialInstallTarget);
            pipeline.execute()
                .then(resolve)
                .catch(reject);
        });
    }
}
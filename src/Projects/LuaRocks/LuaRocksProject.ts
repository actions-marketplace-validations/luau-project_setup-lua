import { join } from "node:path";
import { IToolchain } from "../../Toolchains/IToolchain";
import { GetSetProperty } from "../../Util/GetSetProperty";
import { IGetSetProperty } from "../../Util/IGetSetProperty";
import { IProject } from "../IProject";
import { TargetPipeline } from "../Targets/TargetPipeline";
import { LuaRocksCreateBuildDirectoriesTarget } from "./Configuration/LuaRocksCreateBuildDirectoriesTarget";
import { ILuaRocksVersion } from "./LuaRocksVersion";
import { LuaRocksBuildTarget } from "./Building/LuaRocksBuildTarget";
import { LuaRocksInstallTarget } from "./Installation/LuaRocksInstallTarget";

export class LuaRocksProject implements IProject {
    private version: ILuaRocksVersion;
    private buildDir: string;
    private installDir: string;
    private toolchain: IToolchain;
    private installBinDir: string;
    private _configurationResult: IGetSetProperty<any>;
    private _buildResult: IGetSetProperty<any>;

    getVersion(): ILuaRocksVersion {
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
    getInstallBinDir(): string {
        return this.installBinDir;
    }
    configurationResult(): IGetSetProperty<any> {
        return this._configurationResult;
    }
    buildResult(): IGetSetProperty<any> {
        return this._buildResult;
    }

    constructor(
        version: ILuaRocksVersion,
        buildDir: string,
        installDir: string,
        toolchain: IToolchain
    ) {
        this.version = version;
        this.buildDir = buildDir;
        this.installDir = installDir;
        this.toolchain = toolchain;
        this.installBinDir = join(installDir, "bin");
        this._configurationResult = new GetSetProperty<any>(null);
        this._buildResult = new GetSetProperty<any>(null);
    }
    configure(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const initialConfigureTarget = new LuaRocksCreateBuildDirectoriesTarget(this, null);
            const pipeline = new TargetPipeline(initialConfigureTarget);
            pipeline.execute()
                .then(resolve)
                .catch(reject);
        });
    }
    build(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const initialBuildTarget = new LuaRocksBuildTarget(this, null, this.configurationResult().getValue());
            const pipeline = new TargetPipeline(initialBuildTarget);
            pipeline.execute()
                .then(resolve)
                .catch(reject);
        });
    }
    install(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const initialInstallTarget = new LuaRocksInstallTarget(this, null, this.buildResult().getValue());
            const pipeline = new TargetPipeline(initialInstallTarget);
            pipeline.execute()
                .then(resolve)
                .catch(reject);
        });
    }
}
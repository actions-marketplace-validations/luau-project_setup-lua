import { IProject } from "../../IProject";
import { AbstractCreateDirectoriesTarget } from "../../Targets/AbstractCreateDirectoriesTarget";
import { ITarget } from "../../Targets/ITarget";
import { LuaJitWindowsBuildInfo } from "../Building/LuaJitWindowsBuildInfo";
import { LuaJitProject } from "../LuaJitProject";
import { LuaJitWindowsCopyInstallableArtifactsTarget } from "./LuaJitWindowsCopyInstallableArtifactsTarget";

export class LuaJitWindowsCreateInstallationDirectoriesTarget extends AbstractCreateDirectoriesTarget {
    private project: LuaJitProject;
    private parent: ITarget | null;
    private buildInfo: LuaJitWindowsBuildInfo;
    constructor(project: LuaJitProject, parent: ITarget | null, buildInfo: LuaJitWindowsBuildInfo) {
        super([
            project.getInstallDir(),
            project.getInstallIncludeDir(buildInfo.getSourcesInfo().getVersion()),
            project.getInstallBinDir(),
            project.getInstallLibDir(),
            project.getInstallManDir(),
            project.getInstallPkgConfigDir(),
            project.getInstallLuaModulesDir(),
            project.getInstallCModulesDir()
        ])
        this.project = project;
        this.parent = parent;
        this.buildInfo = buildInfo;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            console.log(`[Start] Create installation directories for ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getProject(): IProject {
        return this.project;
    }
    getParent(): ITarget | null {
        return this.parent;
    }
    getNext(): ITarget | null {
        return new LuaJitWindowsCopyInstallableArtifactsTarget(this.project, this);
    }
    getBuildInfo(): LuaJitWindowsBuildInfo {
        return this.buildInfo;
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = this.project.getVersion();
            console.log(`[End] Create installation directories for ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
}
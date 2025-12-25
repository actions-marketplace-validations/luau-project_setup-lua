import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { PucLuaProject } from "../PucLuaProject";
import { PucLuaCopyInstallableArtifactsTarget } from "./PucLuaCopyInstallableArtifactsTarget";
import { PucLuaBuildInfo } from "../Building/PucLuaBuildInfo";
import { AbstractCreateDirectoriesTarget } from "../../Targets/AbstractCreateDirectoriesTarget";
import { Console } from "../../../Console";

export class PucLuaCreateInstallationDirectoriesTarget extends AbstractCreateDirectoriesTarget {
    private parent: ITarget | null;
    private project: PucLuaProject;
    private buildInfo: PucLuaBuildInfo;
    constructor(project: PucLuaProject, parent: ITarget | null, buildInfo: PucLuaBuildInfo) {
        super([
            project.getInstallDir(),
            project.getInstallIncludeDir(),
            project.getInstallBinDir(),
            project.getInstallLibDir(),
            project.getInstallManDir(),
            project.getInstallPkgConfigDir(),
            project.getInstallLuaModulesDir(),
            project.getInstallCModulesDir()
        ]);
        this.project = project;
        this.parent = parent;
        this.buildInfo = buildInfo;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[Start] Create installation directories for Lua ${this.project.getVersion().getString()}`);
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
        return new PucLuaCopyInstallableArtifactsTarget(this.project, this);
    }
    getBuildInfo(): PucLuaBuildInfo {
        return this.buildInfo;
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[End] Create installation directories for Lua ${this.project.getVersion().getString()}`);
            resolve();
        });
    }

}
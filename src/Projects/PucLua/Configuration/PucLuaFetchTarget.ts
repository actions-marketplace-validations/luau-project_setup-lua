import { join } from "node:path";
import { IProject } from "../../IProject";
import { AbstractFetchTarballTarget } from "../../Targets/Fetch/AbstractFetchTarballTarget";
import { ITarget } from "../../Targets/ITarget";
import { PucLuaProject } from "../PucLuaProject";
import { PucLuaApplyPatchesTarget } from "./PucLuaApplyPatchesTarget";

export class PucLuaFetchTarget extends AbstractFetchTarballTarget {
    private parent: ITarget | null;
    private project: PucLuaProject;
    constructor(project: PucLuaProject, parent: ITarget | null) {
        super(
            project.getVersion().getDownloadUrl(),
            project.getBuildDir(),
            `lua-${project.getVersion().getString()}`, {
                fileHash: {
                    algorithm: project.getVersion().getHashAlgorithm(),
                    expectedHash: project.getVersion().getHashValue()
                }
            }
        )
        this.project = project;
        this.parent = parent;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[Start] Fetch Lua ${this.project.getVersion().getString()} source code`);
            resolve();
        });
    }
    getProject(): IProject {
        return this.project;
    }
    getParent(): ITarget | null {
        return this.parent;
    }
    getExtractedDir(): string {
        return join(this.getWorkDir(), `lua-${this.project.getVersion().getString()}`);
    }
    getNext(): ITarget | null {
        return new PucLuaApplyPatchesTarget(this.project, this);
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[End] Fetch Lua ${this.project.getVersion().getString()} source code`);
            resolve();
        });
    }

}
import { ToolchainEnvironmentVariables } from "../../../Toolchains/ToolchainEnvironmentVariables";
import { AbstractApplyPatchesTarget } from "../../Targets/AbstractApplyPatchesTarget";
import { ITarget } from "../../Targets/ITarget";
import { LuaJitProject } from "../LuaJitProject";
import { LuaJitConfigureSourcesTarget } from "./LuaJitConfigureSourcesTarget";
import { LuaJitFetchTarget } from "./LuaJitFetchTarget";

export class LuaJitApplyPatchesTarget extends AbstractApplyPatchesTarget {
    constructor(project: LuaJitProject, parent: LuaJitFetchTarget) {
        super(project, parent, parent.getExtractedDir(), project.getRemotePatchesBuildDir(), ToolchainEnvironmentVariables.instance().getLuaPatches());
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = (<LuaJitProject>this.getProject()).getVersion();
            console.log(`[Start] Apply patches on ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
    getNext(): ITarget | null {
        return new LuaJitConfigureSourcesTarget((<LuaJitProject>this.getProject()), this);
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const projectVersion = (<LuaJitProject>this.getProject()).getVersion();
            console.log(`[End] Apply patches on ${projectVersion.getName()} ${projectVersion.getRef()}`);
            resolve();
        });
    }
}
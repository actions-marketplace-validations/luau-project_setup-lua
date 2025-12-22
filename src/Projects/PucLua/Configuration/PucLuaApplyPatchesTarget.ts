import { ToolchainEnvironmentVariables } from "../../../Toolchains/ToolchainEnvironmentVariables";
import { AbstractApplyPatchesTarget } from "../../Targets/AbstractApplyPatchesTarget";
import { ITarget } from "../../Targets/ITarget";
import { PucLuaProject } from "../PucLuaProject";
import { PucLuaConfigureSourcesTarget } from "./PucLuaConfigureSourcesTarget";
import { PucLuaFetchTarget } from "./PucLuaFetchTarget";
import { Console } from "../../../Console";

export class PucLuaApplyPatchesTarget extends AbstractApplyPatchesTarget {
    constructor(project: PucLuaProject, parent: PucLuaFetchTarget) {
        super(project, parent, parent.getExtractedDir(), project.getRemotePatchesBuildDir(), ToolchainEnvironmentVariables.instance().getLuaPatches());
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[Start] Apply patches on Lua ${(<PucLuaProject>this.getProject()).getVersion().getString()}`);
            resolve();
        });
    }
    getNext(): ITarget | null {
        return new PucLuaConfigureSourcesTarget((<PucLuaProject>this.getProject()), this);
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[End] Apply patches on Lua ${(<PucLuaProject>this.getProject()).getVersion().getString()}`);
            resolve();
        });
    }
}
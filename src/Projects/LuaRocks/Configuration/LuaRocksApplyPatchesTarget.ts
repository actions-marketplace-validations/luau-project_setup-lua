import { ToolchainEnvironmentVariables } from "../../../Toolchains/ToolchainEnvironmentVariables";
import { AbstractApplyPatchesTarget } from "../../Targets/AbstractApplyPatchesTarget";
import { ITarget } from "../../Targets/ITarget";
import { LuaRocksProject } from "../LuaRocksProject";
import { LuaRocksConfigureSourcesTarget } from "./LuaRocksConfigureSourcesTarget";
import { LuaRocksFetchTarget } from "./LuaRocksFetchTarget";
import { LuaRocksSourcesInfo } from "./LuaRocksSourcesInfo";
import { Console } from "../../../Console";

export class LuaRocksApplyPatchesTarget extends AbstractApplyPatchesTarget {
    constructor(project: LuaRocksProject, parent: LuaRocksFetchTarget) {
        super(project, parent, parent.getLuaRocksSourcesInfo().getDir(), project.getRemotePatchesBuildDir(), ToolchainEnvironmentVariables.instance().getLuaRocksPatches());
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[Start] Apply patches on LuaRocks ${(<LuaRocksProject>this.getProject()).getVersion().getIdentifier()}`);
            resolve();
        });
    }
    getLuaRocksSourcesInfo(): LuaRocksSourcesInfo {
        return (<LuaRocksFetchTarget>this.getParent()).getLuaRocksSourcesInfo();
    }
    getNext(): ITarget | null {
        return new LuaRocksConfigureSourcesTarget((<LuaRocksProject>this.getProject()), this);
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Console.instance().writeLine(`[End] Apply patches on LuaRocks ${(<LuaRocksProject>this.getProject()).getVersion().getIdentifier()}`);
            resolve();
        });
    }
}
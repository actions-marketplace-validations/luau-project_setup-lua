import { join } from "node:path";
import { extractTarGz } from "../../../Util/ExtractTarGz";
import { IProject } from "../../IProject";
import { AbstractFetchCompressedTarget } from "../../Targets/Fetch/AbstractFetchCompressedTarget";
import { ITarget } from "../../Targets/ITarget";
import { LuaRocksProject } from "../LuaRocksProject";
import { LuaRocksFetchTarget } from "./LuaRocksFetchTarget";
import { checkFiles } from "../../../Util/CheckFiles";
import { isGccLikeToolchain } from "../../../Toolchains/GCC/IGccLikeToolchain";
import { LuaRocksCheckDependenciesTarget } from "./LuaRocksCheckDependenciesTarget";

const PE_PARSER_VERSION = "0.6";
const PE_PARSER_SHA256 = "19bacfff729e767cbf7459de857da82254aa8cacababcf5a2fd1c66a6207b96a";

export class LuaRocksFetchPeParserTarget extends AbstractFetchCompressedTarget {
    private parent: LuaRocksCheckDependenciesTarget;
    private project: LuaRocksProject;
    private rawPeParser?: string;
    constructor(project: LuaRocksProject, parent: LuaRocksCheckDependenciesTarget) {
        super(
            `https://github.com/Tieske/pe-parser/archive/refs/tags/version_${PE_PARSER_VERSION}.tar.gz`,
            project.getBuildDir(),
            `version_${PE_PARSER_VERSION}`,
            extractTarGz,
            {
                fileHash: {
                    algorithm: "sha256",
                    expectedHash: PE_PARSER_SHA256
                }
            }
        );
        this.project = project;
        this.parent = parent;
        this.rawPeParser = undefined;
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[Start] Fetch pe-parser ${PE_PARSER_VERSION}`);
            resolve();
        });
    }
    getProject(): IProject {
        return this.project;
    }
    getParent(): ITarget | null {
        return this.parent;
    }
    getPeParser(): string | undefined {
        return this.rawPeParser;
    }
    getNext(): ITarget | null {
        return new LuaRocksFetchTarget(this.project, this);
    }
    override execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (isGccLikeToolchain(this.project.getToolchain())) {
                super.execute()
                    .then(() => {
                        const workDir = this.getWorkDir();
                        const peParser = join(workDir, `pe-parser-version_${PE_PARSER_VERSION}`, "src", "pe-parser.lua");
                        checkFiles([peParser])
                            .then(() => {
                                this.rawPeParser = peParser;
                                resolve();
                            })
                            .catch(reject);
                    })
                    .catch(reject);
            }
            else {
                console.log("pe-parser is not needed on MSVC");
                resolve();
            }
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[End] Fetch pe-parser ${PE_PARSER_VERSION}`);
            resolve();
        });
    }
}
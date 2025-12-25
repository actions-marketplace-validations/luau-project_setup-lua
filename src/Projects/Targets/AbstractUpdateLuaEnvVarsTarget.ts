import { delimiter } from "node:path";
import { appendToGitHubEnvironmentVariables, appendToGitHubPath } from "../../Util/GitHub";
import { IProject } from "../IProject";
import { ITarget } from "./ITarget";
import { PromiseCallback, sequentialPromises } from "../../Util/SequentialPromises";

export abstract class AbstractUpdateLuaEnvVarsTarget implements ITarget {
    private parent: ITarget | null;
    private project: IProject;
    constructor(project: IProject, parent: ITarget | null) {
        this.project = project;
        this.parent = parent;
    }
    abstract init(): Promise<void>;
    abstract getNext(): ITarget | null;
    abstract finalize(): Promise<void>;
    abstract getProjectInstallDir(): string;
    abstract getProjectInstallLibDir(): string;
    abstract getProjectInstallBinDir(): string;
    abstract getProjectInstallPkgConfigDir(): string;
    private setConfigPathToGitHub(envVar: string, targetDir: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const currentEnvVar = (process.env[envVar] || "").trim();
            const newEnvVar = currentEnvVar ?
                `${currentEnvVar}${delimiter}${targetDir}` : 
                `${targetDir}`;
            appendToGitHubEnvironmentVariables(envVar, newEnvVar)
                .then(resolve)
                .catch(reject);
        });
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const changes: PromiseCallback<void>[] = [
                () => this.setConfigPathToGitHub("PKG_CONFIG_PATH", this.getProjectInstallPkgConfigDir()),
                () => this.setConfigPathToGitHub("CMAKE_PREFIX_PATH", this.getProjectInstallDir())
            ];

            if (process.platform === "darwin") {
                changes.push(() => this.setConfigPathToGitHub("DYLD_LIBRARY_PATH", this.getProjectInstallLibDir()));
            }
            else if (process.platform !== "win32") {
                changes.push(() => this.setConfigPathToGitHub("LD_LIBRARY_PATH", this.getProjectInstallLibDir()));
            }

            changes.push(() => appendToGitHubPath(this.getProjectInstallBinDir()));

            sequentialPromises(changes)
                .then(_ => {
                    resolve();
                })
                .catch(reject);
        });
    }
    getProject(): IProject {
        return this.project;
    }
    getParent(): ITarget | null {
        return this.parent;
    }
}
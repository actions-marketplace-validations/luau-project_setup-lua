import { delimiter } from "node:path";
import { appendToGitHubEnvironmentVariables, appendToGitHubPath } from "../../Util/GitHub";
import { IProject } from "../IProject";
import { ITarget } from "./ITarget";
import { sequentialPromises } from "../../Util/SequentialPromises";

export abstract class AbstractPkgConfigCMakeEnvVarsTarget implements ITarget {
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
    abstract getProjectInstallBinDir(): string;
    abstract activateCoreExecution(): boolean;
    private setConfigPathToGitHub(envVar: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const pkgConfigPath = (process.env[envVar] || "").trim();
            if (pkgConfigPath) {
                const newPath = `${pkgConfigPath}${delimiter}${this.getProjectInstallDir()}`;
                appendToGitHubEnvironmentVariables(envVar, newPath)
                    .then(resolve)
                    .catch(reject);
            }
            else {
                resolve();
            }
        });
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.activateCoreExecution()) {
                sequentialPromises([
                    () => this.setConfigPathToGitHub("PKG_CONFIG_PATH"),
                    () => this.setConfigPathToGitHub("CMAKE_PREFIX_PATH"),
                    () => appendToGitHubPath(this.getProjectInstallBinDir())
                ])
                    .then(_ => {
                        resolve();
                    })
                    .catch(reject);
            }
            else {
                resolve();
            }
        });
    }
    getProject(): IProject {
        return this.project;
    }
    getParent(): ITarget | null {
        return this.parent;
    }
}
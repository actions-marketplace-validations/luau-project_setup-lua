import { appendFile, stat } from "node:fs/promises";
import { EOL } from "node:os";
import { delimiter } from "node:path";
import { IGitHubCore } from "./Util/IGitHubCore";

function appendContentToGitHubFile(fileKey: string, content: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const githubSpecialFile = process.env[fileKey];
        if (githubSpecialFile) {
            stat(githubSpecialFile)
                .then(fileStat => {
                    if (fileStat.isFile()) {
                        const newline = EOL;
                        appendFile(githubSpecialFile, `${newline}${content}`, { flush: true })
                            .then(resolve)
                            .catch(reject);
                    }
                    else {
                        reject(new Error(`\`${githubSpecialFile}' is not a file`));
                    }
                })
                .catch(reject);
        }
        else {
            resolve();
        }
    });
}

function appendKeyValueToGitHubFile(fileKey: string, key: string, value: string): Promise<void> {
    return appendContentToGitHubFile(fileKey, `${key.toUpperCase().replace(/\-/g, "_").replace(/\r\n|\r|\n/g, "")}=${value.replace(/\r\n|\r|\n/g, "")}`);
}

export class CliGitHubCore implements IGitHubCore {
    private static _instance: IGitHubCore;
    static instance(): IGitHubCore {
        if (!CliGitHubCore._instance) {
            CliGitHubCore._instance = new CliGitHubCore();
        }
        return CliGitHubCore._instance;
    }
    getInput(variable: string): string | undefined {
        return process.env[`INPUT_${variable.replace(/ /g,"_").toUpperCase()}`];
    }
    appendToGitHubEnvironmentVariables(key: string, value: string): Promise<void> {
        return key.toUpperCase() === "PATH" ? this.appendToGitHubPath(value) : appendKeyValueToGitHubFile("GITHUB_ENV", key, value);
    }
    appendToGitHubPath(value: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const githubPath = process.env["GITHUB_PATH"];
            if (githubPath) {
                stat(githubPath)
                    .then(fileStat => {
                        if (fileStat.isFile()) {
                            const safeValue = value.replace(/\r\n|\r|\n/g, "");
                            const parts: string[] = safeValue.split(delimiter).filter(v => v !== "");
                            const newline = EOL;
                            const content = parts.reverse().join(newline);
                            appendFile(githubPath, `${newline}${content}`)
                                .then(resolve)
                                .catch(reject);
                        }
                        else {
                            reject(new Error(`\`${githubPath}' is not a file`));
                        }
                    })
                    .catch(reject);
            }
            else {
                resolve();
            }
        });
    }
    private constructor() {

    }
}
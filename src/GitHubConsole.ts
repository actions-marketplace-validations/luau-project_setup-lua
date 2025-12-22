import { info } from '@actions/core';
import { IConsole } from "./Util/IConsole";

export class GitHubConsole implements IConsole {
    private static _instance: IConsole;
    static instance(): IConsole {
        if (!GitHubConsole._instance) {
            GitHubConsole._instance = new GitHubConsole();
        }
        return GitHubConsole._instance;
    }
    write(message: string): void {
        info(message);
    }
    writeLine(message: string): void {
        info(message);
    }
    private constructor() {

    }
}
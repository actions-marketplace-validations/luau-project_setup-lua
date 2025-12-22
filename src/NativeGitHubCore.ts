import { getInput, addPath, exportVariable } from '@actions/core';
import { IGitHubCore } from './Util/IGitHubCore';

export class NativeGitHubCore implements IGitHubCore {
    private static _instance: IGitHubCore;
    static instance(): IGitHubCore {
        if (!NativeGitHubCore._instance) {
            NativeGitHubCore._instance = new NativeGitHubCore();
        }
        return NativeGitHubCore._instance;
    }
    getInput(variable: string): string | undefined {
        return getInput(variable);
    }
    appendToGitHubPath(value: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let err: any = undefined;
            try { 
                addPath(value);
            }
            catch (e) {
                err = e;
            }
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    }
    appendToGitHubEnvironmentVariables(key: string, value: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let err: any = undefined;
            try { 
                exportVariable(key, value);
            }
            catch (e) {
                err = e;
            }
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    }
    private constructor() {

    }
}
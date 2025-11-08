export interface IGitHubCore {
    getInput(variable: string): string | undefined;
    appendToGitHubPath(value: string): Promise<void>;
    appendToGitHubEnvironmentVariables(key: string, value: string): Promise<void>;
}
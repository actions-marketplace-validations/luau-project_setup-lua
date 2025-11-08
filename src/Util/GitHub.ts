import { GitHubCore } from "../GitHubCore";

export function appendToGitHubEnvironmentVariables(key: string, value: string): Promise<void> {
    return GitHubCore.instance().appendToGitHubEnvironmentVariables(key, value);
}

export function appendToGitHubPath(value: string): Promise<void> {
    return GitHubCore.instance().appendToGitHubPath(value);
}
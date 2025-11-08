const { writeFile } = require("node:fs/promises");
const { EOL } = require("node:os");
const { join } = require("node:path");

function writeMissingFile(file, program, resolve, reject) {
    writeFile(file, program.join(EOL), { encoding: "utf-8" })
        .then(() =>{
            resolve(file);
        })
        .catch(reject);
}

function generateCacheService(config) {
    return new Promise((resolve, reject) => {
        const file = join(__dirname, "src", "CacheService.ts");
        if (config === "GITHUB") {
            const program = [
                "import { GitHubCacheService } from \"./GitHubCacheService\";",
                "",
                "export const CacheService = GitHubCacheService;"
            ];
            writeMissingFile(file, program, resolve, reject);
        }
        else if (config === "CLI") {
            const program = [
                "import { CliCacheService } from \"./CliCacheService\";",
                "",
                "export const CacheService = CliCacheService;"
            ];
            writeMissingFile(file, program, resolve, reject);
        }
        else {
            reject(new Error(`Unknown generation config: \`${config}'`));
        }
    });
}

function generateGitHubCore(config) {
    return new Promise((resolve, reject) => {
        const file = join(__dirname, "src", "GitHubCore.ts");
        if (config === "GITHUB") {
            const program = [
                "import { NativeGitHubCore } from \"./NativeGitHubCore\";",
                "",
                "export const GitHubCore = NativeGitHubCore;"
            ];
            writeMissingFile(file, program, resolve, reject);
        }
        else if (config === "CLI") {
            const program = [
                "import { CliGitHubCore } from \"./CliGitHubCore\";",
                "",
                "export const GitHubCore = CliGitHubCore;"
            ];
            writeMissingFile(file, program, resolve, reject);
        }
        else {
            reject(new Error(`Unknown generation config: \`${config}'`));
        }
    });
}

function main() {
    const config = (process.argv[2] || "").trim().toUpperCase();
    generateGitHubCore(config)
        .then(gitHubCore => {
            console.log(`> \`${gitHubCore}' was generated.`);
            generateCacheService(config)
                .then(cacheService => {
                    console.log(`> \`${cacheService}' was generated.`);
                    
                })
                .catch(err => {
                    console.log("Failed to generate the CacheService");
                    console.log(err);
                    process.exitCode = 1;
                });
        })
        .catch(err => {
            console.log("Failed to generate the GitHubCore");
            console.log(err);
            process.exitCode = 1;
        });
}

main();
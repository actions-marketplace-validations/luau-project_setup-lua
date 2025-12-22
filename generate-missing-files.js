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

function generateClass(config, baseClassName, githubPrefix, cliPrefix) {
    return new Promise((resolve, reject) => {
        const file = join(__dirname, "src", `${baseClassName}.ts`);
        if (config === "GITHUB") {
            const program = [
                `import { ${githubPrefix}${baseClassName} } from \"./${githubPrefix}${baseClassName}\";`,
                "",
                `export const ${baseClassName} = ${githubPrefix}${baseClassName};`
            ];
            writeMissingFile(file, program, resolve, reject);
        }
        else if (config === "CLI") {
            const program = [
                `import { ${cliPrefix}${baseClassName} } from \"./${cliPrefix}${baseClassName}\";`,
                "",
                `export const ${baseClassName} = ${cliPrefix}${baseClassName};`
            ];
            writeMissingFile(file, program, resolve, reject);
        }
        else {
            reject(new Error(`Unknown generation config: \`${config}'`));
        }
    });
}

function generateCacheService(config) {
    return generateClass(config, "CacheService", "GitHub", "Cli");
}

function generateGitHubCore(config) {
    return generateClass(config, "GitHubCore", "Native", "Cli");
}

function generateConsole(config) {
    return generateClass(config, "Console", "GitHub", "Cli");
}

function main() {
    const config = (process.argv[2] || "").trim().toUpperCase();
    generateGitHubCore(config)
        .then(gitHubCore => {
            console.log(`> \`${gitHubCore}' was generated.`);
            generateCacheService(config)
                .then(cacheService => {
                    console.log(`> \`${cacheService}' was generated.`);
                    generateConsole(config)
                        .then(_console => {
                            console.log(`> \`${_console}' was generated.`);
                        })
                        .catch(err => {
                            console.log("Failed to generate the Console");
                            console.log(err);
                            process.exitCode = 1;
                        });
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
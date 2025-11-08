import { join } from "node:path";
import { windowsRegQuery } from "./WindowsRegQuery";
import { checkFiles } from "./CheckFiles";

function find7zInstallDir(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        windowsRegQuery("HKEY_LOCAL_MACHINE\\SOFTWARE\\7-Zip")
            .then(lines => {
                if (lines.length > 0) {
                    let i = 0;
                    let sevenZipPath: string | undefined = undefined;
                    while (!sevenZipPath && i < lines.length) {
                        const match = /\s*Path\s+REG_SZ\s+(.*)(\r\n|\r|\n)?/i.exec(lines[i]);
                        if (match) {
                            const path = match[1].trim();
                            sevenZipPath = path;
                        }
                        i++;
                    }
                    if (sevenZipPath) {
                        resolve(sevenZipPath);
                    }
                    else {
                        reject(new Error("Unable to find 7-Zip installation path"));
                    }
                }
                else {
                    reject(new Error("7-Zip installation directory was not set"));
                }
            })
            .catch(err => {
                reject(new Error("Unable to query 7-Zip installation path"));
            });
    });
}

export function find7z(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        find7zInstallDir()
            .then(sevenZipInstallDir => {
                const sevenZip = join(sevenZipInstallDir, "7z.exe");
                checkFiles([sevenZip])
                    .then(() => {
                        resolve(sevenZip);
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
}
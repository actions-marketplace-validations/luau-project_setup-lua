import { windowsRegQuery } from "./WindowsRegQuery";

export function findGitForWindowsInstallDir(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        windowsRegQuery("HKEY_LOCAL_MACHINE\\SOFTWARE\\GitForWindows")
            .then(lines => {
                if (lines.length > 0) {
                    let i = 0;
                    let gitInstallDir: string | undefined = undefined;
                    while (!gitInstallDir && i < lines.length) {
                        const match = /\s*InstallPath\s+REG_SZ\s+(.*)(\r\n|\r|\n)?/i.exec(lines[i]);
                        if (match) {
                            const path = match[1].trim();
                            gitInstallDir = path;
                        }
                        i++;
                    }
                    if (gitInstallDir) {
                        resolve(gitInstallDir);
                    }
                    else {
                        reject(new Error("Unable to find Git For Windows installation patch"));
                    }
                }
                else {
                    reject(new Error("Git For Windows installation directory was not set"));
                }
            })
            .catch(err => {
                reject(new Error("Unable to query Git For Windows installation path"));
            });
    });
}
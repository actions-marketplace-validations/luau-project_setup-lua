import { Readable } from "node:stream";
import { createWriteStream } from "node:fs";
import { setTimeout } from "node:timers/promises";

const DEFAULT_MAX_TRIES = 5;
const DOWNLOAD_MIN_BASE = 1.7;
const DOWNLOAD_MAX_BASE = 2.3;

function randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

function getWaitingTimeInMilliseconds(retries: number): number {
    let waitingTimeInMilliseconds: number = 0;
    if (retries > 0) {
        const B = randomBetween(DOWNLOAD_MIN_BASE, DOWNLOAD_MAX_BASE);
        const waitingTimeInSeconds = Math.pow(B, retries);
        waitingTimeInMilliseconds = Math.floor(waitingTimeInSeconds * 1000);
    }
    return waitingTimeInMilliseconds;
}

export function downloadFile(url: string | URL, outFile: string, maxTries?: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const tries = (maxTries && maxTries > 0 ? maxTries : DEFAULT_MAX_TRIES) + 1;
        let succeed = false;
        let execErr: any;
        const iter = (i: number) => {
            if (!succeed && i < tries) {
                setTimeout(getWaitingTimeInMilliseconds(i))
                    .then(() => {
                        fetch(url).then(response => {
                            if (!response.ok) {
                                execErr = new Error("Response is not ok");
                                iter(i + 1);
                            }
                            else {
                                const body = response.body;
                                if (body === null) {
                                    execErr = new Error("Response body is null");
                                    iter(i + 1);
                                }
                                else {
                                    Readable.fromWeb(<any>body)
                                        .pipe(createWriteStream(outFile))
                                        .on("error", err => {
                                            execErr = err;
                                            iter(i + 1);
                                        })
                                        .on("finish", () => {
                                            succeed = true;
                                            iter(i + 1);
                                        });
                                }
                            }
                        })
                        .catch(err => {
                            execErr = err;
                            iter(i + 1);
                        });
                    })
                    .catch(timeoutErr => {
                        execErr = timeoutErr;
                        iter(i + 1);
                    });
            }
            else if (succeed) {
                resolve(outFile);
            }
            else if (execErr) {
                reject(execErr);
            }
            else {
                reject(new Error("Download failed"));
            }
        };
        iter(0);
    });
}

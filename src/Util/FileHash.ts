import { createHash } from "node:crypto";
import { createReadStream, PathLike } from "node:fs";
import { Writable } from "node:stream";

export function getFileHash(file: PathLike, algorithm: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const hashOutput: string[] = [];
        const hashOutputStream = new Writable({
            write(chunk, encoding, callback) {
                hashOutput.push(chunk.toString());
                callback();
            }
        });

        createReadStream(file)
            .pipe(createHash(algorithm))
            .setEncoding("hex")
            .pipe(hashOutputStream)
            .on("close", () => {
                resolve(hashOutput.join(""));
            })
            .on("error", reject);
    });
}

export function verifyFileHash(file: PathLike, algorithm: string, expectedHash: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        getFileHash(file, algorithm)
            .then(value => {
                resolve(expectedHash.toLowerCase() == value)
            })
            .catch(reject);
    });
}
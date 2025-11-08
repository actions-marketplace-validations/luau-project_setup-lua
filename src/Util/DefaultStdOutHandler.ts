export function defaultStdOutHandler(chunk: any): void {
    process.stdout.write(chunk.toString());
}
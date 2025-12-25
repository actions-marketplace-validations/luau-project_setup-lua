import { Console } from "../Console";

export function defaultStdOutHandler(chunk: any): void {
    Console.instance().write(chunk.toString());
}
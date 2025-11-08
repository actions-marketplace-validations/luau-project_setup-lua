import { ITool } from "./ITool";

export interface IStrip extends ITool {
    addFlag(value: string): void;
    addStripAll(): void;
    addStripUnneeded(): void;
    setInputFile(path: string): void;
}
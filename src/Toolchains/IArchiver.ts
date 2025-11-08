import { ITool } from "./ITool";

export interface IArchiver extends ITool {
    addFlag(value: string): void;
    addInputFile(path: string): void;
    setOutputFile(path: string): void;
    getArchiveExtension(): string;
}
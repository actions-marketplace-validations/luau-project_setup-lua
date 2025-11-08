import { ITool } from "./ITool";

export interface IRandomizer extends ITool {
    addFlag(value: string): void;
    setInputFile(path: string): void;
}
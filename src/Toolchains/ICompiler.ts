import { ITool } from "./ITool";

export interface ICompiler extends ITool {
    addFlag(value: string): void;
    addDefine(key: string, value?: string): void;
    addIncludeDir(dir: string): void;
    setInputFile(path: string): void;
    setOutputFile(path: string): void;
    setSpeedOptimizationSwitch(): void;
    setWarningSwitch(): void;
    getObjectFileExtension(): string;
}
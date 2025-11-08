import { ITool } from "./ITool";

export interface ILinker extends ITool {
    addFlag(value: string): void;
    addLibDir(dir: string): void;
    addObjectFile(path: string): void;
    addLibrary(path: string): void;
    addLinkLibrary(name: string): void;
    setOutputFile(path: string): void;
    setOutputMode(mode: string): void;
}
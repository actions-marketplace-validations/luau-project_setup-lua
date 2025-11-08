import { IArchiver } from "./IArchiver";
import { ICompiler } from "./ICompiler";
import { ILinker } from "./ILinker";

export interface IToolchain {
    getCompiler(): ICompiler;
    getLinker(): ILinker;
    getArchiver(): IArchiver;
}
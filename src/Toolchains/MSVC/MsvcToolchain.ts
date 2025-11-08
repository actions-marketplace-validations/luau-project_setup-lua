import { IArchiver } from "../IArchiver";
import { ICompiler } from "../ICompiler";
import { ILinker } from "../ILinker";
import { IToolchain } from "../IToolchain";
import { MsvcArchiver } from "./MsvcArchiver";
import { MsvcCompiler } from "./MsvcCompiler";
import { MsvcLinker } from "./MsvcLinker";

export class MsvcToolchain implements IToolchain {
    private compiler: MsvcCompiler;
    private linker: MsvcLinker;
    private archiver: MsvcArchiver;

    constructor() {
        this.compiler = new MsvcCompiler();
        this.linker = new MsvcLinker();
        this.archiver = new MsvcArchiver();
    }
    getCompiler(): ICompiler {
        return this.compiler;
    }
    getLinker(): ILinker {
        return this.linker;
    }
    getArchiver(): IArchiver {
        return this.archiver;
    }
}
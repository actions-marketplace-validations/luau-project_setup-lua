import { IArchiver } from "../IArchiver";
import { ICompiler } from "../ICompiler";
import { ILinker } from "../ILinker";
import { IRandomizer } from "../IRandomizer";
import { IStrip } from "../IStrip";
import { GccArchiver } from "./GccArchiver";
import { GccCompiler } from "./GccCompiler";
import { GccLinker } from "./GccLinker";
import { GccRanlib } from "./GccRanlib";
import { GccStrip } from "./GccStrip";
import { IGccLikeToolchain } from "./IGccLikeToolchain";

export class GccToolchain implements IGccLikeToolchain {
    private compiler: GccCompiler;
    private linker: GccLinker;
    private archiver: GccArchiver;
    private ranlib: GccRanlib;
    private strip: GccStrip;

    constructor() {
        this.compiler = new GccCompiler();
        this.linker = new GccLinker();
        this.archiver = new GccArchiver();
        this.ranlib = new GccRanlib();
        this.strip = new GccStrip();
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
    getRanlib(): IRandomizer {
        return this.ranlib;
    }
    getStrip(): IStrip {
        return this.strip;
    }
}
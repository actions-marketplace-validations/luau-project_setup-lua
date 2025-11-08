import { ILinker } from "../ILinker";
import { executeProcess } from "../../Util/ExecuteProcess";
import { GetSetProperty } from "../../Util/GetSetProperty";
import { IGetSetProperty } from "../../Util/IGetSetProperty";
import { IToolchainCompositeArgument } from "../IToolchainCompositeArgument";
import { ToolchainCompositeArgument } from "../ToolchainCompositeArgument";
import { ToolchainRawArgument } from "../ToolchainRawArgument";
import { IWin32ImportLibraryDecorator } from "../IWin32ImportLibraryDecorator";
import { ToolchainEnvironmentVariables } from "../ToolchainEnvironmentVariables";

export class GccLinker implements ILinker, IWin32ImportLibraryDecorator {
    private _path: IGetSetProperty<string>;
    private flags: IToolchainCompositeArgument[];
    private libDirs: IToolchainCompositeArgument[];
    private objectFiles: IToolchainCompositeArgument[];
    private libraries: IToolchainCompositeArgument[];
    private linkLibraries: IToolchainCompositeArgument[];
    private outImplib?: IToolchainCompositeArgument;
    private output?: IToolchainCompositeArgument;
    private outputMode?: string;

    addFlag(value: string): void {
        this.flags.push(
            new ToolchainCompositeArgument(
                [new ToolchainRawArgument(value)]
            )
        );
    }
    addObjectFile(path: string): void {
        this.objectFiles.push(
            new ToolchainCompositeArgument(
                [new ToolchainRawArgument(path)]
            )
        );
    }
    addLibDir(dir: string): void {
        this.libDirs.push(
            new ToolchainCompositeArgument(
                [new ToolchainRawArgument(`-L${dir}`)]
            )
        );
    }
    addLibrary(path: string): void {
        this.libraries.push(
            new ToolchainCompositeArgument(
                [new ToolchainRawArgument(path)]
            )
        );
    }
    addLinkLibrary(name: string): void {
        this.linkLibraries.push(
            new ToolchainCompositeArgument(
                [new ToolchainRawArgument(`-l${name}`)]
            )
        );
    }
    setImportLibrary(path: string): void {
        this.outImplib = new ToolchainCompositeArgument(
            [new ToolchainRawArgument(`-Wl,--out-implib,${path}`)]
        );
    }
    getImportLibraryExtension(): string {
        return (process.platform === 'win32' || process.platform === 'cygwin' ? ".dll.a" : ".a");
    }
    setOutputFile(path: string): void {
        this.output = new ToolchainCompositeArgument(
            [
                new ToolchainRawArgument("-o"),
                new ToolchainRawArgument(path)
            ]
        );
    }
    setOutputMode(mode: string): void {
        this.outputMode = mode;
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.output) {
                const args: string[] = [];
                const arrays: IToolchainCompositeArgument[][] = [];
                if (this.outputMode && this.outputMode === "shared") {
                    arrays.push(
                        [new ToolchainCompositeArgument([new ToolchainRawArgument("-shared")])]
                    );
                }
                if (this.outImplib) {
                    arrays.push([this.outImplib]);
                }
                for (const instruction of [this.flags, this.libDirs, [this.output], this.objectFiles, this.libraries, this.linkLibraries]) {
                    arrays.push(instruction);
                }
                for (const arrayElement of arrays) {
                    for (const compositeArgument of arrayElement) {
                        const count = compositeArgument.getLenght();
                        for (let i = 0; i < count; i++) {
                            args.push(compositeArgument.getItem(i).getString());
                        }
                    }
                }
                executeProcess(this._path.getValue(), { args: args, verbose: true })
                    .then(code => {
                        if (code === 0) {
                            resolve();
                        }
                        else {
                            reject(new Error("Linker failed"));
                        }
                    })
                    .catch(reject);
            }
            else {
                reject(new Error("Linker output file was not set"));
            }
        });
    }
    reset(): void {
        this.flags.splice(0, this.flags.length);
        this.objectFiles.splice(0, this.objectFiles.length);
        this.libDirs.splice(0, this.libDirs.length);
        this.libraries.splice(0, this.libraries.length);
        this.linkLibraries.splice(0, this.linkLibraries.length);
        this.outImplib = undefined;
        this.output = undefined;
        this.outputMode = undefined;
        this._path.setValue(ToolchainEnvironmentVariables.instance().getLD());
    }

    constructor() {
        this.flags = [];
        this.objectFiles = [];
        this.libDirs = [];
        this.libraries = [];
        this.linkLibraries = [];
        this.outImplib = undefined;
        this.output = undefined;
        this.outputMode = undefined;
        this._path = new GetSetProperty<string>(ToolchainEnvironmentVariables.instance().getLD());
        this.reset();
    }
    path(): IGetSetProperty<string> {
        return this._path;
    }
}
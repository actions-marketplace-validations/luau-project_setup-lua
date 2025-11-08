import { ToolchainEnvironmentVariables } from "../ToolchainEnvironmentVariables";
import { executeProcess } from "../../Util/ExecuteProcess";
import { GetSetProperty } from "../../Util/GetSetProperty";
import { IGetSetProperty } from "../../Util/IGetSetProperty";
import { IArchiver } from "../IArchiver";
import { IToolchainCompositeArgument } from "../IToolchainCompositeArgument";
import { ToolchainCompositeArgument } from "../ToolchainCompositeArgument";
import { ToolchainRawArgument } from "../ToolchainRawArgument";

export class MsvcArchiver implements IArchiver {
    private _path: IGetSetProperty<string>;
    private flags: IToolchainCompositeArgument[];
    private inputs: IToolchainCompositeArgument[];
    private output?: IToolchainCompositeArgument;

    addFlag(value: string): void {
        this.flags.push(
            new ToolchainCompositeArgument(
                [new ToolchainRawArgument(value)]
            )
        );
    }

    addInputFile(path: string): void {
        this.inputs.push(
            new ToolchainCompositeArgument(
                [new ToolchainRawArgument(path)]
            )
        );
    }

    setOutputFile(path: string): void {
        this.output = new ToolchainCompositeArgument(
            [new ToolchainRawArgument(`/OUT:${path}`)]
        );
    }

    getArchiveExtension(): string {
        return ".lib";
    }

    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.output) {
                const args: string[] = [];
                const arrays: IToolchainCompositeArgument[][] = [this.flags, [this.output], this.inputs];
                for (const arrayElement of arrays) {
                    for (const commandLineArgument of arrayElement) {
                        const count = commandLineArgument.getLenght();
                        for (let i = 0; i < count; i++) {
                            args.push(commandLineArgument.getItem(i).getString());
                        }
                    }
                }
                executeProcess(this._path.getValue(), { args: args, verbose: true })
                    .then(code => {
                        if (code === 0) {
                            resolve();
                        }
                        else {
                            reject(new Error("Archiver failed"));
                        }
                    })
                    .catch(reject);
            }
            else {
                reject(new Error("Archiver output file was not set"));
            }
        });
    }

    reset(): void {
        this.flags.splice(0, this.flags.length);
        this.inputs.splice(0, this.inputs.length);
        this.output = undefined;
        this._path.setValue(ToolchainEnvironmentVariables.instance().getAR());
    }

    constructor() {
        this.flags = [];
        this.inputs = [];
        this.output = undefined;
        this._path = new GetSetProperty<string>(ToolchainEnvironmentVariables.instance().getAR());
        this.reset();
    }

    path(): IGetSetProperty<string> {
        return this._path;
    }
}
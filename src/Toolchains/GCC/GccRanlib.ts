import { ToolchainEnvironmentVariables } from "../ToolchainEnvironmentVariables";
import { executeProcess } from "../../Util/ExecuteProcess";
import { GetSetProperty } from "../../Util/GetSetProperty";
import { IGetSetProperty } from "../../Util/IGetSetProperty";
import { IRandomizer } from "../IRandomizer";
import { IToolchainCompositeArgument } from "../IToolchainCompositeArgument";
import { ToolchainCompositeArgument } from "../ToolchainCompositeArgument";
import { ToolchainRawArgument } from "../ToolchainRawArgument";

export class GccRanlib implements IRandomizer {
    private _path: IGetSetProperty<string>;
    private flags: IToolchainCompositeArgument[];
    private input?: IToolchainCompositeArgument;

    addFlag(value: string): void {
        this.flags.push(
            new ToolchainCompositeArgument(
                [new ToolchainRawArgument(value)]
            )
        );
    }
    setInputFile(path: string): void {
        this.input = new ToolchainCompositeArgument(
            [new ToolchainRawArgument(path)]
        );
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.input) {
                const args: string[] = [];
                const arrays: IToolchainCompositeArgument[][] = [this.flags, [this.input]];
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
                            reject(new Error("Ranlib failed"));
                        }
                    })
                    .catch(reject);
            }
            else {
                reject(new Error("Ranlib input file was not set"));
            }
        });
    }
    reset(): void {
        this.flags.splice(0, this.flags.length);
        this.input = undefined;
        this._path.setValue(ToolchainEnvironmentVariables.instance().getRANLIB());
    }

    constructor() {
        this.flags = [];
        this.input = undefined;
        this._path = new GetSetProperty<string>(ToolchainEnvironmentVariables.instance().getRANLIB());
        this.reset();
    }
    path(): IGetSetProperty<string> {
        return this._path;
    }
}
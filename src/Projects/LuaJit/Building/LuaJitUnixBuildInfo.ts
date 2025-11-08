import { IReadOnlyArray } from "../../../Util/IReadOnlyArray";
import { ReadOnlyArray } from "../../../Util/ReadOnlyArray";

export class LuaJitUnixBuildInfo {
    private make: string;
    private makeArguments: IReadOnlyArray<string>;

    constructor(make: string, makeArguments: string[]) {
        this.make = make;
        this.makeArguments = new ReadOnlyArray<string>(makeArguments);
    }

    getMake(): string {
        return this.make;
    }
    getMakeArguments(): IReadOnlyArray<string> {
        return this.makeArguments;
    }
}
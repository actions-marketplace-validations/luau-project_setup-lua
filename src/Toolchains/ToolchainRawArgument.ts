import { IToolchainArgument } from "./IToolchainArgument";

export class ToolchainRawArgument implements IToolchainArgument {
    private value: string;
    getString(): string {
        return this.value;
    }
    constructor(value: string) {
        this.value = value;
    }
}
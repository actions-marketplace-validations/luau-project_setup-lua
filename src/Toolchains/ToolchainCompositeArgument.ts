import { ReadOnlyArray } from "../Util/ReadOnlyArray";
import { IToolchainArgument } from "./IToolchainArgument";
import { IToolchainCompositeArgument } from "./IToolchainCompositeArgument";

export class ToolchainCompositeArgument extends ReadOnlyArray<IToolchainArgument> implements IToolchainCompositeArgument {
}
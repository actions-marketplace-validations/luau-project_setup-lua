import { IReadOnlyArray } from "../Util/IReadOnlyArray";
import { IToolchainArgument } from "./IToolchainArgument";

export interface IToolchainCompositeArgument extends IReadOnlyArray<IToolchainArgument> {
}
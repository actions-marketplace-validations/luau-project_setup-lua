import { ITarget } from "./ITarget";

export interface ITargetPipeline {
    init(): Promise<ITarget>;
    execute(): Promise<void>;
    finalize(): Promise<void>;
}
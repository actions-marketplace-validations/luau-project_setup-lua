import { IProject } from "../IProject";

export interface ITarget {
    init(): Promise<void>;
    getProject(): IProject;
    getParent(): ITarget | null;
    getNext(): ITarget | null;
    execute(): Promise<void>;
    finalize(): Promise<void>;
}
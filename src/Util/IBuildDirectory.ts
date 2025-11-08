export interface IBuildDirectory {
    init(): Promise<string>;
    finalize(): Promise<void>;
}
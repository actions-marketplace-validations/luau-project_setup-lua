export interface IReadOnlyArray<T> {
    getLenght(): number;
    getItem(i: number): T;
    createCopy(): T[];
    copyTo(array: T[]): void;
}
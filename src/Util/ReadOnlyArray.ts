import { IReadOnlyArray } from "./IReadOnlyArray";

export class ReadOnlyArray<T> implements IReadOnlyArray<T> {
    private ar: T[];

    constructor(array: T[]) {
        this.ar = array.slice();
    }

    getLenght(): number {
        return this.ar.length;
    }
    getItem(i: number): T {
        if (!(0 <= i && i <= this.ar.length)) {
            throw new Error(`index ${i} is out of range`);
        }

        return this.ar[i];
    }
    createCopy(): T[] {
        return this.ar.slice();
    }
    copyTo(array: T[]): void {
        if (array) {
            this.ar.forEach(value => array.push(value));
        }
        else {
            throw new Error("array expected as argument");
        }
    }
}
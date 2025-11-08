import { IGetProperty } from "./IGetProperty";

export class GetProperty<T> implements IGetProperty<T> {
    private value: T;

    getValue(): T {
        return this.value;
    }

    constructor(value: T) {
        this.value = value;
    }

}
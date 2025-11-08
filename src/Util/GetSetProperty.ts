import { IGetSetProperty } from "./IGetSetProperty";

export class GetSetProperty<T> implements IGetSetProperty<T> {
    private value: T;

    getValue(): T {
        return this.value;
    }

    setValue(value: T): void {
        this.value = value;
    }

    constructor(value: T) {
        this.value = value;
    }
}
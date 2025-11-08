import { IGetSetProperty } from "../Util/IGetSetProperty";

export interface ITool {
    path(): IGetSetProperty<string>;
    execute(): Promise<void>;
    reset(): void;
}
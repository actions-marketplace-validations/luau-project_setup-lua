import { IGetProperty } from "./IGetProperty";
import { ISetProperty } from "./ISetProperty";

export interface IGetSetProperty<T> extends IGetProperty<T>, ISetProperty<T> {

}
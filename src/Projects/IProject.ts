import { IGetSetProperty } from "../Util/IGetSetProperty";

export interface IProject {
    configure(): Promise<void>;
    build(): Promise<void>;
    install(): Promise<void>;

    configurationResult(): IGetSetProperty<any>;
    buildResult(): IGetSetProperty<any>;
}
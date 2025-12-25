import { IConsole } from "./Util/IConsole";

export class CliConsole implements IConsole {
    private static _instance: IConsole;
    static instance(): IConsole {
        if (!CliConsole._instance) {
            CliConsole._instance = new CliConsole();
        }
        return CliConsole._instance;
    }
    write(message: string): void {
        process.stdout.write(message);
    }
    writeLine(message: string): void {
        console.log(message);
    }
    private constructor() {

    }
}
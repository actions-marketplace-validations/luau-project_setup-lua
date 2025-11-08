import { ILinker } from "./ILinker";

export interface IWin32ImportLibraryDecorator {
    setImportLibrary(path: string): void;
    getImportLibraryExtension(): string;
}

export function hasWin32ImportLibraryDecorator(linker: ILinker): boolean {
    return ('setImportLibrary' in linker && 'getImportLibraryExtension' in linker);
}
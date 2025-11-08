import { IRandomizer } from "../IRandomizer";
import { IStrip } from "../IStrip";
import { IToolchain } from "../IToolchain";

export interface IGccLikeToolchain extends IToolchain {
    getRanlib(): IRandomizer;
    getStrip(): IStrip;
}

export function isGccLikeToolchain(toolchain: IToolchain): boolean {
    return ('getRanlib' in toolchain && 'getStrip' in toolchain);
}
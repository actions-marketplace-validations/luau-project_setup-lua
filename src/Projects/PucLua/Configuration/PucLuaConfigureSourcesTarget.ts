import { join } from "node:path";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline/promises";
import { readdir, stat } from "node:fs/promises";
import { IProject } from "../../IProject";
import { ITarget } from "../../Targets/ITarget";
import { PucLuaProject } from "../PucLuaProject";
import { PucLuaSourcesInfo } from "./PucLuaSourcesInfo";
import { LUA_52_VERSION } from "../PucLuaVersion";
import { PucLuaFinishConfigurationTarget } from "./PucLuaFinishConfigurationTarget";
import { PucLuaApplyPatchesTarget } from "./PucLuaApplyPatchesTarget";

export class PucLuaConfigureSourcesTarget implements ITarget {
    private parent: PucLuaApplyPatchesTarget;
    private project: PucLuaProject;
    private headersDir?: string;
    private rawHeaderFiles: string[];
    private rawManFiles: string[];
    private rawlibFiles: string[];
    private compatFlag?: string;
    private rawInterpreterFiles: string[];
    private rawCompilerFiles: string[];
    constructor(project: PucLuaProject, parent: PucLuaApplyPatchesTarget) {
        this.project = project;
        this.parent = parent;
        this.rawlibFiles = [];
        this.rawHeaderFiles = [];
        this.rawManFiles = [];
        this.compatFlag = undefined;
        this.rawInterpreterFiles = [];
        this.rawCompilerFiles = [];
    }
    init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[Start] Configure source code for the Lua ${this.project.getVersion().getString()} library`);
            resolve();
        });
    }
    getProject(): IProject {
        return this.project;
    }
    getParent(): ITarget | null {
        return this.parent;
    }
    getNext(): ITarget | null {
        return new PucLuaFinishConfigurationTarget(this.project, this);
    }
    private setConfigurationResult(): void {
        this.project.configurationResult().setValue(
            new PucLuaSourcesInfo(
                <string>this.headersDir,
                this.rawHeaderFiles,
                this.rawManFiles,
                this.rawlibFiles,
                this.rawInterpreterFiles,
                this.rawCompilerFiles,
                this.compatFlag
            )
        );
    }
    execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let hasluah = false;
            let hasluahpp = false;
            let hasluaconfh = false;
            let haslauxlibh = false;
            let haslualibh = false;
            const targetHeaders: any = {
                "lua.h"    : () => { hasluah = true; },
                "lua.hpp"  : () => { hasluahpp = true; },
                "luaconf.h": () => { hasluaconfh = true; },
                "lauxlib.h": () => { haslauxlibh = true; },
                "lualib.h" : () => { haslualibh = true; }
            };
            let hasManLua = false;
            let hasManLuac = false;
            const targetManFiles: any = {
                "lua.1"  : () => { hasManLua = true; },
                "luac.1" : () => { hasManLuac = true; }
            };
            this.rawHeaderFiles.splice(0, this.rawHeaderFiles.length);
            this.rawManFiles.splice(0, this.rawManFiles.length);
            this.rawlibFiles.splice(0, this.rawHeaderFiles.length);
            this.rawCompilerFiles.splice(0, this.rawCompilerFiles.length);
            this.rawInterpreterFiles.splice(0, this.rawInterpreterFiles.length);
            this.compatFlag = undefined;
            this.headersDir = undefined;
            const extractedDir = this.parent.getDirectory();
            const srcDir = join(extractedDir, "src");
            const docDir = join(extractedDir, "doc");
            this.headersDir = srcDir;
            const makeFile = join(srcDir, "Makefile");

            stat(makeFile)
                .then(makeFileStat => {
                    if (makeFileStat.isFile()) {
                        const rl = createInterface({
                            input: createReadStream(makeFile),
                            crlfDelay: Infinity
                        });

                        const lines: string[] = [];

                        rl.on("line", line => {
                            lines.push(line);
                        });

                        rl.on("close", () => {
                            const line_iter = (j: number) => {
                                if (j < lines.length) {
                                    const pattern = /\-D(LUA_COMPAT[A-Za-z0-9_]+)/;
                                    const match = pattern.exec(lines[j]);
                                    if (match) {
                                        this.compatFlag = match[1];
                                        line_iter(lines.length);
                                    }
                                    else {
                                        line_iter(j + 1);
                                    }
                                }
                                else { /* starting to process each expected file */
                                    readdir(docDir)
                                        .then(docFiles => {
                                            const docfile_iter = (k: number) => {
                                                if (k < docFiles.length) {
                                                    const docFile = docFiles[k];
                                                    if (targetManFiles[docFile]) {
                                                        const docFilePath = join(docDir, docFile);
                                                        stat(docFilePath)
                                                            .then(docStat => {
                                                                if (docStat.isFile()) {
                                                                    targetManFiles[docFile]();
                                                                    this.rawManFiles.push(docFilePath);
                                                                    docfile_iter(k + 1);
                                                                }
                                                                else {
                                                                    reject(new Error(`${docFile} is not a file`));
                                                                }
                                                            })
                                                            .catch(reject);
                                                    }
                                                    else {
                                                        docfile_iter(k + 1);
                                                    }
                                                }
                                                else if (!hasManLua) {
                                                    reject(new Error("lua.1 man file missing"));
                                                }
                                                else if (!hasManLuac) {
                                                    reject(new Error("luac.1 man file missing"));
                                                }
                                                else { /* All man files were found. Now, iterating source files */
                                                    readdir(srcDir)
                                                        .then(files => {
                                                            const file_iter = (i: number) => {
                                                                if (i < files.length) {
                                                                    const f = files[i];
                                                                    if (f.endsWith(".c")) {
                                                                        const fpath = join(srcDir, f);
                                                                        stat(fpath)
                                                                            .then(s => {
                                                                                if (s.isFile()) {
                                                                                    if (f === "lua.c") {
                                                                                        this.rawInterpreterFiles.push(fpath);
                                                                                    }
                                                                                    else if (f.startsWith("l") && f !== "luac.c") {
                                                                                        this.rawlibFiles.push(fpath);
                                                                                    }
                                                                                    else {
                                                                                        this.rawCompilerFiles.push(fpath);
                                                                                    }
                                                                                }
                                                                                file_iter(i + 1);
                                                                            })
                                                                            .catch(reject);
                                                                    }
                                                                    else if (targetHeaders[f]) {
                                                                        const fpath = join(srcDir, f);
                                                                        stat(fpath)
                                                                            .then(s => {
                                                                                if (s.isFile()) {
                                                                                    targetHeaders[f]();
                                                                                    this.rawHeaderFiles.push(fpath);
                                                                                }
                                                                                file_iter(i + 1);
                                                                            })
                                                                            .catch(reject);
                                                                    }
                                                                    else {
                                                                        file_iter(i + 1);
                                                                    }
                                                                }
                                                                else if (!hasluah) {
                                                                    reject(new Error("lua.h missing"));
                                                                }
                                                                else if (!hasluaconfh) {
                                                                    reject(new Error("luaconf.h missing"));
                                                                }
                                                                else if (!haslauxlibh) {
                                                                    reject(new Error("lauxlib.h missing"));
                                                                }
                                                                else if (!haslualibh) {
                                                                    reject(new Error("lualib.h missing"));
                                                                }
                                                                else if (this.rawInterpreterFiles.length === 0) {
                                                                    reject(new Error("lua.c missing"));
                                                                }
                                                                else if (this.rawCompilerFiles.length === 0) {
                                                                    reject(new Error("luac files missing"));
                                                                }
                                                                else if (!hasluahpp) {
                                                                    if (this.project.getVersion().compareTo(LUA_52_VERSION) < 0) {
                                                                        /*
                                                                        ** Note: on Lua 5.1 - Lua 5.1.5,
                                                                        **       lua.hpp is stored at
                                                                        **       ${lua-sources}/etc/lua.hpp
                                                                        */
                                                                        const f = "lua.hpp";
                                                                        const fpath = join(extractedDir, "etc", f);
                                                                        stat(fpath)
                                                                            .then(s => {
                                                                                if (s.isFile()) {
                                                                                    targetHeaders[f]();
                                                                                    this.rawHeaderFiles.push(fpath);
                                                                                    this.setConfigurationResult();
                                                                                    resolve();
                                                                                }
                                                                                else {
                                                                                    reject(new Error("lua.hpp is not a file"));
                                                                                }
                                                                            })
                                                                            .catch(reject);
                                                                    }
                                                                    else {
                                                                        reject(new Error("lua.hpp missing"));
                                                                    }
                                                                }
                                                                else {
                                                                    this.setConfigurationResult();
                                                                    resolve();
                                                                }
                                                            };

                                                            file_iter(0);
                                                        })
                                                        .catch(reject);
                                                }
                                            };

                                            docfile_iter(0);
                                        })
                                        .catch(reject);
                                }
                            };

                            line_iter(0);
                        });
                    }
                    else {
                        reject(new Error(`${makeFile} is not a file`));
                    }
                })
                .catch(reject);
        });
    }
    finalize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(`[End] Configure source code for the Lua ${this.project.getVersion().getString()} library`);
            resolve();
        });
    }
}
## Overview

Installs Lua / LuaJIT / OpenResty + LuaRocks in a single step inside the `.lua` folder in the current directory.

> [!IMPORTANT]
> 
> `setup-lua` **DOES NOT** set environment variables.

On the command line (or terminal), `setup-lua` is aware of predefined environment variables to build and install Lua / LuaJIT / OpenResty + LuaRocks.

> [!TIP]
> 
> `setup-lua` also works as a GitHub Action (see the [GitHub Actions docs](./GitHub.md)).

## Table of Contents

* [Introduction](#introduction)
* [Features](#features)
* [Inputs as Environment Variables](#inputs-as-environment-variables)
* [Building](#building)
* [Usage](#usage)
  * [Install the latest Lua and LuaRocks](#install-the-latest-lua-and-luarocks)
  * [Install LuaJIT and LuaRocks](#install-luajit-and-luarocks)
  * [Install OpenResty and LuaRocks](#install-openresty-and-luarocks)
  * [Install specific versions of Lua and LuaRocks](#install-specific-versions-of-lua-and-luarocks)
  * [Install Lua, but skip LuaRocks installation](#install-lua-but-skip-luarocks-installation)
  * [Miscellaneous](#miscellaneous)
    * [Install Lua using Clang](#install-lua-using-clang)
* [Advanced Usage](#advanced-usage)
  * [Install Lua using additional cflags](#install-lua-using-additional-cflags)
  * [Install Lua using additional include directories](#install-lua-using-additional-include-directories)
  * [Install Lua using additional ldflags](#install-lua-using-additional-ldflags)
  * [Install Lua using additional library directories](#install-lua-using-additional-library-directories)
  * [Install Lua linking to additional libraries](#install-lua-linking-to-additional-libraries)
  * [Install Lua applying patches](#install-lua-applying-patches)
  * [Install LuaRocks applying patches](#install-luarocks-applying-patches)

## Introduction

There is support to install three Lua interpreters:

* PUC-Lua ([https://lua.org/](https://lua.org/))
* LuaJIT ([https://luajit.org/](https://luajit.org/))
* OpenResty ([https://openresty.org/](https://openresty.org/))

By default, LuaRocks ([https://luarocks.org/](https://luarocks.org/)) always gets installed, but you can turn off the installation (see [here](#install-lua-but-skip-luarocks-installation)).

## Features

### Supported operating systems

* Windows
* Linux
* macOS
* BSD
    * FreeBSD
    * NetBSD
    * OpenBSD

### Interpreters

* Lua
    * Release versions (&ge; 5.1.1) available at [https://lua.org/ftp/](https://lua.org/ftp/)
    * All work versions (&ge; 5.1.1):
        * Current work at [https://lua.org/work/](https://lua.org/work/)
        * Archived works at [https://lua.org/work/old/](https://lua.org/work/old/)
* LuaJIT (&ge; v2.0.0)
* OpenResty (&ge; v2.0.0)

### LuaRocks

* On Unix:
    * Release versions (&ge; 3.9.1) available at [https://luarocks.github.io/luarocks/releases/](https://luarocks.github.io/luarocks/releases/)
    * By commit id, directly fetched from [https://github.com/luarocks/luarocks/](https://github.com/luarocks/luarocks/)
* On Windows (&ge; 3.9.1)

### File integrity check

* Each Lua tarball downloaded is matched against its published `sha256` hash
* Each LuaRocks released tarball or zip file downloaded is matched against a `sha256` hash

### File caching

Downloads of official released versions of Lua and LuaRocks are cached by default to speed up the installation process (*but can be turned off*).

### Advanced Features

* Applies user-provided `cflags` during the compilation of Lua / LuaJIT / OpenResty;
* Applies user-provided include directories during the compilation of Lua / LuaJIT / OpenResty;
* Applies user-provided `ldflags` during the linking of Lua;
* Applies user-provided library directories during the linking of Lua;
* Links to user-provided libraries during the linking of Lua;
* Applies custom patches to Lua / LuaJIT / OpenResty after fetching source code;
* Applies custom patches to LuaRocks after fetching source code.

## Inputs as Environment Variables

This tool has awareness for the environment variables listed in the following table

| Name | Required | Description |
|---|---|---|
| `LUA_VERSION` | `false` | The version of Lua / LuaJIT / OpenResty to install. |
| `LUAROCKS_VERSION` | `false` | The version of LuaRocks to use as a package manager for Lua / LuaJIT / OpenResty. A version 3.9.1 or newer is required on both Windows and Unix. |
| `CC` | `false` | The C compiler used to build Lua / LuaJIT / OpenResty. |
| `LD` | `false` | The linker used to build Lua / LuaJIT / OpenResty. |
| `AR` | `false` | The archiver used to create a static library for Lua / LuaJIT / OpenResty. |
| `RANLIB` | `false` | The tool employed to generate an index for the static library of Lua / LuaJIT / OpenResty. |
| `STRIP` | `false` | The tool to strip sections and symbols from the shared library of Lua / LuaJIT / OpenResty. |
| `RC` | `false` | The resource compiler used by LuaRocks. |
| `TOOLCHAIN_PREFIX` | `false` | The prefix common to all the tools above to setup Lua / LuaJIT / OpenResty and LuaRocks. |
| `MAKE` | `false` | The make tool used to build LuaJIT / OpenResty (*but not Lua*). |
| `USE_CACHE` | `false` | (default: `true`) Uses GitHub Cache Service to store tarballs and zip files downloaded from Lua and LuaRocks website. |
| `CFLAGS_EXTRA` | `false` | Uses additional compiler flags to compile Lua / LuaJIT / OpenResty. |
| `INCDIRS_EXTRA` | `false` | Uses additional include directories to compile Lua / LuaJIT / OpenResty. |
| `LDFLAGS_EXTRA` | `false` | Uses additional linker flags to link Lua. |
| `LIBDIRS_EXTRA` | `false` | Uses additional library directories to link Lua. |
| `LIBS_EXTRA` | `false` | Links Lua with additional libraries. |
| `LUA_PATCHES` | `false` | Apply patches to Lua / LuaJIT / OpenResty after fetching the source code. |
| `LUAROCKS_PATCHES` | `false` | Apply patches to LuaRocks after fetching the source code. |

## Building

1. Fetch the source code and change dir to the project folder

    ```bash
    git clone https://github.com/luau-project/setup-lua.git
    cd setup-lua
    ```

2. Install the dependencies

    ```bash
    npm install
    ```

3. Build

    ```bash
    npm run build
    ```

## Usage

In the examples below, on Unix systems, `nodejs` is assumed to be installed at `/opt/nodejs`.

### Install the latest Lua and LuaRocks

* Unix:

  ```bash
  env /opt/nodejs/bin/node dist/cli/index.js
  ```

* Windows:
  * GCC: assuming that both `nodejs` and `GCC` are on your PATH environment variable
    1. Launch `cmd`
    2. Install Lua and LuaRocks

        ```batch
        node dist\cli\index.js
        ```

  * MSVC:
    1. Launch Visual Studio developer prompt (`cmd` based version) for the architecture you want to build
    2. Install Lua and LuaRocks

        ```batch
        node dist\cli\index.js
        ```

### Install LuaJIT and LuaRocks

To install LuaJIT from the latest commit, you have to set `LUA_VERSION` environment variable to `luajit`. If you want it from a specific branch or commit, place the branch name or commit after the `@` symbol (e.g.: `luajit@v2.0` or `luajit@871db2c84ecefd70a850e03a6c340214a81739f0`).

* Unix:

  ```bash
  env "LUA_VERSION=luajit" /opt/nodejs/bin/node dist/cli/index.js
  ```

* Windows:
  * GCC: assuming that both `nodejs` and `GCC` are on your PATH environment variable
    1. Launch `cmd`
    2. Set `LUA_VERSION=luajit`

        ```batch
        SET "LUA_VERSION=luajit"
        ```

    3. Install LuaJIT and LuaRocks

        ```batch
        node dist\cli\index.js
        ```

  * MSVC:
    1. Launch Visual Studio developer prompt (`cmd` based version) for the architecture you want to build
    2. Set `LUA_VERSION=luajit`

        ```batch
        SET "LUA_VERSION=luajit"
        ```

    3. Install LuaJIT and LuaRocks

        ```batch
        node dist\cli\index.js
        ```

### Install OpenResty and LuaRocks

To install OpenResty from the latest commit, you have to set `LUA_VERSION` environment variable to `openresty`. If you want it from a specific branch or commit, place the branch name or commit after the `@` symbol (e.g.: `openresty@2.1-20231117.x` or `openresty@dcc9c9ee67e1a5d3d636bd7745e95ddb4a1c70bc`).

* Unix:

  ```bash
  env "LUA_VERSION=openresty" /opt/nodejs/bin/node dist/cli/index.js
  ```

* Windows:
  * GCC: assuming that both `nodejs` and `GCC` are on your PATH environment variable
    1. Launch `cmd`
    2. Set `LUA_VERSION=openresty`

        ```batch
        SET "LUA_VERSION=openresty"
        ```

    3. Install OpenResty and LuaRocks

        ```batch
        node dist\cli\index.js
        ```

  * MSVC:
    1. Launch Visual Studio developer prompt (`cmd` based version) for the architecture you want to build
    2. Set `LUA_VERSION=openresty`

        ```batch
        SET "LUA_VERSION=openresty"
        ```

    3. Install OpenResty and LuaRocks

        ```batch
        node dist\cli\index.js
        ```

### Install specific versions of Lua and LuaRocks

For a specific version of Lua, you have to set `LUA_VERSION` environment variable to a released version like `5.4.3` or just `5.4` for the latest on the series. For a specific LuaRocks, you have to set `LUAROCKS_VERSION` environment variable to a released version like `3.10.0`.

> [!NOTE]
> 
> The minimum LuaRocks version is `3.9.1`.

* Unix:

    ```bash
    env "LUA_VERSION=5.3.2" "LUAROCKS_VERSION=3.9.2" /opt/nodejs/bin/node dist/cli/index.js
    ```

* Windows:
  * GCC: assuming that both `nodejs` and `GCC` are on your PATH environment variable
    1. Launch `cmd`
    2. Set `LUA_VERSION` to the version you want

        ```batch
        SET "LUA_VERSION=5.3.2"
        ```

    3. Set `LUAROCKS_VERSION` to the desired version

        ```batch
        SET "LUAROCKS_VERSION=3.9.2"
        ```

    4. Install Lua and LuaRocks

        ```batch
        node dist\cli\index.js
        ```

  * MSVC:
    1. Launch Visual Studio developer prompt (`cmd` based version) for the architecture you want to build
    2. Set `LUA_VERSION` to the version you want

        ```batch
        SET "LUA_VERSION=5.3.2"
        ```

    3. Set `LUAROCKS_VERSION` to the desired version

        ```batch
        SET "LUAROCKS_VERSION=3.9.2"
        ```

    4. Install Lua and LuaRocks

        ```batch
        node dist\cli\index.js
        ```

### Install Lua, but skip LuaRocks installation

To skip LuaRocks installation, you must set `LUAROCKS_VERSION` environment variable to `none`.

* Unix:

    ```bash
    env "LUAROCKS_VERSION=none" /opt/nodejs/bin/node dist/cli/index.js
    ```

* Windows:
  * GCC: assuming that both `nodejs` and `GCC` are on your PATH environment variable
    1. Launch `cmd`
    2. Set `LUAROCKS_VERSION` to `none`

        ```batch
        SET "LUAROCKS_VERSION=none"
        ```

    3. Install Lua and LuaRocks

        ```batch
        node dist\cli\index.js
        ```

  * MSVC:
    1. Launch Visual Studio developer prompt (`cmd` based version) for the architecture you want to build
    2. Set `LUAROCKS_VERSION` to `none`

        ```batch
        SET "LUAROCKS_VERSION=none"
        ```

    3. Install Lua and LuaRocks

        ```batch
        node dist\cli\index.js
        ```

### Miscellaneous

#### Install Lua using Clang

* Unix:

  ```bash
  env \
  "CC=clang" \
  "LD=clang" \
  "AR=llvm-ar" \
  "RANLIB=llvm-ranlib" \
  "STRIP=llvm-strip" \
  /opt/nodejs/bin/node dist/cli/index.js
  ```

* Windows:
  * Clang: assuming that both `nodejs` and LLVM-MinGW tools ([https://github.com/mstorsjo/llvm-mingw](https://github.com/mstorsjo/llvm-mingw)) are on your PATH environment variable
    1. Launch `cmd`
    2. Set `CC` and `LD` to `clang`

        ```batch
        SET "CC=clang"
        SET "LD=clang"
        ```

    3. Install Lua and LuaRocks

        ```batch
        node dist\cli\index.js
        ```

> [!IMPORTANT]
> 
> Below, due a limitation in the build process of LuaJIT and OpenResty on Windows with MSVC-compatible tools, the build ignores `clang-cl`. Therefore, in the presence of MSVC, `cl` and `link` are used instead.

  * Clang-cl from MSVC:

    1. Launch Visual Studio developer prompt (`cmd` based version) for the architecture you want to build
    2. Set `CC` and `LD` to `clang-cl`, and `AR` to `llvm-lib`

        ```batch
        SET "CC=clang-cl"
        SET "LD=llvm-link"
        SET "AR=llvm-lib"
        ```

    3. Install Lua and LuaRocks

        ```batch
        node dist\cli\index.js
        ```

## Advanced Usage

> [!NOTE]
> 
> Below, each environment variable accepts a list of contents separated by a semicolon (`a;b;c`) $\to$ `a`, `b` and `c`. In case the content has `;` inside, you can escape it by placing two semicolons (`a;;aa;b;c`) $\to$ `a;aa`, `b` and `c`.

### Install Lua using additional cflags

* Unix

  ```bash
  env "CFLAGS_EXTRA=-DMY_GREAT_MACRO=1" /opt/nodejs/bin/node dist/cli/index.js
  ```

* Windows

  ```batch
  SET "CFLAGS_EXTRA=-DMY_GREAT_MACRO=1"
  node dist/cli/index.js
  ```

### Install Lua using additional include directories

* Unix

  ```bash
  env "INCDIRS_EXTRA=/opt/include/a;/opt/include/b" /opt/nodejs/bin/node dist/cli/index.js
  ```

* Windows

  ```batch
  SET "INCDIRS_EXTRA=C:\opt\include\a;C:\opt\include\b"
  node dist/cli/index.js
  ```

### Install Lua using additional ldflags

> [!NOTE]
> 
> Not applied in LuaJIT / OpenResty builds

* Unix

  ```bash
  env "LDFLAGS_EXTRA=-static-libgcc" /opt/nodejs/bin/node dist/cli/index.js
  ```

* Windows

  ```batch
  SET "LDFLAGS_EXTRA=-static-libgcc"
  node dist/cli/index.js
  ```

### Install Lua using additional library directories

> [!NOTE]
> 
> Not applied in LuaJIT / OpenResty builds

* Unix

  ```bash
  env "LIBDIRS_EXTRA=/opt/lib/a;/opt/lib/b" /opt/nodejs/bin/node dist/cli/index.js
  ```

* Windows

  ```batch
  SET "LIBDIRS_EXTRA=C:\libs\a;C:\libs\b"
  node dist/cli/index.js
  ```

### Install Lua linking to additional libraries

> [!NOTE]
> 
> Not applied in LuaJIT / OpenResty builds

* Unix

  ```bash
  env "LIBS_EXTRA=history;ncurses" /opt/nodejs/bin/node dist/cli/index.js
  ```

* Windows

  ```batch
  SET "LIBS_EXTRA=history;ncurses"
  node dist/cli/index.js
  ```

### Install Lua applying patches

In this example, we apply patches provided in the files `my-great-change.patch` and `my-small-change.patch` after fetching Lua / LuaJIT / OpenResty source code.

* Unix

  ```bash
  env "LUA_PATCHES=my-great-change.patch;my-small-change.patch" /opt/nodejs/bin/node dist/cli/index.js
  ```

* Windows

  ```batch
  SET "LUA_PATCHES=my-great-change.patch;my-small-change.patch"
  node dist/cli/index.js
  ```

### Install LuaRocks applying patches

In this example, we apply patches provided in the files `my-great-change.patch` and `my-small-change.patch` after fetching LuaRocks source code.

* Unix

  ```bash
  env "LUAROCKS_PATCHES=my-great-change.patch;my-small-change.patch" /opt/nodejs/bin/node dist/cli/index.js
  ```

* Windows

  ```batch
  SET "LUAROCKS_PATCHES=my-great-change.patch;my-small-change.patch"
  node dist/cli/index.js
  ```

[Back to home](../)
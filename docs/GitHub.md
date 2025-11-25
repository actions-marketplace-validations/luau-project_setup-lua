## Overview

Installs Lua / LuaJIT / OpenResty + LuaRocks in a single step inside the `.lua` folder in the current directory.

> [!TIP]
> 
> `setup-lua` also works as a standalone CLI nodejs application (see the [CLI docs](./CLI.md)).

## Table of Contents

* [Introduction](#introduction)
* [Features](#features)
* [Inputs](#inputs)
* [Building](#building)
* [Usage](#usage)
  * [Minimal working example](#minimal-working-example)
  * [Install the latest Lua and LuaRocks](#install-the-latest-lua-and-luarocks)
  * [Install LuaJIT and LuaRocks](#install-luajit-and-luarocks)
  * [Install OpenResty and LuaRocks](#install-openresty-and-luarocks)
  * [Install specific versions of Lua and LuaRocks](#install-specific-versions-of-lua-and-luarocks)
  * [Install Lua, but skip LuaRocks installation](#install-lua-but-skip-luarocks-installation)
  * [Miscellaneous](#miscellaneous)
    * [Install Lua using Clang](#install-lua-using-clang)
    * [Install Lua using a C++ compiler](#install-lua-using-a-c-compiler)
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

## Inputs

| Name | Required | Description |
|---|---|---|
| `lua-version` | `false` | The version of Lua / LuaJIT / OpenResty to install. |
| `luarocks-version` | `false` | The version of LuaRocks to use as a package manager for Lua / LuaJIT / OpenResty. A version 3.9.1 or newer is required on both Windows and Unix. |
| `cc` | `false` | The C compiler used to build Lua / LuaJIT / OpenResty. |
| `ld` | `false` | The linker used to build Lua / LuaJIT / OpenResty. |
| `ar` | `false` | The archiver used to create a static library for Lua / LuaJIT / OpenResty. |
| `ranlib` | `false` | The tool employed to generate an index for the static library of Lua / LuaJIT / OpenResty. |
| `strip` | `false` | The tool to strip sections and symbols from the shared library of Lua / LuaJIT / OpenResty. |
| `rc` | `false` | The resource compiler used by LuaRocks. |
| `toolchain-prefix` | `false` | The prefix common to all the tools above to setup Lua / LuaJIT / OpenResty and LuaRocks. |
| `make` | `false` | The make tool used to build LuaJIT / OpenResty (*but not Lua*). |
| `use-cache` | `false` | (default: `true`) Uses GitHub Cache Service to store tarballs and zip files downloaded from Lua and LuaRocks website. |
| `cflags-extra` | `false` | Uses additional compiler flags to compile Lua / LuaJIT / OpenResty. |
| `incdirs-extra` | `false` | Uses additional include directories to compile Lua / LuaJIT / OpenResty. |
| `ldflags-extra` | `false` | Uses additional linker flags to link Lua. |
| `libdirs-extra` | `false` | Uses additional library directories to link Lua. |
| `libs-extra` | `false` | Links Lua with additional libraries. |
| `lua-patches` | `false` | Apply patches to Lua / LuaJIT / OpenResty after fetching the source code. |
| `luarocks-patches` | `false` | Apply patches to LuaRocks after fetching the source code. |

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

### Minimal working example

```yaml
name: Setup Lua
on: push
jobs:
  install-lua:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os:
          - ubuntu-latest
          - windows-latest
          - macos-latest
        lua-version:
          - 5.1
          - 5.2
          - 5.3
          - 5.4
          - luajit
          - openresty
        is-msvc:
          - true
          - false
        exclude:
          - os: ubuntu-latest
            is-msvc: true
          - os: macos-latest
            is-msvc: true
    steps:
      - uses: actions/checkout@v5
      - name: Setup MSVC developer prompt
        uses: ilammy/msvc-dev-cmd@v1
        if: ${{ runner.os == 'Windows' && matrix.is-msvc }}
      - name: Install Lua
        uses: luau-project/setup-lua@v1
        with:
          lua-version: ${{ matrix.lua-version }}
      - name: Display the Lua version
        run: lua -v
      - name: Test Lua
        run: lua -e "print('this is a test from ' .. _VERSION)"
      - name: Display LuaRocks version
        run: luarocks --version
```

**Explanation**: This snippet installs Lua (or LuaJIT or OpenResty, depending on the matrix) `+` LuaRocks, and configures the environment for the toolchain that was used to build Lua. When the `lua-version` field of the matrix assumes `luajit` or `openresty` values, it fetches the latest source code from their GitHub repositories, [https://github.com/LuaJIT/LuaJIT/](https://github.com/LuaJIT/LuaJIT/) and [https://github.com/openresty/luajit2/](https://github.com/openresty/luajit2/), respectively.

> [!NOTE]
> 
> * On most operating systems, `setup-lua` uses `cc` as the default C compiler and linker to build Lua / LuaJIT / OpenResty, which is often `GCC` or `Clang`.
> 
> * On Windows, when you load Visual Studio developer prompt details (e.g.: [ilammy/msvc-dev-cmd](https://github.com/ilammy/msvc-dev-cmd)) for the Microsoft Visual Studio C/C++ compiler (MSVC), `setup-lua` adopts MSVC as the selected toolchain to build Lua / LuaJIT / OpenResty. Otherwise, if you don't load Visual Studio developer prompt, `setup-lua` examines environment variables to decide between the use of `gcc` or `cc` to build Lua / LuaJIT / OpenResty.

### Install the latest Lua and LuaRocks

If you just want to install the latest versions of Lua and LuaRocks, you are all set by the following `yaml`:

```yaml
      - name: Install Lua
        uses: luau-project/setup-lua@v1
```

It is possible to install a specific Lua version using the format `X.Y.Z`:

```yaml
      - name: Install Lua
        uses: luau-project/setup-lua@v1
        with:
          lua-version: 5.3.3
```

There are shorthands to install the latest version within a minor Lua release. For instance, the following code installs Lua 5.2.4:

```yaml
      - name: Install Lua
        uses: luau-project/setup-lua@v1
        with:
          lua-version: 5.2
```

### Install LuaJIT and LuaRocks

For a LuaJIT installation from the latest commit available on the GitHub mirror [https://github.com/LuaJIT/LuaJIT](https://github.com/LuaJIT/LuaJIT):

```yaml
      - name: Install LuaJIT
        uses: luau-project/setup-lua@v1
        with:
          lua-version: luajit
```

To install LuaJIT from a specific commit, use the format `luajit@ref` as shown below:

```yaml
      - name: Install LuaJIT
        uses: luau-project/setup-lua@v1
        with:
          lua-version: luajit@871db2c84ecefd70a850e03a6c340214a81739f0
```

> [!TIP]
> 
> If you use the branch name after `@`, the latest commit on that branch is going to be installed. Thus, `lua-version: luajit@v2.0` installs the latest commit on v2.0 branch. It is also possible to provide a tag.

### Install OpenResty and LuaRocks

For a OpenResty installation from the latest commit available on the GitHub mirror [https://github.com/openresty/luajit2](https://github.com/openresty/luajit2):

```yaml
      - name: Install OpenResty
        uses: luau-project/setup-lua@v1
        with:
          lua-version: openresty
```

To install OpenResty from a specific commit, use the format `openresty@ref` as shown below:

```yaml
      - name: Install OpenResty
        uses: luau-project/setup-lua@v1
        with:
          lua-version: openresty@dcc9c9ee67e1a5d3d636bd7745e95ddb4a1c70bc
```

> [!TIP]
> 
> If you use the branch name after `@`, the latest commit on that branch is going to be installed. Thus, `lua-version: openresty@2.1-20231117.x` installs the latest commit on 2.1-20231117.x branch. It is also possible to provide a tag.

### Install specific versions of Lua and LuaRocks

Specific versions for Lua and LuaRocks can be installed by using `lua-version` and `luarocks-version` parameters, respectively.

> [!NOTE]
> 
> The minimum LuaRocks version is `3.9.1`.

```yaml
      - name: Install Lua
        uses: luau-project/setup-lua@v1
        with:
          lua-version: 5.2.1
          luarocks-version: 3.9.2
```

On Unix, LuaRocks can also be installed from a specific commit or tag. To do that, use the format `luarocks-version: @ref`:

```yaml
      - name: Install Lua
        uses: luau-project/setup-lua@v1
        with:
          lua-version: 5.4.3
          luarocks-version: @23179297c03878d437e15fc84afc26199082ab09
```

### Install Lua, but skip LuaRocks installation

To skip LuaRocks installation, you have to supply `luarocks-version: none` to the action:

```yaml
      - name: Install Lua
        uses: luau-project/setup-lua@v1
        with:
          luarocks-version: none
```

### Miscellaneous

#### Install Lua using Clang

For this, we are going to assume that Clang is installed at a custom location not in the PATH environment variable.

> [!NOTE]
> 
> * On Unix, we assume that `/opt/llvm-clang` is the top installation directory such that `clang` compiler can be found at `/opt/llvm-clang/bin/clang`. On Windows, we are going to assume that `C:\llvm-clang` the top installation directory such that `clang` compiler can be found at `C:\llvm-clang\bin\clang.exe`;
> * In case `clang` is already on your system PATH environment variable, you can omit the `toolchain-prefix` input.

* Unix

  ```yaml
        - name: Install Lua
          uses: luau-project/setup-lua@v1
          with:
            cc: clang
            ld: clang
            toolchain-prefix: /opt/llvm-clang/bin/
  ```

* Windows

  * Clang from LLVM-MinGW ([https://github.com/mstorsjo/llvm-mingw](https://github.com/mstorsjo/llvm-mingw)):

    ```yaml
          - name: Install Lua
            uses: luau-project/setup-lua@v1
            with:
              cc: clang
              ld: clang
              toolchain-prefix: C:\llvm-clang\bin\
    ```

  * Clang shipped by Visual Studio:

    ```yaml
          - name: Setup MSVC developer prompt
            uses: ilammy/msvc-dev-cmd@v1
          - name: Install Lua
            uses: luau-project/setup-lua@v1
            with:
              cc: clang-cl
              ld: llvm-link
              ar: llvm-lib
    ```

> [!IMPORTANT]
> 
> Due a limitation in the build process of LuaJIT and OpenResty on Windows with MSVC-compatible tools, the build ignores `clang-cl`. Therefore, in the presence of MSVC, `cl` and `link` are used instead.

#### Install Lua using a C++ compiler

This time, we assume that you are going to use `g++`, and also that it is on your system PATH environment variable. **Tip**: also works with `clang++`.

  ```yaml
        - name: Install Lua
          uses: luau-project/setup-lua@v1
          with:
            cc: g++
            ld: g++
            lua-version: 5.4.8
  ```

## Advanced Usage

> [!NOTE]
> 
> Below, each input accepts a list of contents separated by a semicolon (`a;b;c`) $\to$ `a`, `b` and `c`. In case the content has `;` inside, you can escape it by placing two semicolons (`a;;aa;b;c`) $\to$ `a;aa`, `b` and `c`.

### Install Lua using additional cflags

  ```yaml
        - name: Install Lua
          uses: luau-project/setup-lua@v1
          with:
            cflags-extra: -DMY_GREAT_MACRO=1
  ```

### Install Lua using additional include directories

  ```yaml
        - name: Install Lua
          uses: luau-project/setup-lua@v1
          with:
            incdirs-extra: /opt/include/a;/opt/include/b
  ```

### Install Lua using additional ldflags

> [!NOTE]
> 
> Not applied in LuaJIT / OpenResty builds

  ```yaml
        - name: Install Lua
          uses: luau-project/setup-lua@v1
          with:
            ldflags-extra: -static-libgcc
  ```

### Install Lua using additional library directories

> [!NOTE]
> 
> Not applied in LuaJIT / OpenResty builds

  ```yaml
        - name: Install Lua
          uses: luau-project/setup-lua@v1
          with:
            libdirs-extra: /opt/lib/a;/opt/lib/b
  ```

### Install Lua linking to additional libraries

> [!NOTE]
> 
> Not applied in LuaJIT / OpenResty builds

  ```yaml
        - name: Install Lua
          uses: luau-project/setup-lua@v1
          with:
            libs-extra: history;ncurses
  ```

### Install Lua applying patches

In this example, we apply patches provided in the files `my-great-change.patch` and `my-small-change.patch` after fetching Lua / LuaJIT / OpenResty source code.

  ```yaml
        - name: Install Lua
          uses: luau-project/setup-lua@v1
          with:
            lua-patches: my-great-change.patch;my-small-change.patch
  ```

### Install LuaRocks applying patches

In this example, we apply patches provided in the files `my-great-change.patch` and `my-small-change.patch` after fetching LuaRocks source code.

  ```yaml
        - name: Install Lua
          uses: luau-project/setup-lua@v1
          with:
            luarocks-patches: my-great-change.patch;my-small-change.patch
  ```

[Back to home](../)
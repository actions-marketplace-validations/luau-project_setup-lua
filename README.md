## Overview

Installs Lua / LuaJIT / OpenResty + LuaRocks in a single step inside the `.lua` folder in the current directory.

## Usage

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

## Further usage

In `setup-lua`, the most important inputs are `lua-version` and `luarocks-version`, so that you can choose specific versions to install. There are many options to tweak `setup-lua`: see [GitHub Actions docs](./docs/GitHub.md#inputs) for an exhaustive list of inputs.

### Version requirements

* Lua:
  * PUC-Lua (&ge; 5.1.1)
  * LuaJIT (&ge; v2.0.0)
  * OpenResty (&ge; v2.0.0)
* LuaRocks (&ge; 3.9.1)

### Install specific Lua and LuaRocks version

```yaml
      - name: Install Lua
        uses: luau-project/setup-lua@v1
        with:
          lua-version: 5.3.4
          luarocks-version: 3.12.0
```

### Install Lua, but skip LuaRocks installation

In order to skip LuaRocks installation, use `none` as the value for the `luarocks-version` input as follows:

```yaml
      - name: Install Lua
        uses: luau-project/setup-lua@v1
        with:
          lua-version: 5.4.7
          luarocks-version: none
```

> [!TIP]
> 
> `setup-lua` also handles work versions of Lua (&ge; 5.1.1):
>    * current work: [https://lua.org/work/](https://lua.org/work/)
>    * legacy work: [https://lua.org/work/old/](https://lua.org/work/old/)

Thus, you can test your project on the upcoming Lua 5.5.0. However, be aware that LuaRocks does not support it yet:

```yaml
      - name: Install Lua 5.5.0 (RC2)
        uses: luau-project/setup-lua@v1
        with:
          lua-version: 5.5.0-rc2
          luarocks-version: none
```

### Install specific LuaJIT and LuaRocks version

Use the syntax `luajit@ref` with `ref` meaning a branch name, a tag or the `sha` of a commit. The example below installs LuaJIT from the commit `871db2c84ecefd70a850e03a6c340214a81739f0`: 

```yaml
      - name: Install LuaJIT
        uses: luau-project/setup-lua@v1
        with:
          lua-version: luajit@871db2c84ecefd70a850e03a6c340214a81739f0
          luarocks-version: 3.12.1
```

### Install specific OpenResty and LuaRocks version

Use the syntax `openresty@ref` with `ref` meaning a branch name, a tag or the `sha` of a commit. The example below installs OpenResty from the tag `v2.1-20250826`:

```yaml
      - name: Install OpenResty
        uses: luau-project/setup-lua@v1
        with:
          lua-version: openresty@v2.1-20250826
          luarocks-version: 3.12.2
```

## Working modes

`setup-lua` works in two modes: i) as a GitHub Action; ii) as a standalone CLI nodejs application.

In order to ease navigation and avoid excess of information, a complete reference for both modes can be found in the following documents:

1. [GitHub Actions docs](./docs/GitHub.md);
2. [CLI docs](./docs/CLI.md).

---
[Back to Top](#overview)
> [!IMPORTANT]
> 
> This tool is still in early testing. **DO NOT** use it while this alert is here.

## Overview

Installs Lua / LuaJIT / OpenResty + LuaRocks in a single step inside the `.lua` folder in the current directory.

`setup-lua` works in two flavors:

1. As a GitHub Action (see the [GitHub Actions docs](./docs/GitHub.md));
2. As a standalone CLI nodejs application (see the [CLI docs](./docs/CLI.md)).

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
        * Current work at [https://lua.org/ftp/work/](https://lua.org/ftp/work/)
        * Archived works at [https://lua.org/ftp/work/old/](https://lua.org/ftp/work/old/)
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

## Advanced Features

* Applies user-provided `cflags` during the compilation of Lua / LuaJIT / OpenResty;
* Applies user-provided include directories during the compilation of Lua / LuaJIT / OpenResty;
* Applies user-provided `ldflags` during the linking of Lua;
* Applies user-provided library directories during the linking of Lua / LuaJIT / OpenResty;
* Links to user-provided libraries during the linking of Lua / LuaJIT / OpenResty;
* Applies custom patches to Lua / LuaJIT / OpenResty after fetching source code;
* Applies custom patches to LuaRocks after fetching source code.
## setup-lua v1.0.7

* Added support to use the latest release candidate of Lua 5.5.0 (`5.5.0-rc4`).

## setup-lua v1.0.6

* Added support to use the latest release candidate of Lua 5.5.0 (`5.5.0-rc3`).

## setup-lua v1.0.5

* Added support to use the latest release candidate of Lua 5.5.0 (`5.5.0-rc2`).

## setup-lua v1.0.4

* Fixed a bug that caused the build of PUC-Lua to fail when the C compiler and linker was chosen as `clang++`;
* Added a CI job to ensure that PUC-Lua, LuaJIT and OpenResty build fine using `clang` as C compiler on Ubuntu;
* Tried to fix trigger conditions to skip CI when pushing tags, and keep ignoring changes on docs and markdown files.

## setup-lua v1.0.3

* Fixed a bug that didn't set `PKG_CONFIG_PATH` and `CMAKE_PREFIX_PATH` to make Lua / LuaJIT / OpenResty discoverable by `pkgconf` and `cmake`.

## setup-lua v1.0.2

* Added support to use the latest release candidate of Lua 5.5.0 (`5.5.0-rc1`).
* Fixed a bug to find the extracted directory name for release candidate versions of Lua.
* Fixed links in the documentation for work versions of Lua.

## setup-lua v1.0.1

* This is a bug-fix release. The main bug fixed lies in the part to set values for the `external_deps_dirs` LuaRocks config variable in order to adjust entries for `GCC`-like toolchains. Now, `C:\external` is going to be the first entry in the table `external_deps_dirs`, together with `%SYSTEMDRIVE%\external` as a second entry when `%SYSTEMDRIVE%` is not `C:`.
* Fixed a bug that didn't add the install bin directory to PATH environment variable when `luarocks-version` was `none`.
* Now, the examples on home page and also on docs for the GitHub Action only show the major version (e.g.: `luau-project/setup-lua@v1`). This has the intent to keep people with up-to-date versions whenever a minor or patch release takes place, removing the need for consumers of this action to update their workflows.

## setup-lua v1.0.0

Initial release.
## setup-lua v1.0.1

* This is a bug-fix release. The main bug fixed lies in the part to set values for the `external_deps_dirs` LuaRocks config variable in order to adjust entries for `GCC`-like toolchains. Now, `C:\external` is going to be the first entry in the table `external_deps_dirs`, together with `%SYSTEMDRIVE%\external` as a second entry when `%SYSTEMDRIVE%` is not `C:`.
* Now, the examples on home page and also on docs for the GitHub Action only show the major version (e.g.: `luau-project/setup-lua@v1`). This has the intent to keep people with up-to-date versions whenever a minor or patch release takes place, removing the need for consumers of this action to update their workflows.

## setup-lua v1.0.0

Initial release.
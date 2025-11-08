usage()
{
    echo
    echo "usage:"
    echo "    sh pack.sh"
    echo "        to generate a tar.gz"
    echo
}

if [ "$1" = "--help" ];
then
    usage
else
    script_dir="$(dirname "$0")"
    leading_dir="$(basename "$script_dir")"
    if [ "$leading_dir" = "setup-lua" ];
    then
        parent_dir="$(dirname "$script_dir")"
        if [ -d "$parent_dir" ];
        then
            if [ -f "$script_dir/package.json" ];
            then
                initial_dir="$PWD"
                if [ -d "$parent_dir" ];
                then
                    cd $parent_dir
                    tar -czvf "${initial_dir}/setup-lua.tar.gz" \
                        --exclude=.git \
                        --exclude=.vscode \
                        --exclude=src/CacheService.ts \
                        --exclude=src/GitHubCore.ts \
                        --exclude=package-lock.json \
                        --exclude=node_modules \
                        $leading_dir
                    cd $initial_dir
                else
                    echo "Invalid directory name to pack. Please, rename the pack directory to \`setup-lua'"
                    exit 1
                fi
            else
                echo "This is NOT setup-lua directory"
                exit 1
            fi
        else
            echo "'$parent_dir' is NOT a directory"
            exit 1
        fi
    else
        echo "Invalid directory name to pack. Please, rename the pack directory to \`setup-lua'"
        exit 1
    fi
fi
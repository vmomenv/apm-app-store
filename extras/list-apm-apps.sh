#!/usr/bin/env bash

get_script_dir() {
    local source="${BASH_SOURCE[0]}"
    while [ -L "$source" ]; do
        local dir="$(cd -P "$(dirname "$source")" && pwd)"
        source="$(readlink "$source")"
        [[ $source != /* ]] && source="$dir/$source"
    done
    local dir="$(cd -P "$(dirname "$source")" && pwd)"
    echo "$dir"
}

find_apm_launcher() {
    local script_dir="$1"
    local paths=(
        "${script_dir}/../extras/shell-helper/apm-launcher"
        "/home/momen/Desktop/apm-app-store/extras/shell-helper/apm-launcher"
        "/opt/apm-store/extras/shell-helper/apm-launcher"
        "/usr/local/bin/apm-launcher"
    )
    
    for path in "${paths[@]}"; do
        if [[ -f "$path" ]]; then
            echo "$path"
            return 0
        fi
    done
    
    return 1
}

SCRIPT_DIR="$(get_script_dir)"
APM_LAUNCHER="$(find_apm_launcher "$SCRIPT_DIR")"

if [[ -z "$APM_LAUNCHER" ]]; then
    echo "Error: apm-launcher not found" >&2
    exit 1
fi

SHOW_DESKTOP=false

function show_help() {
    echo "Usage: $(basename "$0") [OPTIONS] [KEYWORD]"
    echo ""
    echo "List installed APM packages or desktop applications."
    echo ""
    echo "Options:"
    echo "  -d, --desktop       List only desktop applications (with .desktop files)"
    echo "  -h, --help          Show this help message"
    echo ""
    echo "Arguments:"
    echo "  KEYWORD             Filter results by keyword (optional)"
    echo ""
    echo "Examples:"
    echo "  $(basename "$0")                    # List all installed packages"
    echo "  $(basename "$0") firefox            # Search for firefox in packages"
    echo "  $(basename "$0") -d                 # List all desktop applications"
    echo "  $(basename "$0") --desktop firefox  # Search for desktop apps named firefox"
}

if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    show_help
    exit 0
fi

if [[ "$1" == "-d" || "$1" == "--desktop" ]]; then
    SHOW_DESKTOP=true
    SEARCH_KEYWORD="${2:-}"
else
    SEARCH_KEYWORD="${1:-}"
fi

function get_desktop_name() {
    local desktop_file="$1"
    local name=""
    
    if [[ -f "$desktop_file" ]]; then
        name=$(grep -m1 '^Name=' "$desktop_file" | cut -d= -f2-)
    fi
    
    echo "$name"
}

if [[ "$SHOW_DESKTOP" == "true" ]]; then
    echo "正在扫描已安装包中的桌面应用..."
    echo ""
    
    installed_pkgs=$(apm list --installed 2>/dev/null | \
        sed 's/\x1b\[[0-9;]*m//g' | \
        grep -vE "^Listing|^$|^\[INFO\]|^警告" | \
        grep "/" | \
        awk '{split($1,a,"/"); print a[1]}' | \
        sort)
    
    if [[ -z "$installed_pkgs" ]]; then
        echo "未找到匹配的已安装包"
        exit 0
    fi
    
    printf "%-35s %-20s %-10s | %s\n" "PKGNAME" "VERSION" "ARCH" "DESCRIPTION"
    printf "%-35s-%-20s-%-10s-+-%s\n" "-----------------------------------" "--------------------" "----------" "---------"
    
    while IFS= read -r pkgname; do
        [[ -z "$pkgname" ]] && continue
        
        desktop_files=$("$APM_LAUNCHER" list "$pkgname" 2>/dev/null)
        
        if [[ -n "$desktop_files" ]]; then
            IFS=',' read -ra files <<< "$desktop_files"
            for df in "${files[@]}"; do
                app_name=$(get_desktop_name "$df")
                if [[ -n "$app_name" ]]; then
                    pkg_info=$(apm show "$pkgname" 2>/dev/null)
                    version=$(echo "$pkg_info" | grep "^Version:" | cut -d: -f2 | xargs)
                    arch=$(echo "$pkg_info" | grep "^Architecture:" | cut -d: -f2 | xargs)
                    description=$(echo "$pkg_info" | grep "^Description:" | cut -d: -f2- | xargs)
                    
                    [[ -z "$arch" ]] && arch="amd64"
                    
                    if [[ -n "$SEARCH_KEYWORD" ]]; then
                        if [[ "$app_name" =~ $SEARCH_KEYWORD ]] || [[ "$pkgname" =~ $SEARCH_KEYWORD ]]; then
                            printf "%-35s %-20s %-10s | %s\n" "$pkgname" "$version" "$arch" "$app_name"
                        fi
                    else
                        printf "%-35s %-20s %-10s | %s\n" "$pkgname" "$version" "$arch" "$app_name"
                    fi
                fi
            done
        fi
    done <<< "$installed_pkgs"
    
    exit 0
fi

if [[ -n "$SEARCH_KEYWORD" ]]; then
    installed_pkgs=$(apm list --installed 2>/dev/null | \
        sed 's/\x1b\[[0-9;]*m//g' | \
        grep -vE "^Listing|^$|^\[INFO\]|^警告" | \
        grep "/" | \
        awk '{split($1,a,"/"); print a[1]}' | \
        grep -i "${SEARCH_KEYWORD}" | \
        sort)
    
    if [[ -z "$installed_pkgs" ]]; then
        echo "未找到匹配的已安装包"
        exit 0
    fi
    
    printf "%-35s %-20s %-10s | %s\n" "PKGNAME" "VERSION" "ARCH" "DESCRIPTION"
    printf "%-35s-%-20s-%-10s-+-%s\n" "-----------------------------------" "--------------------" "----------" "---------"
    
    while IFS= read -r pkgname; do
        [[ -z "$pkgname" ]] && continue
        
        pkg_info=$(apm show "$pkgname" 2>/dev/null)
        version=$(echo "$pkg_info" | grep "^Version:" | cut -d: -f2 | xargs)
        arch=$(echo "$pkg_info" | grep "^Architecture:" | cut -d: -f2 | xargs)
        description=$(echo "$pkg_info" | grep "^Description:" | cut -d: -f2- | xargs)
        
        [[ -z "$arch" ]] && arch="amd64"
        
        printf "%-35s %-20s %-10s | %s\n" "$pkgname" "$version" "$arch" "${description:0:50}"
    done <<< "$installed_pkgs"
    
    exit 0
fi

if [[ "$SHOW_DESKTOP" == "false" && -z "$SEARCH_KEYWORD" ]]; then
    apm list --installed 2>/dev/null | \
        sed 's/\x1b\[[0-9;]*m//g' | \
        grep -vE "^Listing|^$|^\[INFO\]|^警告" | \
        grep "/" | \
        awk '{
            n = split($0, parts, "/")
            pkgname = parts[1]
            if (pkgname == "") next
            version = $2
            sub(/,.*/, "", version)
            arch = $3
            match($0, /\[(.+)\]/, m)
            flags = m[1]
            printf "%-35s %-20s %-8s [%s]\n", pkgname, version, arch, flags
        }' | sort
    
    exit 0
fi

#!/bin/bash

# 1. 检查是否提供了至少一个参数
if [[ $# -eq 0 ]]; then
    echo "错误：未提供命令参数。"
    echo "用法: $0 [apm|aptss|ssinstall] <子命令> [参数...]"
    exit 1
fi

# 2. 获取第一个参数作为主指令
command_type="$1"

# 3. 根据指令类型分发逻辑
case "$command_type" in
    "apm")
        # 执行 apm 命令（跳过第一个参数）
        /usr/bin/apm "${@:2}" 2>&1
        exit_code=$?
        ;;

    "ssinstall")
        # 执行 ssinstall 命令（跳过第一个参数）
        /usr/bin/ssinstall "${@:2}" --native 2>&1
        exit_code=$?
        if [[ "$exit_code" != "0" ]];then
            echo "安装失败，可尝试安装对应的 APM 版本应用；若无对应的 APM 版本应用，可提交用户反馈"
        fi
        ;;

    "aptss")
        # 针对 aptss 的特殊逻辑：如果是 remove 子命令，需要图形化确认
        if [[ "$2" == "remove" ]]; then
            packages="${@:3}"
            
            # 确认框通用参数
            title="确认卸载"
            text="正在准备卸载: $packages\n\n若这是您下达的卸载指令，请选择确认继续卸载"

            # 优先尝试 garma，其次 zenity
            if command -v garma &> /dev/null; then
                garma --question --title="$title" --text="$text" \
                      --ok-label="确认卸载" --cancel-label="取消" --width=400
                confirmed=$?
            elif command -v zenity &> /dev/null; then
                zenity --question --title="$title" --text="$text" \
                       --ok-label="确认卸载" --cancel-label="取消" --width=400
                confirmed=$?
            else
                echo "错误：未找到 garma 或 zenity，无法显示确认对话框。卸载操作已拒绝。"
                exit 1
            fi

            # 根据确认结果执行
            if [[ $confirmed -eq 0 ]]; then
                /usr/bin/aptss "${@:2}" -y 2>&1
                exit_code=$?
            else
                echo "操作已取消"
                exit 0
            fi
        elif [[ "$2" == "install" ]]; then
            packages="${@:3}"
            # 确认框通用参数
            title="确认安装"
            text="正在准备安装: $packages\n\n若这是您下达的安装指令，请选择确认继续安装"

            # 优先尝试 garma，其次 zenity
            if command -v garma &> /dev/null; then
                garma --question --title="$title" --text="$text" \
                      --ok-label="确认安装" --cancel-label="取消" --width=400
                confirmed=$?
            elif command -v zenity &> /dev/null; then
                zenity --question --title="$title" --text="$text" \
                       --ok-label="确认安装" --cancel-label="取消" --width=400
                confirmed=$?
            else
                echo "错误：未找到 garma 或 zenity，无法显示确认对话框。安装操作已拒绝。"
                exit 1
            fi

            # 根据确认结果执行
            if [[ $confirmed -eq 0 ]]; then
                /usr/bin/aptss "${@:2}" -y 2>&1
                exit_code=$?
            else
                echo "操作已取消"
                exit 0
            fi

        else
            # 非 remove 命令，拒绝执行
            echo "拒绝执行 aptss 白名单外的指令"
            exit 1
        fi
        ;;

    *)
        # 兜底：拒绝非法指令
        echo "拒绝执行：仅允许执行 'apm', 'aptss' 或 'ssinstall'。收到的参数: '$command_type'"
        exit 1
        ;;
esac

exit $exit_code
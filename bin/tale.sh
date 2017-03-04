#!/bin/bash
# author:biezhi
# url:https://github.com/otale/scripts


# Usage: sh tale.sh start "-Xms128m -Xmx128m"
# Usage: sh tale.sh stop
# Usage: sh tale.sh status
# Usage: sh tale.sh reload 10
# Usage: sh tale.sh log

env_args="-Xms128m -Xmx128m"
sleeptime=0
arglen=$#

# get tale pid
get_pid(){
    pname="`find .. -name 'tale*.jar'`"
    pname=${pname:3}
    pid=`ps -ef | grep $pname | grep -v grep | awk '{print $2}'`
    echo "$pid"
}

startup(){
    pid=$(get_pid)
    if [ "$pid" != "" ]
    then
        echo "Tale already startup!"
    else
        jar_path=`find .. -name 'tale*.jar'`
        echo "jarfile=$jar_path"
        cmd="java $1 -jar $jar_path > ./tale.out < /dev/null &"
        echo "cmd: $cmd"
        java $1 -jar $jar_path > ./tale.out < /dev/null &
        show_log
    fi
}

shut_down(){
    pid=$(get_pid)
    if [ "$pid" != "" ]
    then
        kill -9 $pid
        echo "Tale is stop!"
    else
        echo "Tale already stop!"
    fi
}

show_log(){
    tail -f tale.out
}

show_help(){
    echo -e "\r\n\t欢迎使用Tale Blog"
    echo -e "\r\nUsage: sh tale.sh start|stop|reload|status|log"
    exit
}

show_status(){
    pid=$(get_pid)
    if [ "$pid" != "" ]
    then
        echo "Tale is running with pid: $pid"
    else
        echo "Tale is stop!"
    fi
}

if [ $arglen -eq 0 ]
 then
    show_help
else
    if [ "$2" != "" ]
    then
        env_args="$2"
    fi
    case "$1" in
        "start")
            startup "$env_args"
            ;;
        "stop")
            shut_down
            ;;
        "reload")
            echo "reload"
            ;;
        "status")
            show_status
            ;;
        "log")
            show_log
            ;;
    esac
fi
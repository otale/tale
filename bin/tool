#!/bin/sh

APP_NAME="tale"
JAVA_OPTS="-Xms256m -Xmx256m -Dfile.encoding=UTF-8"
psid=0

checkpid() {
   javaps=$(pgrep -f "tale-latest")

   if [ -n "$javaps" ]; then
      psid=$javaps
   else
      psid=0
   fi
}

start() {
   checkpid

   if [ $psid -ne 0 ]; then
      echo "================================"
      echo "warn: $APP_NAME already started! (pid=$psid)"
      echo "================================"
   else
      echo "Starting $APP_NAME ..."
      nohup java $JAVA_OPTS -jar tale-latest.jar --app.env=prod >/dev/null 2>&1 &
      sleep 1
      checkpid
      if [ $psid -ne 0 ]; then
         echo "(pid=$psid) [OK]"
      else
         echo "[Failed]"
      fi
   fi
}

stop() {
   checkpid

   if [ $psid -ne 0 ]; then
      echo -n "Stopping $APP_NAME ...(pid=$psid) "
      kill -9 $psid

      if [ $? -eq 0 ]; then
         echo "[OK]"
      else
         echo "[Failed]"
      fi

      checkpid
      if [ $psid -ne 0 ]; then
         stop
      fi
   else
      echo "================================"
      echo "warn: $APP_NAME is not running"
      echo "================================"
   fi
}

status() {
   checkpid
   if [ $psid -ne 0 ];  then
      echo "$APP_NAME is running! (pid=$psid)"
   else
      echo "$APP_NAME is not running"
   fi
}

showlog() {
   tail -f logs/tale.log
}

get_latest_release() {
  curl --silent "https://api.github.com/repos/$1/releases/latest" | # Get latest release from GitHub api
    grep '"tag_name":' |                                            # Get tag line
    sed -E 's/.*"([^"]+)".*/\1/'                                    # Pluck JSON value
}

REMOVE_LOCAL_THEME=1

upgrade(){
    echo "是否允许覆盖本地主题 (y/n)?"
    read con
    case $con in
        y|yes|Y|YES)
            REMOVE_THEME=1
        ;;
        *)
            break
        ;;
    esac

    # 备份当前目录
    TIME=`date +%Y%m%d_%H%m`
    tar czvf back_$TIME.tar.gz *
    echo '备份成功'

    echo '开始下载最新版本.'

    TAG_VERSION=$(get_latest_release "otale/tale")
    wget -N --no-check-certificate https://github.com/otale/tale/releases/download/$TAG_VERSION/tale.tar.gz

    mkdir upgrade_tmp
    tar -zxvf $APP_NAME.tar.gz -C upgrade_tmp
    sh tool stop
    rm -rf lib tale-latest.jar tool resources/static resources/templates/admin resources/templates/comm resources/templates/*.html resources/*.properties

    if [ "$REMOVE_LOCAL_THEME" -eq "1" ]; then
        rm -rf resources/templates/themes
        mv upgrade_tmp/resources/templates/themes resources/templates
    fi

    mv upgrade_tmp/lib .
    mv upgrade_tmp/tale-latest.jar .
    mv upgrade_tmp/tool .
    chmod +x tool
    mv upgrade_tmp/resources/static ./resources
    mv upgrade_tmp/resources/*.properties ./resources
    mv upgrade_tmp/resources/templates/admin ./resources/templates
    mv upgrade_tmp/resources/templates/comm ./resources/templates
    mv upgrade_tmp/resources/templates/*.html ./resources/templates

    echo '升级完毕, 请执行 sh tool restart 重启博客系统!'

    rm -rf upgrade_tmp
    rm -rf tale.tar.gz
}

case "$1" in
   'start')
      start
      ;;
   'stop')
     stop
     ;;
   'restart')
     stop
     start
     ;;
   'status')
     status
     ;;
   'log')
     showlog
     ;;
   'upgrade')
     upgrade
     ;;
  *)
     echo "Usage: $0 {start | stop | restart | status | upgrade | log}"
     exit 1
esac
exit 0
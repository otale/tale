#!/bin/sh

APP_NAME="tale"
get_latest_release() {
  curl --silent "https://api.github.com/repos/$1/releases/latest" | # Get latest release from GitHub api
    grep '"tag_name":' |                                            # Get tag line
    sed -E 's/.*"([^"]+)".*/\1/'                                    # Pluck JSON value
}

TAG_VERSION=$(get_latest_release "otale/tale")

wget -N --no-check-certificate https://github.com/otale/tale/releases/download/$TAG_VERSION/tale.tar.gz

echo '下载完毕'

mkdir $APP_NAME
tar -zxvf $APP_NAME.tar.gz -C $APP_NAME && cd $APP_NAME
chmod +x tool

echo '安装成功，请进入 tale 目录执行 sh tool start 启动'
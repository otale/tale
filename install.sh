#!/bin/bash
## 替换为非开发模式 TODO 正则替换
sed -i '' "s/app.devMode=true/app.devMode=false/g" src/main/resources/app.properties

## 发包脚本
mvn clean package -Pprod -Dmaven.test.skip=true

## 替换为开发模式 TODO 正则替换
sed -i '' "s/app.devMode=false/app.devMode=true/g" src/main/resources/app.properties

## 发包
scp -rp target/dist root@aliyun:/home/ganx/wars
